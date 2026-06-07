'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, Trash2 } from 'lucide-react'
import type { CoverLetterRecord } from '@/types'

interface CoverLetterCardProps {
  letter: CoverLetterRecord
  onDelete?: (id: string) => void
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-600',
  FINAL: 'bg-blue-100 text-blue-700',
  SENT: 'bg-green-100 text-green-700',
}

export function CoverLetterCard({ letter, onDelete }: CoverLetterCardProps) {
  const initials = letter.companyName.slice(0, 2).toUpperCase()
  const date = new Date(letter.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="group relative bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-all cursor-pointer">
      <Link href={`/letters/${letter.id}`} className="absolute inset-0 rounded-xl" />

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
          {initials}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-[#0F172A] text-sm truncate">{letter.companyName}</h3>
          <p className="text-[#64748B] text-xs truncate mt-0.5">{letter.jobTitle}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[letter.status]}`}>
              {letter.status}
            </span>
            {letter.atsScore !== null && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                letter.atsScore >= 80 ? 'bg-green-100 text-green-700' :
                letter.atsScore >= 60 ? 'bg-amber-100 text-amber-700' :
                'bg-red-100 text-red-700'
              }`}>
                ATS {letter.atsScore}%
              </span>
            )}
            <span className="text-[10px] text-[#94A3B8] ml-auto">{date}</span>
          </div>
        </div>
      </div>

      {/* Quick actions on hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
        {onDelete && (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.preventDefault()
              onDelete(letter.id)
            }}
          >
            <Trash2 size={13} />
          </Button>
        )}
      </div>
    </div>
  )
}
