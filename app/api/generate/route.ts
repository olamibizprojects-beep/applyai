import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { streamCoverLetter } from '@/lib/anthropic'
import { prisma } from '@/lib/prisma'
import { checkAndIncrementGenerations, rateLimitAnonymous } from '@/lib/ratelimit'
import type { Tone } from '@/types'

const generateSchema = z.object({
  jobDescription: z.string().min(100, 'Job description must be at least 100 characters').max(8000),
  resumeText: z.string().min(10, 'Resume text is required').max(8000),
  tone: z.enum(['PROFESSIONAL', 'ENTHUSIASTIC', 'CONCISE', 'CREATIVE']),
  additionalContext: z.string().max(1000).optional(),
  companyName: z.string().max(200).optional(),
  jobTitle: z.string().max(200).optional(),
})

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim()
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'

    // Anonymous rate limiting
    if (!session?.user?.id) {
      const { success } = await rateLimitAnonymous(ip)
      if (!success) {
        return NextResponse.json(
          { error: 'Anonymous limit reached. Sign up for free to get 3 generations per month.' },
          { status: 429 }
        )
      }
    } else {
      // Authenticated user — check tier limits
      try {
        await checkAndIncrementGenerations(session.user.id, session.user.subscriptionTier)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Limit reached'
        if (message.startsWith('GENERATION_LIMIT_REACHED:')) {
          const [, daysLeft, limit] = message.split(':')
          return NextResponse.json(
            { error: 'GENERATION_LIMIT_REACHED', daysLeft: parseInt(daysLeft), limit: parseInt(limit) },
            { status: 429 }
          )
        }
        throw err
      }
    }

    const body = await req.json()
    const parsed = generateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      )
    }

    let { jobDescription, resumeText, tone, additionalContext, companyName, jobTitle } = parsed.data

    // Sanitize inputs
    jobDescription = stripHtml(jobDescription).slice(0, 8000)
    resumeText = stripHtml(resumeText).slice(0, 8000)
    additionalContext = additionalContext ? stripHtml(additionalContext).slice(0, 1000) : undefined

    let fullContent = ''

    const stream = new ReadableStream({
      async start(controller) {
        try {
          const generator = streamCoverLetter({
            jobDescription,
            resumeText,
            tone: tone as Tone,
            additionalContext,
            companyName,
            jobTitle,
          })

          for await (const chunk of generator) {
            fullContent += chunk
            controller.enqueue(new TextEncoder().encode(chunk))
          }

          // Save to DB for authenticated users
          if (session?.user?.id && fullContent) {
            try {
              await prisma.coverLetter.create({
                data: {
                  userId: session.user.id,
                  companyName: companyName ?? 'Unknown Company',
                  jobTitle: jobTitle ?? 'Unknown Role',
                  jobDescription,
                  tone: tone as Tone,
                  content: fullContent,
                  status: 'DRAFT',
                },
              })
            } catch {
              // Non-critical — don't fail the stream if DB save fails
            }
          }

          controller.close()
        } catch (err) {
          const message = err instanceof Error ? err.message : 'Generation failed'
          if (message.includes('rate_limit')) {
            controller.enqueue(new TextEncoder().encode('\n\n[ERROR:RATE_LIMITED]'))
          } else if (message.includes('timeout')) {
            controller.enqueue(new TextEncoder().encode('\n\n[ERROR:TIMEOUT]'))
          } else {
            controller.enqueue(new TextEncoder().encode('\n\n[ERROR:GENERATION_FAILED]'))
          }
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('[generate] error:', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
