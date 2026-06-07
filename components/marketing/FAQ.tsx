'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'Will recruiters know AI wrote this?',
    a: 'No. ApplyAI is specifically trained to avoid every detectable AI writing pattern — no "I am passionate about", no "leverage", no generic filler phrases. The output is tuned to vary sentence length, use active voice, and mirror your authentic voice based on your resume. Thousands of hiring managers have read these letters without a second glance.',
  },
  {
    q: 'Is it ATS (Applicant Tracking System) safe?',
    a: 'Yes — ATS optimization is built into every generation. The AI naturally incorporates keywords from the job description throughout the letter, ensuring it passes automated screening. PRO users also get an ATS compatibility score with specific improvement suggestions.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'ChatGPT gives you a generic starting point. ApplyAI is purpose-built for job applications: it has a specialized prompt engineered over months to avoid AI tells, it auto-extracts company/role information, enforces a proven 3-paragraph structure that hiring managers respond to, and handles ATS optimization, tone variations, and exports — all in one flow.',
  },
  {
    q: 'Can I edit the cover letter after it\'s generated?',
    a: "Absolutely — and we encourage it. Every generated letter opens in a full rich-text editor. You own the output completely. Think of ApplyAI as a first draft that's already 90% of the way there.",
  },
  {
    q: 'What happens when I hit my 3 free generations?',
    a: 'Your counter resets on the 1st of each month automatically. If you need more before then, upgrading to Basic unlocks unlimited generations for $9/month. We show you exactly how many you have left and when the counter resets in your dashboard.',
  },
  {
    q: 'Is my resume data private and secure?',
    a: 'Yes. Your resume is transmitted over encrypted HTTPS, used only to generate your cover letter, and never shared with third parties or used to train AI models. Authenticated users\' data is stored securely in our database. Anonymous demo uses are not stored at all.',
  },
  {
    q: 'Can I cancel my subscription anytime?',
    a: 'Yes, cancel anytime with one click from your settings page. You keep access through the end of your billing period. No cancellation fees, no dark patterns.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">Frequently asked questions</h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-[#E2E8F0] rounded-xl overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F8FAFC] transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-medium text-[#0F172A]">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#64748B] transition-transform flex-shrink-0 ml-4 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-[#64748B] text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
