import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { createCheckoutSession } from '@/lib/stripe'
import { PRICING } from '@/types'

const schema = z.object({
  tier: z.enum(['BASIC', 'PRO']),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })

  const { tier } = parsed.data
  const priceId = PRICING[tier].priceId

  if (!priceId) return NextResponse.json({ error: 'Price not configured' }, { status: 500 })

  const url = await createCheckoutSession(session.user.id, priceId, tier)
  return NextResponse.json({ url })
}
