import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import { prisma } from '@/lib/prisma'
import { TIER_LIMITS } from '@/types'
import type { Tier } from '@/types'

function getRedis() {
  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL ?? '',
    token: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
  })
}

function getAnonymousLimiter() {
  return new Ratelimit({
    redis: getRedis(),
    limiter: Ratelimit.slidingWindow(1, '24 h'),
    analytics: false,
    prefix: 'applyai:anon',
  })
}

export async function rateLimitAnonymous(ip: string) {
  return getAnonymousLimiter().limit(ip)
}

export async function checkAndIncrementGenerations(userId: string, tier: Tier): Promise<void> {
  const limits = TIER_LIMITS[tier]

  if (limits.generationsPerMonth === Infinity) return

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { generationsUsed: true, generationsResetAt: true },
  })

  if (!user) throw new Error('User not found')

  const now = new Date()
  const resetAt = new Date(user.generationsResetAt)
  const monthsElapsed =
    (now.getFullYear() - resetAt.getFullYear()) * 12 + (now.getMonth() - resetAt.getMonth())

  if (monthsElapsed >= 1) {
    await prisma.user.update({
      where: { id: userId },
      data: { generationsUsed: 1, generationsResetAt: now },
    })
    return
  }

  if (user.generationsUsed >= limits.generationsPerMonth) {
    const nextReset = new Date(resetAt.getFullYear(), resetAt.getMonth() + 1, resetAt.getDate())
    const daysUntilReset = Math.ceil((nextReset.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    throw new Error(
      `GENERATION_LIMIT_REACHED:${daysUntilReset}:${limits.generationsPerMonth}`
    )
  }

  await prisma.user.update({
    where: { id: userId },
    data: { generationsUsed: { increment: 1 } },
  })
}
