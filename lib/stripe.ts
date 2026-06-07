import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'

// Stripe is lazily initialised — routes will throw a clear error at
// runtime if STRIPE_SECRET_KEY is missing, but the build & all
// non-payment pages will work fine without it.
const getStripeClient = (): Stripe => {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new Error('Stripe is not configured yet. Add STRIPE_SECRET_KEY to .env.local.')
  return new Stripe(key, { apiVersion: '2026-05-27.dahlia' })
}

export const stripe: Stripe = new Proxy({} as Stripe, {
  get(_t, prop) {
    return (getStripeClient() as unknown as Record<string | symbol, unknown>)[prop]
  },
})

export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { stripeCustomerId: true } })

  if (user?.stripeCustomerId) return user.stripeCustomerId

  const customer = await stripe.customers.create({ email, metadata: { userId } })

  await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customer.id } })

  return customer.id
}

export async function createCheckoutSession(userId: string, priceId: string, tier: string): Promise<string> {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, stripeCustomerId: true } })
  if (!user?.email) throw new Error('User not found')

  const customerId = await getOrCreateStripeCustomer(userId, user.email)

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { userId, tier },
    subscription_data: {
      trial_period_days: tier === 'PRO' ? 7 : undefined,
      metadata: { userId, tier },
    },
  })

  if (!session.url) throw new Error('Failed to create checkout session')
  return session.url
}

export async function createCustomerPortalSession(customerId: string): Promise<string> {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  })
  return session.url
}
