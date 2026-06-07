import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { anthropic } from '@/lib/anthropic'
import type { BulletRewriteResult } from '@/types'

const schema = z.object({
  bullets: z.array(z.string().max(500)).min(1).max(10),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.subscriptionTier === 'FREE') return NextResponse.json({ error: 'BASIC tier required' }, { status: 403 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 })

  const { bullets } = parsed.data

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Rewrite these resume bullet points to be more impactful. Use strong action verbs, add quantification where possible, and make them ATS-friendly.

BULLETS:
${bullets.map((b, i) => `${i + 1}. ${b}`).join('\n')}

Return JSON only (no markdown):
{
  "rewritten": [
    { "original": "<original bullet>", "improved": "<rewritten bullet>" }
  ]
}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) return NextResponse.json({ error: 'Failed to parse response' }, { status: 500 })

  return NextResponse.json(JSON.parse(jsonMatch[0]) as BulletRewriteResult)
}
