import { useState } from 'react'
import { TIER_LIMITS } from '@/types'
import { useUser } from './useUser'

export function useGenerations() {
  const { tier, generationsUsed } = useUser()
  const limit = TIER_LIMITS[tier].generationsPerMonth
  const remaining = limit === Infinity ? Infinity : Math.max(0, limit - generationsUsed)
  const isAtLimit = remaining === 0

  return {
    used: generationsUsed,
    limit,
    remaining,
    isAtLimit,
    isUnlimited: limit === Infinity,
    percentage: limit === Infinity ? 0 : Math.min(100, (generationsUsed / limit) * 100),
  }
}
