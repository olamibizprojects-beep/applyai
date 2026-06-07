'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Lock, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Tier } from '@/types'

interface UpgradeModalProps {
  open: boolean
  onClose: () => void
  featureName: string
  requiredTier: 'BASIC' | 'PRO'
}

const tierDetails = {
  BASIC: {
    price: '$9/mo',
    benefits: ['Unlimited cover letter generations', 'All 4 tone modes', 'PDF & DOCX export', 'Job application tracker', 'Resume bullet rewriter'],
  },
  PRO: {
    price: '$19/mo',
    benefits: ['ATS compatibility scorer', 'LinkedIn profile optimizer', 'Everything in Basic', '5 saved resume slots', '7-day free trial'],
  },
}

export function UpgradeModal({ open, onClose, featureName, requiredTier }: UpgradeModalProps) {
  const router = useRouter()
  const details = tierDetails[requiredTier]

  async function handleUpgrade() {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier: requiredTier }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="w-10 h-10 bg-[#3B82F6]/10 rounded-xl flex items-center justify-center mb-2">
            <Lock size={20} className="text-[#3B82F6]" />
          </div>
          <DialogTitle className="text-xl">Unlock {featureName}</DialogTitle>
        </DialogHeader>

        <p className="text-[#64748B] text-sm">
          {featureName} is available on the <strong className="text-[#0F172A]">{requiredTier}</strong> plan.
        </p>

        <div className="bg-[#F8FAFC] rounded-xl p-4 space-y-2 my-2">
          {details.benefits.map((b) => (
            <div key={b} className="flex items-center gap-2 text-sm text-[#374151]">
              <Check size={15} className="text-[#10B981] flex-shrink-0" />
              {b}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-[#0F172A]">{details.price}</span>
            {requiredTier === 'PRO' && (
              <p className="text-xs text-[#10B981] font-medium">7-day free trial</p>
            )}
          </div>
          <Button onClick={handleUpgrade} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
            Upgrade to {requiredTier} →
          </Button>
        </div>

        <Button variant="ghost" onClick={onClose} className="w-full text-[#64748B]">
          Maybe later
        </Button>
      </DialogContent>
    </Dialog>
  )
}
