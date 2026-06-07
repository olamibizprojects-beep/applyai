'use client'

import { useState, useEffect } from 'react'
import { StepJobDescription } from './StepJobDescription'
import { StepResume } from './StepResume'
import { StepOptions } from './StepOptions'
import { StepResult } from './StepResult'
import { Check } from 'lucide-react'
import type { Tone, Tier } from '@/types'

export interface WizardState {
  jobDescription: string
  companyName?: string
  jobTitle?: string
  resumeText: string
  tone: Tone
  additionalContext?: string
  wantATSScore?: boolean
}

const defaultState: WizardState = {
  jobDescription: '',
  resumeText: '',
  tone: 'PROFESSIONAL',
}

const STORAGE_KEY = 'applyai-wizard-state'

const steps = ['Job Description', 'Your Resume', 'Options', 'Result']

interface GeneratorWizardProps {
  tier: Tier
}

export function GeneratorWizard({ tier }: GeneratorWizardProps) {
  const [step, setStep] = useState(0)
  const [state, setState] = useState<WizardState>(() => {
    if (typeof window === 'undefined') return defaultState
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : defaultState
    } catch {
      return defaultState
    }
  })
  const [generationKey, setGenerationKey] = useState(0)

  useEffect(() => {
    if (step < 3) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state, step])

  function updateState(updates: Partial<WizardState>) {
    setState((s) => ({ ...s, ...updates }))
  }

  function next() {
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0))
  }

  function handleRegenerate() {
    setGenerationKey((k) => k + 1)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Step progress */}
      <div className="flex items-center gap-2 mb-10">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  i < step
                    ? 'bg-[#10B981] text-white'
                    : i === step
                    ? 'bg-[#3B82F6] text-white'
                    : 'bg-[#E2E8F0] text-[#94A3B8]'
                }`}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i === step ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-px ${i < step ? 'bg-[#10B981]' : 'bg-[#E2E8F0]'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8">
        <h2 className="text-xl font-bold text-[#0F172A] mb-6">{steps[step]}</h2>

        {step === 0 && (
          <StepJobDescription state={state} onUpdate={updateState} onNext={next} />
        )}
        {step === 1 && (
          <StepResume state={state} onUpdate={updateState} onNext={next} onBack={back} />
        )}
        {step === 2 && (
          <StepOptions state={state} tier={tier} onUpdate={updateState} onNext={next} onBack={back} />
        )}
        {step === 3 && (
          <StepResult
            key={generationKey}
            state={state}
            tier={tier}
            onBack={() => setStep(2)}
            onRegenerate={handleRegenerate}
          />
        )}
      </div>
    </div>
  )
}
