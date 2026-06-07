import { type Metadata } from 'next'
import { auth } from '@/lib/auth'
import { GeneratorWizard } from '@/components/generator/GeneratorWizard'
import type { Tier } from '@/types'

export const metadata: Metadata = { title: 'Generate Cover Letter' }

export default async function GeneratePage() {
  const session = await auth()
  const tier = (session?.user?.subscriptionTier ?? 'FREE') as Tier

  return <GeneratorWizard tier={tier} />
}
