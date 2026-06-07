'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

const beforeText = {
  paragraphs: [
    { text: 'I am writing to express my interest in the Software Engineer position at Acme Corp. I believe I would be a great fit for this role.', bad: true },
    { text: 'I am passionate about technology and have been working in the industry for 5 years. I am a team player and a hard worker who is always willing to go above and beyond.', bad: true },
    { text: 'I was excited to see this opportunity and I believe my skills would leverage synergy within your ecosystem.', bad: true },
    { text: 'Please find attached my resume. I look forward to hearing from you.', bad: true },
  ],
}

const afterText = {
  paragraphs: [
    { text: 'Acme Corp\'s mission to reduce enterprise software complexity by 10x is exactly the problem I\'ve been solving for the past five years — most recently cutting deployment time 60% at Stripe by redesigning the CI pipeline from scratch.', bad: false },
    { text: 'As a senior engineer at Stripe, I shipped payment infrastructure handling $2B in annual volume and mentored a team of 8 engineers to 95% sprint velocity. Before that, I reduced API latency 40% at Twilio through targeted database indexing — directly matching the performance challenges described in your job posting.', bad: false },
    { text: 'In my first 90 days at Acme, I\'d focus on mapping your current deployment bottlenecks, building relationships across the infrastructure team, and shipping one measurable improvement. I\'d love to discuss how my background fits what you\'re building — when can we connect?', bad: false },
  ],
}

function Annotation({ text, bad }: { text: string; bad: boolean }) {
  return (
    <div className={`flex gap-3 items-start p-3 rounded-lg mb-3 ${bad ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
      <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${bad ? 'bg-red-100' : 'bg-green-100'}`}>
        {bad ? <X size={12} className="text-red-600" /> : <Check size={12} className="text-green-600" />}
      </div>
      <p className={`text-sm leading-relaxed ${bad ? 'text-gray-600 line-through decoration-red-400' : 'text-gray-800'}`}>{text}</p>
    </div>
  )
}

export function BeforeAfter() {
  const [showing, setShowing] = useState<'before' | 'after'>('before')

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">The difference is obvious</h2>
          <p className="text-[#64748B] text-lg mb-8">Stop sending letters that get ignored. Here's what ApplyAI replaces.</p>

          <div className="inline-flex rounded-lg border border-[#E2E8F0] p-1 bg-[#F8FAFC]">
            <Button
              variant={showing === 'before' ? 'default' : 'ghost'}
              onClick={() => setShowing('before')}
              className={showing === 'before' ? 'bg-red-500 hover:bg-red-600 text-white' : 'text-gray-600'}
            >
              Before (typical)
            </Button>
            <Button
              variant={showing === 'after' ? 'default' : 'ghost'}
              onClick={() => setShowing('after')}
              className={showing === 'after' ? 'bg-green-500 hover:bg-green-600 text-white' : 'text-gray-600'}
            >
              After (ApplyAI)
            </Button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {showing === 'before' ? (
            <motion.div
              key="before"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <X className="text-red-500" size={20} />
                  <span className="font-semibold text-red-700">Generic cover letter — recruiters ignore these</span>
                </div>
                {beforeText.paragraphs.map((p, i) => <Annotation key={i} {...p} />)}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="after"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="max-w-2xl mx-auto"
            >
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                <div className="flex items-center gap-2 mb-6">
                  <Check className="text-green-500" size={20} />
                  <span className="font-semibold text-green-700">ApplyAI — specific, compelling, ATS-optimized</span>
                </div>
                {afterText.paragraphs.map((p, i) => <Annotation key={i} {...p} />)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
