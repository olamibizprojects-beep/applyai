'use client'

import { Button } from '@/components/ui/button'
import { Check, X, RefreshCw, Loader2 } from 'lucide-react'
import type { ATSScoreResult } from '@/types'

interface ATSScoreCardProps {
  result: ATSScoreResult | null
  loading: boolean
  onReanalyze?: () => void
}

function ScoreGauge({ score }: { score: number }) {
  const color = score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444'
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="flex items-center justify-center">
      <svg width="100" height="100" className="transform -rotate-90">
        <circle cx="50" cy="50" r="40" fill="none" stroke="#E2E8F0" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-[#0F172A]" style={{ color }}>{score}</span>
        <span className="text-xs text-[#64748B]">/ 100</span>
      </div>
    </div>
  )
}

export function ATSScoreCard({ result, loading, onReanalyze }: ATSScoreCardProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 flex items-center justify-center gap-3 text-[#64748B]">
        <Loader2 size={18} className="animate-spin" />
        <span className="text-sm">Analyzing ATS compatibility...</span>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-[#0F172A]">ATS Compatibility Score</h3>
        {onReanalyze && (
          <Button variant="ghost" size="sm" onClick={onReanalyze} className="h-8 text-xs text-[#64748B]">
            <RefreshCw size={13} className="mr-1" />
            Re-analyze
          </Button>
        )}
      </div>

      <div className="relative w-fit mx-auto">
        <ScoreGauge score={result.score} />
      </div>

      {result.matchedKeywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Matched keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {result.matchedKeywords.slice(0, 12).map((kw) => (
              <span key={kw} className="inline-flex items-center gap-1 text-[11px] bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5">
                <Check size={10} />{kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.missingKeywords.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Missing keywords</p>
          <div className="flex flex-wrap gap-1.5">
            {result.missingKeywords.slice(0, 8).map((kw) => (
              <span key={kw} className="inline-flex items-center gap-1 text-[11px] bg-red-50 text-red-600 border border-red-200 rounded-full px-2 py-0.5">
                <X size={10} />{kw}
              </span>
            ))}
          </div>
        </div>
      )}

      {result.suggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Suggestions</p>
          <ul className="space-y-2">
            {result.suggestions.map((s, i) => (
              <li key={i} className="text-xs text-[#374151] flex gap-2">
                <span className="text-[#3B82F6] font-bold flex-shrink-0">{i + 1}.</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
