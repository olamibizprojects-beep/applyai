import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/stripe', () => ({
  stripe: {
    webhooks: {
      constructEvent: vi.fn(),
    },
    subscriptions: {
      retrieve: vi.fn().mockResolvedValue({ current_period_end: Math.floor(Date.now() / 1000) + 86400 }),
    },
  },
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      update: vi.fn().mockResolvedValue({}),
      updateMany: vi.fn().mockResolvedValue({}),
      findUnique: vi.fn().mockResolvedValue({ email: 'test@test.com', name: 'Test User' }),
    },
  },
}))

vi.mock('resend', () => ({
  Resend: vi.fn().mockImplementation(() => ({
    emails: { send: vi.fn().mockResolvedValue({}) },
  })),
}))

import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const mockStripe = stripe as unknown as {
  webhooks: { constructEvent: ReturnType<typeof vi.fn> }
}
const mockPrisma = prisma as unknown as {
  user: {
    update: ReturnType<typeof vi.fn>
    updateMany: ReturnType<typeof vi.fn>
  }
}

describe('Stripe webhook handler', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.STRIPE_WEBHOOK_SECRET = 'test_secret'
    process.env.STRIPE_BASIC_PRICE_ID = 'price_basic'
    process.env.STRIPE_PRO_PRICE_ID = 'price_pro'
    process.env.RESEND_API_KEY = 'test_key'
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
    process.env.RESEND_FROM_EMAIL = 'test@test.com'
  })

  it('rejects requests with invalid signatures', async () => {
    mockStripe.webhooks.constructEvent.mockImplementationOnce(() => {
      throw new Error('Invalid signature')
    })

    const { POST } = await import('@/app/api/stripe/webhook/route')
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'invalid_sig' },
      body: 'bad_payload',
    })

    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('upgrades user on checkout.session.completed', async () => {
    mockStripe.webhooks.constructEvent.mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: { userId: 'user123', tier: 'BASIC' },
          customer: 'cus_test',
          subscription: 'sub_test',
        },
      },
    })

    const { POST } = await import('@/app/api/stripe/webhook/route')
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'valid_sig' },
      body: '{}',
    })

    await POST(req as any)
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ subscriptionTier: 'BASIC' }) })
    )
  })

  it('downgrades user on subscription deleted', async () => {
    mockStripe.webhooks.constructEvent.mockReturnValue({
      type: 'customer.subscription.deleted',
      data: { object: { customer: 'cus_test', id: 'sub_test' } },
    })

    const { POST } = await import('@/app/api/stripe/webhook/route')
    const req = new Request('http://localhost/api/stripe/webhook', {
      method: 'POST',
      headers: { 'stripe-signature': 'valid_sig' },
      body: '{}',
    })

    await POST(req as any)
    expect(mockPrisma.user.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ subscriptionTier: 'FREE' }) })
    )
  })
})
