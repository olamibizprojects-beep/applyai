import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))
vi.mock('@/lib/ratelimit', () => ({
  rateLimitAnonymous: vi.fn().mockResolvedValue({ success: true }),
  checkAndIncrementGenerations: vi.fn().mockResolvedValue(undefined),
}))
vi.mock('@/lib/anthropic', () => ({
  streamCoverLetter: vi.fn().mockImplementation(async function* () {
    yield 'Dear Hiring Manager,\n\nTest letter content.'
  }),
}))
vi.mock('@/lib/prisma', () => ({
  prisma: { coverLetter: { create: vi.fn().mockResolvedValue({}) } },
}))

import { auth } from '@/lib/auth'
import { rateLimitAnonymous, checkAndIncrementGenerations } from '@/lib/ratelimit'

const mockAuth = auth as ReturnType<typeof vi.fn>
const mockRateLimit = rateLimitAnonymous as ReturnType<typeof vi.fn>
const mockCheckGenerations = checkAndIncrementGenerations as ReturnType<typeof vi.fn>

function makeRequest(body: Record<string, unknown>) {
  return new Request('http://localhost/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/generate', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuth.mockResolvedValue(null)
    mockRateLimit.mockResolvedValue({ success: true })
    mockCheckGenerations.mockResolvedValue(undefined)
  })

  it('rejects requests with invalid job description', async () => {
    const { POST } = await import('@/app/api/generate/route')
    const req = makeRequest({ jobDescription: 'too short', resumeText: 'my resume', tone: 'PROFESSIONAL' })
    const res = await POST(req as any)
    expect(res.status).toBe(400)
  })

  it('rejects anonymous users over rate limit', async () => {
    mockRateLimit.mockResolvedValue({ success: false })
    const { POST } = await import('@/app/api/generate/route')
    const req = makeRequest({
      jobDescription: 'A'.repeat(200),
      resumeText: 'my resume experience',
      tone: 'PROFESSIONAL',
    })
    const res = await POST(req as any)
    expect(res.status).toBe(429)
  })

  it('blocks authenticated free users at generation limit', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1', subscriptionTier: 'FREE' } })
    mockCheckGenerations.mockRejectedValue(new Error('GENERATION_LIMIT_REACHED:15:3'))
    const { POST } = await import('@/app/api/generate/route')
    const req = makeRequest({
      jobDescription: 'A'.repeat(200),
      resumeText: 'my resume experience',
      tone: 'PROFESSIONAL',
    })
    const res = await POST(req as any)
    expect(res.status).toBe(429)
    const data = await res.json()
    expect(data.error).toBe('GENERATION_LIMIT_REACHED')
  })

  it('sanitizes HTML from input', async () => {
    mockAuth.mockResolvedValue({ user: { id: 'user1', subscriptionTier: 'BASIC' } })
    const { streamCoverLetter } = await import('@/lib/anthropic')
    const mockStream = streamCoverLetter as ReturnType<typeof vi.fn>

    const { POST } = await import('@/app/api/generate/route')
    await POST(makeRequest({
      jobDescription: '<script>evil</script>' + 'A'.repeat(200),
      resumeText: '<b>my resume</b>',
      tone: 'PROFESSIONAL',
    }) as any)

    expect(mockStream).toHaveBeenCalledWith(
      expect.objectContaining({
        jobDescription: expect.not.stringContaining('<script>'),
      })
    )
  })
})
