import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import type { Stripe } from 'stripe'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? 'placeholder')
}

function tierFromPriceId(priceId: string): 'FREE' | 'BASIC' | 'PRO' {
  if (priceId === process.env.STRIPE_BASIC_PRICE_ID) return 'BASIC'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'PRO'
  return 'FREE'
}

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 })

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const tier = session.metadata?.tier as 'BASIC' | 'PRO'

        if (!userId) break

        const subscription = session.subscription
          ? await stripe.subscriptions.retrieve(session.subscription as string)
          : null

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionTier: tier,
            stripeCustomerId: session.customer as string,
            subscriptionId: session.subscription as string | null,
            subscriptionEnd: subscription
              ? new Date(((subscription as unknown as { current_period_end: number }).current_period_end) * 1000)
              : null,
          },
        })

        const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } })
        if (user?.email) {
          await getResend().emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? 'noreply@applyai.ink',
            to: user.email,
            subject: `You're now on ApplyAI ${tier}!`,
            html: `
              <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 12px; padding: 40px; border: 1px solid #E2E8F0;">
                  <h1 style="color: #0F172A;">You're now on ApplyAI ${tier}! 🎉</h1>
                  <p style="color: #64748B;">Your subscription is active. ${tier === 'PRO' ? 'You have access to all features including ATS scoring and LinkedIn optimization.' : 'You have access to unlimited generations, all tones, PDF/DOCX export, and more.'}</p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/generate" style="display: inline-block; background: #3B82F6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Start generating →</a>
                </div>
              </div>
            `,
          }).catch(() => {})
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const priceId = subscription.items.data[0]?.price?.id
        const tier = priceId ? tierFromPriceId(priceId) : 'FREE'

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionTier: tier,
            subscriptionId: subscription.id,
            subscriptionEnd: new Date(((subscription as unknown as { current_period_end: number }).current_period_end) * 1000),
          },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        await prisma.user.updateMany({
          where: { stripeCustomerId: customerId },
          data: {
            subscriptionTier: 'FREE',
            subscriptionId: null,
            subscriptionEnd: null,
          },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const user = await prisma.user.findUnique({
          where: { stripeCustomerId: customerId },
          select: { email: true, name: true },
        })

        if (user?.email) {
          await getResend().emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? 'noreply@applyai.ink',
            to: user.email,
            subject: 'Action required: Payment failed for ApplyAI',
            html: `
              <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: white; border-radius: 12px; padding: 40px; border: 1px solid #E2E8F0;">
                  <h1 style="color: #EF4444;">Payment failed ⚠️</h1>
                  <p style="color: #64748B;">We couldn't process your ApplyAI subscription payment. Please update your payment method to keep your account active.</p>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings" style="display: inline-block; background: #EF4444; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;">Update payment method →</a>
                </div>
              </div>
            `,
          }).catch(() => {})
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[stripe webhook] error:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
