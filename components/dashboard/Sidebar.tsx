'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Wand2, FileText, Kanban, Settings, LogOut, Briefcase } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { UsageBar } from '@/components/dashboard/UsageBar'
import type { Tier } from '@/types'

interface SidebarProps {
  user: {
    name?: string | null
    email: string
    image?: string | null
    subscriptionTier: Tier
    generationsUsed: number
  }
}

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/generate', icon: Wand2, label: 'Generate' },
  { href: '/letters', icon: FileText, label: 'My Letters' },
  { href: '/tracker', icon: Kanban, label: 'Job Tracker' },
  { href: '/linkedin', icon: Briefcase, label: 'LinkedIn' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

const tierColors: Record<Tier, string> = {
  FREE: 'bg-gray-100 text-gray-600',
  BASIC: 'bg-blue-100 text-blue-700',
  PRO: 'bg-purple-100 text-purple-700',
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="w-60 flex-shrink-0 bg-[#0F172A] text-white flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/dashboard">
          <span className="text-lg font-bold">Apply<span className="text-[#3B82F6]">AI</span></span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-[#3B82F6] text-white'
                  : 'text-white/60 hover:bg-white/8 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom: usage + user */}
      <div className="px-4 py-4 border-t border-white/10 space-y-4">
        <div className="bg-white/5 rounded-lg px-3 py-3">
          <UsageBar used={user.generationsUsed} tier={user.subscriptionTier} compact />
        </div>

        {user.subscriptionTier !== 'PRO' && (
          <Button asChild size="sm" className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white text-xs">
            <Link href="/pricing">⚡ Upgrade plan</Link>
          </Button>
        )}

        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={user.image ?? undefined} />
            <AvatarFallback className="bg-[#3B82F6] text-white text-xs font-semibold">
              {(user.name ?? user.email).slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">{user.name ?? user.email}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${tierColors[user.subscriptionTier]}`}>
              {user.subscriptionTier}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-white/40 hover:text-white/70 transition-colors"
            title="Sign out"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  )
}
