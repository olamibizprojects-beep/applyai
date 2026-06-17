'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Lock, Copy, Check, FileSearch2 } from 'lucide-react'
import { toast } from 'sonner'
import { UpgradeModal } from '@/components/shared/UpgradeModal'
import type { Tier } from '@/types'

interface Section {
  title: string
  content: string
}

function parseSections(text: string): Section[] {
  const parts = text.split(/^## /m).filter(Boolean)
  return parts.map(part => {
    const newlineIdx = part.indexOf('\n')
    if (newlineIdx === -1) return { title: part.trim(), content: '' }
    return {
      title: part.slice(0, newlineIdx).trim(),
      content: part.slice(newlineIdx + 1).trim(),
    }
  })
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 text-xs h-7">
      {copied ? <><Check size={12} />Copied</> : <><Copy size={12} />Copy</>}
    </Button>
  )
}

export function ResumeBuilderPage({ tier }: { tier: Tier }) {
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamedText, setStreamedText] = useState('')
  const [sections, setSections] = useState<Section[]>([])
  const [done, setDone] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)

  const isPRO = tier === 'PRO'

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!isPRO) { setUpgradeOpen(true); return }
    if (!resumeText.trim()) { toast.error('Please paste your resume'); return }
    if (!jobDescription.trim()) { toast.error('Please paste the job description'); return }

    setStreaming(true)
    setStreamedText('')
    setSections([])
    setDone(false)

    try {
      const res = await fetch('/api/resume-builder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          companyName: companyName.trim() || undefined,
          jobTitle: jobTitle.trim() || undefined,
        }),
      })

      if (!res.ok || !res.body) {
        const err = await res.json().catch(() => ({}))
        toast.error((err as { error?: string }).error ?? 'Generation failed. Please try again.')
        setStreaming(false)
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done: rdone, value } = await reader.read()
        if (rdone) break
        const chunk = decoder.decode(value, { stream: true })
        if (chunk.includes('[ERROR:')) {
          toast.error('Generation failed. Please try again.')
          setStreaming(false)
          return
        }
        accumulated += chunk
        setStreamedText(accumulated)
      }

      const parsed = parseSections(accumulated)
      setSections(parsed)
      setDone(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setStreaming(false)
    }
  }

  const find = (title: string) => sections.find(s => s.title === title)

  const resumeSection    = find('ATS-Optimized Resume')
  const analysisSection  = find('ATS Analysis Report')
  const keywordSection   = find('Keyword Match Report')
  const summarySection   = find('Optimized Professional Summary')
  const recruiterSection = find('Recruiter Review Summary')

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
          <FileSearch2 size={18} className="text-[#3B82F6]" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A]">ATS Resume Builder</h1>
        {!isPRO && (
          <span className="flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
            <Lock size={11} />PRO feature
          </span>
        )}
      </div>
      <p className="text-[#64748B] text-sm mb-6 ml-12">
        Paste your resume and a job description. AI rewrites it to maximize ATS keyword matching and recruiter readability.
      </p>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* Left: Inputs */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-[#374151]">Company <span className="text-[#94A3B8] font-normal">(optional)</span></Label>
                <Input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  className="mt-1"
                  disabled={!isPRO}
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-[#374151]">Target Role <span className="text-[#94A3B8] font-normal">(optional)</span></Label>
                <Input
                  value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Engineer"
                  className="mt-1"
                  disabled={!isPRO}
                />
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#374151]">Your Current Resume</Label>
              <p className="text-xs text-[#64748B] mt-0.5 mb-1.5">Paste your full resume as plain text.</p>
              <Textarea
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your full resume here..."
                className="min-h-[220px] text-sm resize-none"
                disabled={!isPRO}
              />
              <p className="text-xs text-[#94A3B8] mt-1 text-right">{resumeText.length.toLocaleString()} / 10,000</p>
            </div>

            <div>
              <Label className="text-sm font-medium text-[#374151]">Job Description</Label>
              <p className="text-xs text-[#64748B] mt-0.5 mb-1.5">Paste the complete job posting.</p>
              <Textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="min-h-[180px] text-sm resize-none"
                disabled={!isPRO}
              />
              <p className="text-xs text-[#94A3B8] mt-1 text-right">{jobDescription.length.toLocaleString()} / 8,000</p>
            </div>

            <Button
              type="submit"
              disabled={streaming || !isPRO}
              className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white"
            >
              {streaming
                ? <><Loader2 className="animate-spin mr-2 h-4 w-4" />Optimizing resume...</>
                : 'Optimize Resume with AI →'}
            </Button>

            {!isPRO && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setUpgradeOpen(true)}
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Upgrade to PRO to unlock Resume Builder
              </Button>
            )}
          </form>
        </div>

        {/* Right: Output */}
        <div className="min-h-[400px]">
          {!streaming && !done && (
            <div className="bg-white rounded-xl border border-dashed border-[#E2E8F0] p-12 text-center h-full flex items-center justify-center">
              <div className="space-y-2">
                <FileSearch2 size={32} className="text-[#CBD5E1] mx-auto" />
                <p className="text-[#94A3B8] text-sm">Your ATS analysis and optimized resume will appear here.</p>
              </div>
            </div>
          )}

          {streaming && !done && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Loader2 className="animate-spin h-4 w-4 text-[#3B82F6]" />
                <span className="text-sm font-medium text-[#374151]">Analyzing and optimizing your resume...</span>
              </div>
              <div className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed max-h-[580px] overflow-y-auto bg-[#F8FAFC] rounded-lg p-4 font-mono text-xs">
                {streamedText}
                <span className="inline-block w-0.5 h-3.5 bg-[#3B82F6] animate-pulse ml-0.5 align-middle" />
              </div>
            </div>
          )}

          {done && sections.length > 0 && (
            <Tabs defaultValue="resume" className="w-full">
              <TabsList className="w-full grid grid-cols-4 mb-4">
                <TabsTrigger value="resume">Resume</TabsTrigger>
                <TabsTrigger value="analysis">ATS Analysis</TabsTrigger>
                <TabsTrigger value="keywords">Keywords</TabsTrigger>
                <TabsTrigger value="recruiter">Recruiter View</TabsTrigger>
              </TabsList>

              {/* Optimized Resume */}
              <TabsContent value="resume">
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[#0F172A] text-sm">ATS-Optimized Resume</h3>
                    {resumeSection && <CopyButton text={resumeSection.content} />}
                  </div>
                  <div className="text-xs text-[#374151] whitespace-pre-wrap leading-relaxed max-h-[560px] overflow-y-auto bg-[#F8FAFC] rounded-lg p-4 font-mono">
                    {resumeSection?.content ?? 'Resume section not found in output.'}
                  </div>
                </div>
              </TabsContent>

              {/* ATS Analysis */}
              <TabsContent value="analysis">
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
                  <div>
                    <h3 className="font-semibold text-[#0F172A] text-sm mb-3">ATS Analysis Report</h3>
                    <div className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed bg-[#F8FAFC] rounded-lg p-4 max-h-[260px] overflow-y-auto">
                      {analysisSection?.content ?? 'No analysis found.'}
                    </div>
                  </div>
                  {summarySection && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-[#0F172A] text-sm">Optimized Professional Summary</h3>
                        <CopyButton text={summarySection.content} />
                      </div>
                      <div className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed bg-[#F8FAFC] rounded-lg p-4">
                        {summarySection.content}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Keywords */}
              <TabsContent value="keywords">
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
                  <h3 className="font-semibold text-[#0F172A] text-sm mb-3">Keyword Match Report</h3>
                  <div className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed bg-[#F8FAFC] rounded-lg p-4 max-h-[500px] overflow-y-auto">
                    {keywordSection?.content ?? 'No keyword report found.'}
                  </div>
                </div>
              </TabsContent>

              {/* Recruiter View */}
              <TabsContent value="recruiter">
                <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
                  <h3 className="font-semibold text-[#0F172A] text-sm mb-3">Recruiter Review Summary</h3>
                  <div className="text-sm text-[#374151] whitespace-pre-wrap leading-relaxed bg-[#F8FAFC] rounded-lg p-4 max-h-[500px] overflow-y-auto">
                    {recruiterSection?.content ?? 'No recruiter summary found.'}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      <UpgradeModal
        open={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        featureName="ATS Resume Builder"
        requiredTier="PRO"
      />
    </div>
  )
}
