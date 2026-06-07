import { type Metadata } from 'next'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CoverLetterCard } from '@/components/dashboard/CoverLetterCard'
import { UsageBar } from '@/components/dashboard/UsageBar'
import { Wand2, FileText, ArrowRight } from 'lucide-react'
import type { CoverLetterRecord, Tier } from '@/types'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const [user, letters] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, subscriptionTier: true, generationsUsed: true, generationsResetAt: true },
    }),
    prisma.coverLetter.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 4,
    }),
  ])

  const tier = (user?.subscriptionTier ?? 'FREE') as Tier
  const firstName = user?.name?.split(' ')[0] ?? 'there'

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F172A]">Good morning, {firstName} 👋</h1>
        <p className="text-[#64748B] mt-1">Ready to land your next interview?</p>
      </div>

      <div className="grid gap-6">
        {/* Stats row */}
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <p className="text-sm text-[#64748B] mb-1">Generations this month</p>
            <UsageBar used={user?.generationsUsed ?? 0} tier={tier} />
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <p className="text-sm text-[#64748B] mb-1">Total cover letters</p>
            <p className="text-2xl font-bold text-[#0F172A]">{letters.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <p className="text-sm text-[#64748B] mb-1">Current plan</p>
            <p className="text-2xl font-bold text-[#0F172A]">{tier}</p>
          </div>
        </div>

        {/* CTA Card */}
        <div className="bg-gradient-to-r from-[#0F172A] to-[#1e3a5f] rounded-2xl p-8 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Generate a cover letter</h2>
            <p className="text-white/60 text-sm">Paste a job description and get a tailored letter in 60 seconds.</p>
          </div>
          <Button asChild className="bg-[#3B82F6] hover:bg-[#2563EB] text-white flex-shrink-0">
            <Link href="/generate">
              <Wand2 size={16} className="mr-2" />
              Generate now
            </Link>
          </Button>
        </div>

        {/* Recent letters */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-[#0F172A] flex items-center gap-2">
              <FileText size={18} />
              Recent cover letters
            </h2>
            <Link href="/letters" className="text-sm text-[#3B82F6] hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {letters.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-[#E2E8F0] p-12 text-center">
              <FileText size={32} className="text-[#E2E8F0] mx-auto mb-3" />
              <p className="text-[#64748B] text-sm">No cover letters yet.</p>
              <Button asChild className="mt-4 bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                <Link href="/generate">Generate your first</Link>
              </Button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {letters.map((letter: { id: string } & Record<string, unknown>) => (
                <CoverLetterCard key={letter.id} letter={letter as unknown as CoverLetterRecord} />
              ))}
            </div>
          )}
        </div>

        {/* Upgrade banner for FREE tier */}
        {tier === 'FREE' && (
          <div className="bg-gradient-to-r from-[#3B82F6]/10 to-[#2563EB]/10 border border-[#3B82F6]/20 rounded-xl p-6 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-[#0F172A]">Unlock unlimited generations</h3>
              <p className="text-sm text-[#64748B] mt-1">Basic plan — $9/mo · PDF export · All 4 tones · Job tracker</p>
            </div>
            <Button asChild className="bg-[#3B82F6] hover:bg-[#2563EB] text-white flex-shrink-0">
              <Link href="/pricing">Upgrade →</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
