'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { StreamingText } from './StreamingText'
import { ATSScoreCard } from '@/components/shared/ATSScoreCard'
import { UpgradeModal } from '@/components/shared/UpgradeModal'
import { Copy, Download, FileText, RefreshCw, Mail, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { exportToPDF } from '@/lib/pdf-export'
import { exportToDOCX } from '@/lib/docx-export'
import { saveAs } from 'file-saver'
import type { Tone, Tier, ATSScoreResult } from '@/types'
import type { WizardState } from './GeneratorWizard'

interface StepResultProps {
  state: WizardState
  tier: Tier
  onBack: () => void
  onRegenerate: () => void
}

export function StepResult({ state, tier, onBack, onRegenerate }: StepResultProps) {
  const [stream, setStream] = useState<ReadableStream<Uint8Array> | null>(null)
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [upgradeModal, setUpgradeModal] = useState<{ open: boolean; feature: string; tier: 'BASIC' | 'PRO' }>({
    open: false, feature: '', tier: 'BASIC',
  })
  const [atsResult, setAtsResult] = useState<ATSScoreResult | null>(null)
  const [atsLoading, setAtsLoading] = useState(false)
  const [regenerateCount, setRegenerateCount] = useState(0)
  const hasStarted = useRef(false)

  const startGeneration = useCallback(async () => {
    setError('')
    setDone(false)
    setText('')
    setAtsResult(null)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: state.jobDescription,
          resumeText: state.resumeText,
          tone: state.tone,
          additionalContext: state.additionalContext,
          companyName: state.companyName,
          jobTitle: state.jobTitle,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.error === 'GENERATION_LIMIT_REACHED') {
          setUpgradeModal({ open: true, feature: 'Unlimited generations', tier: 'BASIC' })
        } else {
          setError(data.error ?? 'Generation failed')
        }
        return
      }

      setStream(res.body)
    } catch {
      setError('Network error. Please check your connection and try again.')
    }
  }, [state, regenerateCount])

  useEffect(() => {
    if (!hasStarted.current) {
      hasStarted.current = true
      startGeneration()
    }
  }, [])

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  async function handleDownloadPDF() {
    const addWatermark = tier === 'FREE'
    try {
      const pdfBytes = await exportToPDF(text, state.companyName ?? 'Company', state.jobTitle ?? 'Role', addWatermark)
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      saveAs(blob, `cover-letter-${(state.companyName ?? 'company').toLowerCase().replace(/\s+/g, '-')}.pdf`)
      if (addWatermark) {
        toast.info('Downloaded with watermark. Upgrade to Basic for watermark-free PDFs.')
      }
    } catch {
      toast.error('Failed to generate PDF. Please try again.')
    }
  }

  async function handleDownloadDOCX() {
    if (tier === 'FREE') {
      setUpgradeModal({ open: true, feature: 'DOCX export', tier: 'BASIC' })
      return
    }
    try {
      const blob = await exportToDOCX(text, state.companyName ?? 'Company', state.jobTitle ?? 'Role', false)
      saveAs(blob, `cover-letter-${(state.companyName ?? 'company').toLowerCase().replace(/\s+/g, '-')}.docx`)
    } catch {
      toast.error('Failed to generate DOCX. Please try again.')
    }
  }

  async function handleATS() {
    if (tier !== 'PRO') {
      setUpgradeModal({ open: true, feature: 'ATS Scorer', tier: 'PRO' })
      return
    }
    setAtsLoading(true)
    try {
      const res = await fetch('/api/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverLetterContent: text, jobDescription: state.jobDescription }),
      })
      const data = await res.json()
      setAtsResult(data)
    } catch {
      toast.error('ATS analysis failed. Please try again.')
    } finally {
      setAtsLoading(false)
    }
  }

  function handleRegenerate() {
    if (tier === 'FREE' && regenerateCount >= 1) {
      setUpgradeModal({ open: true, feature: 'Unlimited regenerations', tier: 'BASIC' })
      return
    }
    hasStarted.current = false
    setRegenerateCount((c) => c + 1)
    onRegenerate()
  }

  const wordCount = text.split(/\s+/).filter(Boolean).length
  const readingTime = Math.ceil(wordCount / 200)

  return (
    <div className="grid lg:grid-cols-5 gap-6 min-h-[500px]">
      {/* Left: letter content */}
      <div className="lg:col-span-3 flex flex-col">
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 flex-1 min-h-[400px]">
          {error ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <p className="text-red-500 text-sm">{error}</p>
              <Button onClick={() => { hasStarted.current = false; startGeneration() }} variant="outline">
                <RefreshCw size={14} className="mr-2" />
                Try again
              </Button>
            </div>
          ) : (
            <StreamingText
              stream={stream}
              onComplete={(t) => { setText(t); setDone(true) }}
              onError={setError}
            />
          )}
        </div>

        {done && (
          <div className="mt-2 flex items-center gap-4 text-xs text-[#94A3B8] px-1">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>~{readingTime} min read</span>
          </div>
        )}
      </div>

      {/* Right: actions panel */}
      <div className="lg:col-span-2 space-y-4">
        {/* Metadata */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4">
          <p className="text-xs text-[#64748B] font-medium uppercase tracking-wide mb-3">Cover letter details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-[#64748B]">Company</span>
              <span className="font-medium text-[#0F172A] text-right">{state.companyName || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Role</span>
              <span className="font-medium text-[#0F172A] text-right text-xs">{state.jobTitle || '—'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#64748B]">Tone</span>
              <span className="font-medium text-[#0F172A]">{state.tone}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-2">
          <p className="text-xs text-[#64748B] font-medium uppercase tracking-wide mb-3">Actions</p>

          <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm" onClick={handleCopy} disabled={!done}>
            <Copy size={14} />
            Copy to clipboard
          </Button>

          <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm" onClick={handleDownloadPDF} disabled={!done}>
            <Download size={14} />
            Download PDF {tier === 'FREE' && <span className="ml-auto text-[10px] text-amber-500">(watermarked)</span>}
          </Button>

          <Button variant="outline" className="w-full justify-start gap-2 h-9 text-sm" onClick={handleDownloadDOCX} disabled={!done}>
            <FileText size={14} />
            Download DOCX {tier === 'FREE' && <span className="ml-auto text-[10px] text-[#94A3B8]">🔒 Basic</span>}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-9 text-sm"
            onClick={handleRegenerate}
            disabled={!done}
          >
            <RefreshCw size={14} />
            Regenerate
            {tier === 'FREE' && regenerateCount >= 1 && <span className="ml-auto text-[10px] text-[#94A3B8]">🔒 limit</span>}
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-9 text-sm"
            onClick={handleATS}
            disabled={!done}
          >
            <span className="text-xs">ATS</span>
            Check ATS score
            {tier !== 'PRO' && <span className="ml-auto text-[10px] text-[#94A3B8]">🔒 PRO</span>}
          </Button>
        </div>

        {/* ATS Score */}
        {(atsLoading || atsResult) && (
          <ATSScoreCard result={atsResult} loading={atsLoading} onReanalyze={handleATS} />
        )}

        {/* Back */}
        <Button variant="ghost" onClick={onBack} className="w-full text-[#64748B]">
          ← Edit options
        </Button>
      </div>

      <UpgradeModal
        open={upgradeModal.open}
        onClose={() => setUpgradeModal((s) => ({ ...s, open: false }))}
        featureName={upgradeModal.feature}
        requiredTier={upgradeModal.tier}
      />
    </div>
  )
}
