import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
  },
}))

// Mock Redis
vi.mock('@upstash/redis', () => ({
  Redis: vi.fn().mockImplementation(() => ({})),
}))
vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: vi.fn().mockImplementation(() => ({
    limit: vi.fn().mockResolvedValue({ success: true }),
  })),
}))

import { prisma } from '@/lib/prisma'
import { checkAndIncrementGenerations } from '@/lib/ratelimit'

const mockPrisma = prisma as unknown as {
  user: {
    findUnique: ReturnType<typeof vi.fn>
    update: ReturnType<typeof vi.fn>
  }
}

describe('checkAndIncrementGenerations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows generation when under limit', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      generationsUsed: 1,
      generationsResetAt: new Date(),
    })
    mockPrisma.user.update.mockResolvedValue({})

    await expect(checkAndIncrementGenerations('user1', 'FREE')).resolves.toBeUndefined()
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { generationsUsed: { increment: 1 } } })
    )
  })

  it('blocks at the free tier limit of 3', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      generationsUsed: 3,
      generationsResetAt: new Date(),
    })

    await expect(checkAndIncrementGenerations('user1', 'FREE')).rejects.toThrow('GENERATION_LIMIT_REACHED')
  })

  it('allows unlimited for BASIC tier', async () => {
    await expect(checkAndIncrementGenerations('user1', 'BASIC')).resolves.toBeUndefined()
    expect(mockPrisma.user.findUnique).not.toHaveBeenCalled()
  })

  it('resets counter when a new month has passed', async () => {
    const oldDate = new Date()
    oldDate.setMonth(oldDate.getMonth() - 1)

    mockPrisma.user.findUnique.mockResolvedValue({
      generationsUsed: 3,
      generationsResetAt: oldDate,
    })
    mockPrisma.user.update.mockResolvedValue({})

    await expect(checkAndIncrementGenerations('user1', 'FREE')).resolves.toBeUndefined()
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ generationsUsed: 1 }) })
    )
  })
})
