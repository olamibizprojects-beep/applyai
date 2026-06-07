import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createCustomerPortalSession } from '@/lib/stripe'

export async function POST() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { stripeCustomerId: true } })
  if (!user?.stripeCustomerId) return NextResponse.json({ error: 'No billing account found' }, { status: 400 })

  const url = await createCustomerPortalSession(user.stripeCustomerId)
  return NextResponse.json({ url })
}
