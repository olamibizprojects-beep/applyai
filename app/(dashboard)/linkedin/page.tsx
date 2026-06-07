'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { UpgradeModal } from '@/components/shared/UpgradeModal'
import type { LinkedInOptimizeResult } from '@/types'

export default function LinkedInPage() {
  const { data: session } = useSession()
  const [profileText, setProfileText] = useState('')
  const [targetRole, setTargetRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<LinkedInOptimizeResult | null>(null)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const tier = session?.user?.subscriptionTier ?? 'FREE'
  const isPRO = tier === 'PRO'

  async function handleOptimize(e: React.FormEvent) {
    e.preventDefault()
    if (!isPRO) { setUpgradeOpen(true); return }
    if (!profileText.trim() || !targetRole.trim()) {
      toast.error('Please fill in both fields')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileText, targetRole }),
      })
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setResult(data)
    } catch {
      toast.error('Optimization failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">LinkedIn Optimizer</h1>
        {!isPRO && (
          <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
            <Lock size={11} />PRO feature
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <form onSubmit={handleOptimize} className="space-y-5">
            <div>
              <Label className="text-sm font-medium text-[#374151]">Target role</Label>
              <Input
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Product Manager at a fintech startup"
                className="mt-1"
                disabled={!isPRO}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-[#374151]">Current LinkedIn profile text</Label>
              <p className="text-xs text-[#64748B] mt-0.5 mb-2">Paste your About section and work experience descriptions.</p>
              <Textarea
                value={profileText}
                onChange={(e) => setProfileText(e.target.value)}
                placeholder="Paste your LinkedIn About + Experience sections here..."
                className="min-h-[300px] text-sm resize-none"
                disabled={!isPRO}
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !isPRO}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              {loading ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Optimizing...</> : 'Optimize with AI →'}
            </Button>

            {!isPRO && (
              <Button type="button" variant="outline" onClick={() => setUpgradeOpen(true)} className="w-full">
                Upgrade to PRO to use this feature
              </Button>
            )}
          </form>
        </div>

        <div>
          {result ? (
            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <h3 className="font-semibold text-[#0F172A] mb-2 text-sm">Optimized Headline</h3>
                <p className="text-sm text-[#374151] bg-[#F8FAFC] rounded-lg p-3">{result.headline}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <h3 className="font-semibold text-[#0F172A] mb-2 text-sm">Optimized About</h3>
                <p className="text-sm text-[#374151] bg-[#F8FAFC] rounded-lg p-3 whitespace-pre-wrap leading-relaxed">{result.about}</p>
              </div>
              <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
                <h3 className="font-semibold text-[#0F172A] mb-3 text-sm">Rewritten Experience Bullets</h3>
                <ul className="space-y-2">
                  {result.experienceBullets.map((b, i) => (
                    <li key={i} className="text-sm text-[#374151] bg-[#F8FAFC] rounded-lg p-3">• {b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-dashed border-[#E2E8F0] p-12 text-center h-full flex items-center justify-center">
              <div>
                <p className="text-[#64748B] text-sm">Your optimized LinkedIn content will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} featureName="LinkedIn Optimizer" requiredTier="PRO" />
    </div>
  )
}
