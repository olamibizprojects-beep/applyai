import { type Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ApplicationBoard } from '@/components/dashboard/ApplicationBoard'
import { UpgradeModal } from '@/components/shared/UpgradeModal'
import type { Tier, ApplicationRecord } from '@/types'

export const metadata: Metadata = { title: 'Job Tracker' }

export default async function TrackerPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const tier = (session.user.subscriptionTier ?? 'FREE') as Tier
  const apps = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { appliedAt: 'desc' },
  })

  const isLocked = tier === 'FREE'

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Job Tracker</h1>
          <p className="text-[#64748B] text-sm mt-1">Track every application from applied to offer.</p>
        </div>
      </div>

      {isLocked ? (
        <div className="relative">
          <div className="blur-sm pointer-events-none">
            <ApplicationBoard initialApps={[
              { id: '1', userId: '', coverLetterId: null, companyName: 'Google', jobTitle: 'Senior Engineer', jobUrl: null, stage: 'APPLIED', notes: null, appliedAt: new Date(), followUpAt: null, updatedAt: new Date() },
              { id: '2', userId: '', coverLetterId: null, companyName: 'Stripe', jobTitle: 'Product Engineer', jobUrl: null, stage: 'INTERVIEW', notes: null, appliedAt: new Date(), followUpAt: null, updatedAt: new Date() },
            ] as ApplicationRecord[]} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-lg p-8 text-center max-w-sm">
              <h2 className="font-bold text-[#0F172A] text-lg mb-2">Upgrade to track applications</h2>
              <p className="text-[#64748B] text-sm mb-4">Job Tracker is available on Basic and Pro plans.</p>
              <a href="/pricing" className="inline-block bg-[#3B82F6] text-white px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-[#2563EB] transition-colors">
                Upgrade for $9/mo →
              </a>
            </div>
          </div>
        </div>
      ) : (
        <ApplicationBoard initialApps={apps as unknown as ApplicationRecord[]} />
      )}
    </div>
  )
}
