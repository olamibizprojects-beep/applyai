'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { WizardState } from './GeneratorWizard'

const schema = z.object({
  jobDescription: z.string().min(100, 'Paste the full job description (at least 100 characters)').max(8000),
  companyName: z.string().max(200).optional(),
  jobTitle: z.string().max(200).optional(),
})

type FormData = z.infer<typeof schema>

interface StepJobDescriptionProps {
  state: WizardState
  onUpdate: (updates: Partial<WizardState>) => void
  onNext: () => void
}

function extractCompanyAndTitle(text: string): { company: string; title: string } {
  // Simple heuristic extraction
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean)

  const titlePatterns = [
    /^(?:job title|position|role)[:\s]+(.+)/i,
    /^(?:we(?:'re| are) (?:looking for|hiring|seeking)(?: a| an)?) (.+)/i,
  ]
  const companyPatterns = [
    /^(?:company|employer|organization|about us)[:\s]+(.+)/i,
    /^(?:at|join) ([A-Z][a-zA-Z\s&,]+?)(?:,| is| –| \-)/,
  ]

  let title = ''
  let company = ''

  for (const line of lines.slice(0, 10)) {
    if (!title) {
      for (const p of titlePatterns) {
        const m = line.match(p)
        if (m) { title = m[1].trim().slice(0, 100); break }
      }
    }
    if (!company) {
      for (const p of companyPatterns) {
        const m = line.match(p)
        if (m) { company = m[1].trim().slice(0, 100); break }
      }
    }
    if (title && company) break
  }

  return { company, title }
}

export function StepJobDescription({ state, onUpdate, onNext }: StepJobDescriptionProps) {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      jobDescription: state.jobDescription,
      companyName: state.companyName,
      jobTitle: state.jobTitle,
    },
  })

  const jd = watch('jobDescription')

  useEffect(() => {
    if (jd && jd.length > 100) {
      const { company, title } = extractCompanyAndTitle(jd)
      if (company && !state.companyName) setValue('companyName', company)
      if (title && !state.jobTitle) setValue('jobTitle', title)
    }
  }, [jd])

  function onSubmit(data: FormData) {
    onUpdate(data)
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="jd" className="text-sm font-medium text-[#374151]">
          Job description <span className="text-red-500">*</span>
        </Label>
        <p className="text-xs text-[#64748B] mt-0.5 mb-2">Paste the full job posting. The more detail, the better the letter.</p>
        <Textarea
          id="jd"
          placeholder="Paste the job posting here... (at least 100 characters)"
          className="min-h-[240px] text-sm resize-none mt-1"
          {...register('jobDescription')}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.jobDescription ? (
            <p className="text-xs text-red-500">{errors.jobDescription.message}</p>
          ) : (
            <span />
          )}
          <span className="text-xs text-[#94A3B8]">{jd?.length ?? 0} / 8000</span>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company" className="text-sm font-medium text-[#374151]">Company name</Label>
          <Input id="company" placeholder="Acme Corp (auto-detected)" className="mt-1 h-10" {...register('companyName')} />
        </div>
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-[#374151]">Job title</Label>
          <Input id="title" placeholder="Senior Engineer (auto-detected)" className="mt-1 h-10" {...register('jobTitle')} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-8">
          Continue →
        </Button>
      </div>
    </form>
  )
}
