'use client'

import { useState, useEffect } from 'react'
import { CoverLetterCard } from '@/components/dashboard/CoverLetterCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { FileText, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import type { CoverLetterRecord, DocStatus } from '@/types'

export default function LettersPage() {
  const [letters, setLetters] = useState<CoverLetterRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<DocStatus | 'ALL'>('ALL')
  const [sort, setSort] = useState<'date' | 'company'>('date')

  useEffect(() => {
    fetch('/api/letters')
      .then((r) => r.json())
      .then((data) => setLetters(data.letters ?? []))
      .catch(() => toast.error('Failed to load cover letters'))
      .finally(() => setLoading(false))
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Delete this cover letter?')) return
    const res = await fetch(`/api/letters/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setLetters((prev) => prev.filter((l) => l.id !== id))
      toast.success('Cover letter deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  const filtered = letters
    .filter((l) => filter === 'ALL' || l.status === filter)
    .sort((a, b) =>
      sort === 'date'
        ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        : a.companyName.localeCompare(b.companyName)
    )

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#0F172A]">My Cover Letters</h1>
        <Button asChild className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
          <Link href="/generate"><Wand2 size={15} className="mr-2" />New letter</Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1">
          {(['ALL', 'DRAFT', 'FINAL', 'SENT'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === s ? 'bg-[#0F172A] text-white' : 'bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as 'date' | 'company')}
          className="ml-auto text-xs border border-[#E2E8F0] rounded-lg px-3 py-1.5 bg-white text-[#374151]"
        >
          <option value="date">Sort: Newest first</option>
          <option value="company">Sort: Company A-Z</option>
        </select>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-[#F1F5F9] rounded-xl animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <FileText size={40} className="text-[#E2E8F0] mx-auto mb-4" />
          <h2 className="font-semibold text-[#0F172A] mb-2">No cover letters yet</h2>
          <p className="text-[#64748B] text-sm mb-6">Generate your first tailored cover letter.</p>
          <Button asChild className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
            <Link href="/generate">Generate your first letter</Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((letter) => (
            <CoverLetterCard key={letter.id} letter={letter} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
