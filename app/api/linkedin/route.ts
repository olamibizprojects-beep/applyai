import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { anthropic } from '@/lib/anthropic'

const schema = z.object({
  profileText: z.string().min(50).max(8000),
  targetRole: z.string().min(2).max(200),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.subscriptionTier !== 'PRO') return NextResponse.json({ error: 'PRO tier required' }, { status: 403 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })

  const { profileText, targetRole } = parsed.data

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are a LinkedIn optimization expert. Rewrite this profile for someone targeting: ${targetRole}

CURRENT PROFILE:
${profileText}

Return JSON only (no markdown):
{
  "headline": "<optimized headline under 220 chars, keyword-rich>",
  "about": "<rewritten About section 2-3 paragraphs, first-person, compelling, keyword-rich for the target role>",
  "experienceBullets": ["<rewritten bullet 1>", "<rewritten bullet 2>", "<rewritten bullet 3>", "<rewritten bullet 4>", "<rewritten bullet 5>"]
}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })

  return NextResponse.json(JSON.parse(jsonMatch[0]))
}
