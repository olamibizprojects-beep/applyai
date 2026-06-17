import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { TIER_LIMITS } from '@/types'
import { streamResumeOptimization } from '@/lib/anthropic'

const schema = z.object({
  resumeText: z.string().min(50, 'Resume must be at least 50 characters').max(10000),
  jobDescription: z.string().min(50, 'Job description must be at least 50 characters').max(8000),
  companyName: z.string().max(100).optional(),
  jobTitle: z.string().max(100).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const tier = session.user.subscriptionTier
  if (!TIER_LIMITS[tier].resumeBuilder) {
    return NextResponse.json({ error: 'PRO subscription required for Resume Builder' }, { status: 403 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
  }

  const { resumeText, jobDescription, companyName, jobTitle } = parsed.data

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const generator = streamResumeOptimization({ resumeText, jobDescription, companyName, jobTitle })
        for await (const chunk of generator) {
          controller.enqueue(new TextEncoder().encode(chunk))
        }
        controller.close()
      } catch (err) {
        const message = err instanceof Error ? err.message : ''
        if (message.includes('rate_limit')) {
          controller.enqueue(new TextEncoder().encode('\n\n[ERROR:RATE_LIMITED]'))
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
}
