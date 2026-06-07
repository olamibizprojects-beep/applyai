import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { anthropic } from '@/lib/anthropic'

const schema = z.object({
  coverLetterContent: z.string().max(8000).optional(),
  companyName: z.string().min(1).max(200),
  jobTitle: z.string().min(1).max(200),
  type: z.enum(['application', 'interview-thankyou', 'checkin']),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.subscriptionTier === 'FREE') return NextResponse.json({ error: 'BASIC tier required' }, { status: 403 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })

  const { coverLetterContent, companyName, jobTitle, type } = parsed.data

  const typePrompts = {
    application: `Write a brief follow-up email to check on the status of a job application. The candidate applied for ${jobTitle} at ${companyName}. Keep it under 150 words, professional, and not pushy.`,
    'interview-thankyou': `Write a thank-you email to send after a job interview for ${jobTitle} at ${companyName}. Reference the conversation, reiterate interest, mention one specific thing discussed. Under 200 words.`,
    checkin: `Write a polite check-in email for a ${jobTitle} role at ${companyName} where the candidate hasn't heard back in 2 weeks. Professional, brief, under 120 words.`,
  }

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `${typePrompts[type]}${coverLetterContent ? `\n\nContext from cover letter:\n${coverLetterContent.slice(0, 1000)}` : ''}\n\nOutput only the email text, starting with Subject: line.`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return NextResponse.json({ email: text })
}
