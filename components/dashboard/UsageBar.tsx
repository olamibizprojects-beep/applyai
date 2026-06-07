'use client'

import { Progress } from '@/components/ui/progress'
import { TIER_LIMITS } from '@/types'
import type { Tier } from '@/types'
import Link from 'next/link'

interface UsageBarProps {
  used: number
  tier: Tier
  compact?: boolean
}

export function UsageBar({ used, tier, compact = false }: UsageBarProps) {
  const limit = TIER_LIMITS[tier].generationsPerMonth
  const isUnlimited = limit === Infinity

  if (isUnlimited) {
    if (compact) return null
    return (
      <div className="text-xs text-[#10B981] font-medium">Unlimited generations</div>
    )
  }

  const pct = Math.min((used / limit) * 100, 100)
  const color = pct >= 100 ? 'bg-red-500' : pct >= 66 ? 'bg-amber-400' : 'bg-[#3B82F6]'

  return (
    <div className={compact ? '' : 'space-y-2'}>
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span>{used} of {limit} used this month</span>
        {!compact && pct >= 66 && (
          <span className={pct >= 100 ? 'text-red-500 font-medium' : 'text-amber-500 font-medium'}>
            {pct >= 100 ? 'Limit reached' : `${limit - used} left`}
          </span>
        )}
      </div>
      <div className="w-full bg-[#E2E8F0] rounded-full h-1.5 overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      {!compact && tier === 'FREE' && (
        <Link href="/pricing" className="text-xs text-[#3B82F6] hover:underline">
          Upgrade for unlimited →
        </Link>
      )}
    </div>
  )
}
