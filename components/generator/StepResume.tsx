'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { UploadCloud, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import type { WizardState } from './GeneratorWizard'

interface StepResumeProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
  onNext: () => void
  onBack: () => void
}

export function StepResume({ state, onUpdate, onNext, onBack }: StepResumeProps) {
  const [pastedText, setPastedText] = useState(state.resumeText)
  const [uploading, setUploading] = useState(false)
  const [uploadedFileName, setUploadedFileName] = useState('')
  const [tab, setTab] = useState<'paste' | 'upload'>('paste')

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 4 * 1024 * 1024) {
      toast.error('File must be under 4MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      // Use UploadThing to upload, then extract text server-side
      const res = await fetch('/api/uploadthing', { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Upload failed')

      const data = await res.json()
      const extractedText = data.text ?? ''

      if (extractedText.length > 8000) {
        toast.warning('Resume was truncated to 8000 characters for processing')
      }

      const finalText = extractedText.slice(0, 8000)
      setPastedText(finalText)
      setUploadedFileName(file.name)
      onUpdate({ resumeText: finalText })
      toast.success('Resume uploaded and text extracted!')
    } catch {
      toast.error('Failed to upload resume. Please paste the text manually.')
    } finally {
      setUploading(false)
    }
  }

  function handleContinue() {
    const text = pastedText.trim()
    if (!text || text.length < 10) {
      toast.error('Please provide your resume text.')
      return
    }
    onUpdate({ resumeText: text })
    onNext()
  }

  return (
    <div className="space-y-6">
      <Tabs value={tab} onValueChange={(v) => setTab(v as 'paste' | 'upload')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="paste">Paste text</TabsTrigger>
          <TabsTrigger value="upload">Upload PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="paste" className="mt-4">
          <div>
            <p className="text-xs text-[#64748B] mb-2">Paste your resume content in plain text format.</p>
            <Textarea
              placeholder="Paste your full resume text here..."
              className="min-h-[280px] text-sm resize-none font-mono"
              value={pastedText}
              onChange={(e) => {
                let val = e.target.value
                if (val.length > 8000) {
                  toast.warning('Resume truncated to 8000 characters')
                  val = val.slice(0, 8000)
                }
                setPastedText(val)
              }}
            />
            <span className="text-xs text-[#94A3B8] mt-1 block">{pastedText.length} / 8000 characters</span>
          </div>
        </TabsContent>

        <TabsContent value="upload" className="mt-4">
          <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-12 text-center hover:border-[#3B82F6] transition-colors">
            {uploading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="animate-spin text-[#3B82F6]" size={32} />
                <p className="text-sm text-[#64748B]">Processing your resume...</p>
              </div>
            ) : uploadedFileName ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xl">✓</span>
                </div>
                <p className="text-sm font-medium text-[#0F172A]">{uploadedFileName}</p>
                <p className="text-xs text-[#64748B]">Text extracted successfully</p>
                <label className="cursor-pointer text-xs text-[#3B82F6] hover:underline">
                  Upload a different file
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            ) : (
              <>
                <UploadCloud size={40} className="text-[#94A3B8] mx-auto mb-4" />
                <p className="text-sm font-medium text-[#0F172A] mb-1">Drop your resume PDF here</p>
                <p className="text-xs text-[#64748B] mb-4">PDF up to 4MB</p>
                <label className="cursor-pointer">
                  <span className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Choose file
                  </span>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} disabled={uploading} />
                </label>
              </>
            )}
          </div>

          {pastedText && (
            <div className="mt-4">
              <p className="text-xs text-[#64748B] font-medium mb-2">Extracted text preview:</p>
              <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 max-h-48 overflow-y-auto">
                <p className="text-xs text-[#374151] whitespace-pre-wrap font-mono">{pastedText.slice(0, 500)}...</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>← Back</Button>
        <Button onClick={handleContinue} className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8">
          Continue →
        </Button>
      </div>
    </div>
  )
}
