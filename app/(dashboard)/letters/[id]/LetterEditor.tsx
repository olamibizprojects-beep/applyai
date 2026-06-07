'use client'

import { useState, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import CharacterCount from '@tiptap/extension-character-count'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ATSScoreCard } from '@/components/shared/ATSScoreCard'
import { UpgradeModal } from '@/components/shared/UpgradeModal'
import { Save, Download, FileText, Trash2, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { exportToPDF } from '@/lib/pdf-export'
import { exportToDOCX } from '@/lib/docx-export'
import { saveAs } from 'file-saver'
import type { CoverLetterRecord, Tier, ATSScoreResult } from '@/types'

interface LetterEditorProps {
  letter: CoverLetterRecord
  tier: Tier
}

export function LetterEditor({ letter, tier }: LetterEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [atsResult, setAtsResult] = useState<ATSScoreResult | null>(
    letter.atsScore ? { score: letter.atsScore, matchedKeywords: letter.atsKeywords, missingKeywords: [], suggestions: [] } : null
  )
  const [atsLoading, setAtsLoading] = useState(false)
  const [upgradeOpen, setUpgradeOpen] = useState(false)
  const [status, setStatus] = useState(letter.status)

  const editor = useEditor({
    extensions: [StarterKit, CharacterCount],
    content: letter.content,
    editorProps: {
      attributes: { class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4 font-serif text-[#0F172A] leading-relaxed' },
    },
  })

  // Autosave every 30s
  useEffect(() => {
    if (!editor) return
    const interval = setInterval(async () => {
      const content = editor.getText()
      if (!content) return
      try {
        await fetch(`/api/letters/${letter.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: editor.getHTML() }),
        })
      } catch {}
    }, 30000)
    return () => clearInterval(interval)
  }, [editor, letter.id])

  async function handleSave() {
    if (!editor) return
    setSaving(true)
    try {
      const res = await fetch(`/api/letters/${letter.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editor.getHTML(), status }),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Saved!')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this cover letter? This cannot be undone.')) return
    const res = await fetch(`/api/letters/${letter.id}`, { method: 'DELETE' })
    if (res.ok) {
      toast.success('Deleted')
      router.push('/letters')
    } else {
      toast.error('Failed to delete')
    }
  }

  async function handleATS() {
    if (tier !== 'PRO') { setUpgradeOpen(true); return }
    setAtsLoading(true)
    try {
      const res = await fetch('/api/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverLetterContent: editor?.getText() ?? letter.content, jobDescription: letter.jobDescription }),
      })
      const data = await res.json()
      setAtsResult(data)
    } catch {
      toast.error('ATS analysis failed')
    } finally {
      setAtsLoading(false)
    }
  }

  async function handlePDF() {
    const text = editor?.getText() ?? letter.content
    const pdf = await exportToPDF(text, letter.companyName, letter.jobTitle, tier === 'FREE')
    saveAs(new Blob([pdf.buffer as ArrayBuffer], { type: 'application/pdf' }), `${letter.companyName}-cover-letter.pdf`)
  }

  async function handleDOCX() {
    if (tier === 'FREE') { setUpgradeOpen(true); return }
    const text = editor?.getText() ?? letter.content
    const blob = await exportToDOCX(text, letter.companyName, letter.jobTitle, false)
    saveAs(blob, `${letter.companyName}-cover-letter.docx`)
  }

  const wordCount = editor?.storage.characterCount?.words() ?? 0

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="text-[#64748B]">
          <ArrowLeft size={16} className="mr-1" /> Back
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-[#0F172A]">{letter.companyName}</h1>
          <p className="text-sm text-[#64748B]">{letter.jobTitle}</p>
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="text-xs border border-[#E2E8F0] rounded-lg px-3 py-1.5 bg-white text-[#374151]"
        >
          <option value="DRAFT">DRAFT</option>
          <option value="FINAL">FINAL</option>
          <option value="SENT">SENT</option>
        </select>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <EditorContent editor={editor} />
          </div>
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-[#94A3B8]">{wordCount} words · Autosaves every 30s</span>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 space-y-2">
            <Button onClick={handleSave} disabled={saving} className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white h-9 text-sm">
              <Save size={14} className="mr-2" />{saving ? 'Saving...' : 'Save changes'}
            </Button>
            <Button variant="outline" onClick={handlePDF} className="w-full h-9 text-sm justify-start gap-2">
              <Download size={14} />Download PDF
            </Button>
            <Button variant="outline" onClick={handleDOCX} className="w-full h-9 text-sm justify-start gap-2">
              <FileText size={14} />Download DOCX {tier === 'FREE' && <span className="ml-auto text-[10px] text-[#94A3B8]">🔒</span>}
            </Button>
            <Button variant="outline" onClick={handleATS} className="w-full h-9 text-sm justify-start gap-2">
              ATS Check {tier !== 'PRO' && <span className="ml-auto text-[10px] text-[#94A3B8]">🔒 PRO</span>}
            </Button>
            <Button variant="ghost" onClick={handleDelete} className="w-full h-9 text-sm text-red-500 hover:text-red-600 hover:bg-red-50">
              <Trash2 size={14} className="mr-2" />Delete
            </Button>
          </div>

          {(atsLoading || atsResult) && (
            <ATSScoreCard result={atsResult} loading={atsLoading} onReanalyze={handleATS} />
          )}
        </div>
      </div>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} featureName="DOCX Export & ATS Scorer" requiredTier="BASIC" />
    </div>
  )
}
