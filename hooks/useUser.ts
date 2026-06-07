import { useSession } from 'next-auth/react'
import type { Tier } from '@/types'

export function useUser() {
  const { data: session, status } = useSession()

  return {
    user: session?.user ?? null,
    tier: (session?.user?.subscriptionTier ?? 'FREE') as Tier,
    generationsUsed: session?.user?.generationsUsed ?? 0,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}
