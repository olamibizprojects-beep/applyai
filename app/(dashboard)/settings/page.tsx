'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signOut, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { PRICING } from '@/types'
import { Loader2 } from 'lucide-react'

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [saving, setSaving] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error('Save failed')
      await update()
      toast.success('Profile saved!')
    } catch {
      toast.error('Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  async function handlePortal() {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      toast.error('Failed to open billing portal')
    } finally {
      setPortalLoading(false)
    }
  }

  async function handleUpgrade(tier: 'BASIC' | 'PRO') {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tier }),
    })
    const data = await res.json()
    if (data.url) window.location.href = data.url
  }

  const tier = session?.user?.subscriptionTier ?? 'FREE'

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-[#0F172A] mb-6">Settings</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <h2 className="font-semibold text-[#0F172A] mb-4">Profile information</h2>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-sm font-medium text-[#374151]">Full name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium text-[#374151]">Email address</Label>
                <Input value={session?.user?.email ?? ''} disabled className="mt-1 bg-[#F8FAFC] text-[#94A3B8]" />
                <p className="text-xs text-[#94A3B8] mt-1">Email cannot be changed</p>
              </div>
              <Button type="submit" disabled={saving} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                Save profile
              </Button>
            </form>
          </div>
        </TabsContent>

        <TabsContent value="subscription">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-6">
            <div>
              <h2 className="font-semibold text-[#0F172A] mb-1">Current plan</h2>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#0F172A]">{tier}</span>
                <span className="text-[#64748B] text-sm">
                  {tier === 'FREE' ? 'Free forever' : tier === 'BASIC' ? '$9/month' : '$19/month'}
                </span>
              </div>
            </div>

            {tier === 'FREE' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <Button onClick={() => handleUpgrade('BASIC')} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
                  Upgrade to Basic — $9/mo
                </Button>
                <Button onClick={() => handleUpgrade('PRO')} variant="outline">
                  Upgrade to Pro — $19/mo
                </Button>
              </div>
            )}

            {tier !== 'FREE' && (
              <div className="space-y-3">
                <Button onClick={handlePortal} disabled={portalLoading} variant="outline" className="w-full sm:w-auto">
                  {portalLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
                  Manage billing & cancel →
                </Button>
                <p className="text-xs text-[#94A3B8]">Opens the Stripe billing portal. You can update payment methods, view invoices, or cancel your subscription.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-4">
            <h2 className="font-semibold text-[#0F172A]">Account actions</h2>
            <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })} className="text-[#374151]">
              Sign out
            </Button>
            <div className="border-t border-[#E2E8F0] pt-4">
              <h3 className="text-sm font-medium text-red-600 mb-2">Danger zone</h3>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={async () => {
                  if (!confirm('Delete your account and all data? This cannot be undone.')) return
                  toast.error('Please contact hello@applyai.ink to delete your account.')
                }}
              >
                Delete account
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
