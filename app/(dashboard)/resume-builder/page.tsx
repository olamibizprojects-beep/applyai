import { type Metadata } from 'next'
import { auth } from '@/lib/auth'
import { ResumeBuilderPage } from '@/components/resume-builder/ResumeBuilderPage'
import type { Tier } from '@/types'

export const metadata: Metadata = { title: 'ATS Resume Builder' }

export default async function ResumeBuilderRoute() {
  const session = await auth()
  const tier = (session?.user?.subscriptionTier ?? 'FREE') as Tier

  return <ResumeBuilderPage tier={tier} />
}
