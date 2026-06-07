'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Lock, Clock } from 'lucide-react'
import type { Tone, Tier } from '@/types'
import type { WizardState } from './GeneratorWizard'

const tones: { value: Tone; label: string; description: string }[] = [
  { value: 'PROFESSIONAL', label: 'Professional', description: 'Polished, confident, and formal — great for corporate and enterprise roles.' },
  { value: 'ENTHUSIASTIC', label: 'Enthusiastic', description: 'Genuine energy and personality while staying professional.' },
  { value: 'CONCISE', label: 'Concise', description: 'Every sentence earns its place. Direct and punchy, ~250 words.' },
  { value: 'CREATIVE', label: 'Creative', description: 'Memorable opening, personality-forward, breaks conventions slightly.' },
]

interface StepOptionsProps {
  state: WizardState
  tier: Tier
  onUpdate: (updates: Partial<WizardState>) => void
  onNext: () => void
  onBack: () => void
}

export function StepOptions({ state, tier, onUpdate, onNext, onBack }: StepOptionsProps) {
  const [tone, setTone] = useState<Tone>(state.tone ?? 'PROFESSIONAL')
  const [additionalContext, setAdditionalContext] = useState(state.additionalContext ?? '')
  const [wantATS, setWantATS] = useState(false)

  const allowedTones: Tone[] = tier === 'FREE' ? ['PROFESSIONAL'] : ['PROFESSIONAL', 'ENTHUSIASTIC', 'CONCISE', 'CREATIVE']

  function handleNext() {
    onUpdate({ tone, additionalContext, wantATSScore: wantATS })
    onNext()
  }

  return (
    <div className="space-y-8">
      {/* Tone selection */}
      <div>
        <Label className="text-sm font-medium text-[#374151] mb-3 block">Writing tone</Label>
        <div className="grid sm:grid-cols-2 gap-3">
          {tones.map(({ value, label, description }) => {
            const locked = !allowedTones.includes(value)
            const selected = tone === value
            return (
              <button
                key={value}
                onClick={() => !locked && setTone(value)}
                disabled={locked}
                className={`relative text-left p-4 rounded-xl border transition-all ${
                  selected
                    ? 'border-[#3B82F6] bg-[#3B82F6]/5 ring-1 ring-[#3B82F6]'
                    : locked
                    ? 'border-[#E2E8F0] bg-[#F8FAFC] opacity-60 cursor-not-allowed'
                    : 'border-[#E2E8F0] hover:border-[#3B82F6]/40 hover:bg-gray-50 cursor-pointer'
                }`}
              >
                {locked && (
                  <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] text-[#94A3B8] bg-gray-100 px-1.5 py-0.5 rounded">
                    <Lock size={9} />BASIC+
                  </span>
                )}
                <p className="font-medium text-[#0F172A] text-sm">{label}</p>
                <p className="text-xs text-[#64748B] mt-1">{description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Additional context */}
      <div>
        <Label className="text-sm font-medium text-[#374151]">Anything specific to highlight? <span className="text-[#94A3B8] font-normal">(optional)</span></Label>
        <p className="text-xs text-[#64748B] mt-0.5 mb-2">Specific projects, achievements, or keywords you want included.</p>
        <Textarea
          placeholder="e.g. Include my work on the payment API project that handled $50M in transactions. Emphasize my Python skills."
          className="min-h-[100px] text-sm resize-none mt-1"
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value.slice(0, 1000))}
        />
        <span className="text-xs text-[#94A3B8] mt-1 block">{additionalContext.length} / 1000</span>
      </div>

      {/* ATS score option (PRO only) */}
      <div className={`flex items-start gap-3 p-4 rounded-xl border ${tier === 'PRO' ? 'border-[#E2E8F0] bg-[#F8FAFC]' : 'border-dashed border-[#E2E8F0] opacity-60'}`}>
        <input
          type="checkbox"
          id="ats-check"
          checked={wantATS}
          onChange={(e) => tier === 'PRO' && setWantATS(e.target.checked)}
          disabled={tier !== 'PRO'}
          className="mt-0.5 h-4 w-4 accent-[#3B82F6]"
        />
        <div>
          <label htmlFor="ats-check" className={`text-sm font-medium text-[#0F172A] flex items-center gap-2 ${tier !== 'PRO' ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            Generate ATS score after creation
            {tier !== 'PRO' && (
              <span className="flex items-center gap-1 text-[10px] text-[#94A3B8] bg-gray-100 px-1.5 py-0.5 rounded">
                <Lock size={9} />PRO only
              </span>
            )}
          </label>
          <p className="text-xs text-[#64748B] mt-0.5">Analyzes keyword match and gives improvement suggestions.</p>
        </div>
      </div>

      {/* Timing indicator */}
      <div className="flex items-center gap-2 text-xs text-[#64748B]">
        <Clock size={14} />
        <span>Estimated generation time: ~8 seconds</span>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={handleNext} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8">
          Generate cover letter →
        </Button>
      </div>
    </div>
  )
}
