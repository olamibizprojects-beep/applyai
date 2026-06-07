'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export function DemoWidget() {
  const [jobDescription, setJobDescription] = useState('')
  const [experience, setExperience] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const abortRef = useRef<AbortController | null>(null)

  async function generate() {
    if (!jobDescription.trim() || !experience.trim()) {
      setError('Please fill in both fields.')
      return
    }
    if (jobDescription.length < 100) {
      setError('Job description must be at least 100 characters.')
      return
    }

    setError('')
    setResult('')
    setDone(false)
    setLoading(true)

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription,
          resumeText: experience,
          tone: 'PROFESSIONAL',
        }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const data = await res.json()
        if (res.status === 429) {
          setError('You\'ve hit the anonymous limit. Sign up free for 3 generations/month!')
        } else {
          setError(data.error ?? 'Generation failed. Please try again.')
        }
        setLoading(false)
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        setError('Streaming not supported')
        setLoading(false)
        return
      }

      let accumulated = ''
      while (true) {
        const { done: streamDone, value } = await reader.read()
        if (streamDone) break

        const chunk = decoder.decode(value)
        if (chunk.includes('[ERROR:')) {
          if (chunk.includes('RATE_LIMITED')) setError('High demand right now — try again in 30 seconds.')
          else if (chunk.includes('TIMEOUT')) setError('Generation timed out. Please try again.')
          else setError('Generation failed. Please try again.')
          break
        }
        accumulated += chunk
        setResult(accumulated)
      }

      setDone(true)
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        setError('Network error. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="demo" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">Try it right now — no sign-up needed</h2>
          <p className="text-[#64748B] text-lg">See the magic happen in under 60 seconds.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 sm:p-8 shadow-sm">
          <div className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-2">Job description</label>
              <Textarea
                placeholder="Paste the full job posting here... (at least 100 characters)"
                className="min-h-[140px] text-sm resize-none"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
              />
              <span className="text-xs text-gray-400 mt-1 block">{jobDescription.length} characters</span>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#64748B] mb-2">Your background</label>
              <Textarea
                placeholder="Briefly describe your experience, skills, and key achievements..."
                className="min-h-[100px] text-sm resize-none"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              onClick={generate}
              disabled={loading}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white h-12 text-base font-semibold w-full"
            >
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating your cover letter...</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" />Generate free cover letter</>
              )}
            </Button>
          </div>

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 border-t border-[#E2E8F0] pt-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#0F172A]">Your cover letter</h3>
                  {done && (
                    <span className="text-xs bg-[#10B981]/10 text-[#10B981] px-2 py-1 rounded-full font-medium">
                      Complete ✓
                    </span>
                  )}
                </div>

                <div className="bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-6">
                  <p className="text-[#0F172A] text-sm leading-relaxed whitespace-pre-wrap font-serif">
                    {result}
                    {!done && <span className="inline-block w-0.5 h-4 bg-[#3B82F6] ml-0.5 animate-pulse" />}
                  </p>
                </div>

                {done && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-xl p-6 text-white text-center"
                  >
                    <h4 className="font-bold text-lg mb-2">Want to save this and get more?</h4>
                    <p className="text-white/80 text-sm mb-4">Create a free account to save your letter, export to PDF, and get 3 free generations every month.</p>
                    <Button asChild className="bg-white text-[#3B82F6] hover:bg-gray-50 font-semibold">
                      <Link href="/signup">Save &amp; get full access →</Link>
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
