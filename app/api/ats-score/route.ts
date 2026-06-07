import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { anthropic } from '@/lib/anthropic'
import type { ATSScoreResult } from '@/types'

const schema = z.object({
  coverLetterContent: z.string().min(50).max(8000),
  jobDescription: z.string().min(50).max(8000),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (session.user.subscriptionTier !== 'PRO') {
    return NextResponse.json({ error: 'PRO tier required' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })
  }

  const { coverLetterContent, jobDescription } = parsed.data

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Analyze this cover letter against the job description for ATS compatibility.

JOB DESCRIPTION:
${jobDescription}

COVER LETTER:
${coverLetterContent}

Return a JSON object with exactly this structure (no markdown, just JSON):
{
  "score": <number 0-100>,
  "matchedKeywords": [<array of keywords from job description found in cover letter>],
  "missingKeywords": [<array of important keywords from job description NOT in cover letter>],
  "suggestions": [<array of 2-3 specific suggestions to improve ATS score>]
}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return NextResponse.json({ error: 'Failed to parse ATS analysis' }, { status: 500 })
  }

  const result = JSON.parse(jsonMatch[0]) as ATSScoreResult
  return NextResponse.json(result)
}
