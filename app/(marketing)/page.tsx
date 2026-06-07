import { type Metadata } from 'next'
import { Hero } from '@/components/marketing/Hero'
import { DemoWidget } from '@/components/marketing/DemoWidget'
import { BeforeAfter } from '@/components/marketing/BeforeAfter'
import { PricingTable } from '@/components/marketing/PricingTable'
import { FAQ } from '@/components/marketing/FAQ'
import { Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'ApplyAI — AI Cover Letter Generator',
  description: 'Generate tailored, ATS-optimized cover letters in 60 seconds. Paste a job description, upload your resume, get hired faster.',
}

const features = [
  { title: 'ATS-Optimized', desc: 'Keywords from the job description woven in naturally, so your letter passes automated screening.' },
  { title: '4 Tone Modes', desc: 'Professional, Enthusiastic, Concise, or Creative — match the company culture every time.' },
  { title: 'Streaming Generation', desc: 'Watch your letter appear in real time. Full output in under 60 seconds.' },
  { title: 'Rich Text Editor', desc: 'Edit, refine, and perfect your letter before downloading or sending.' },
  { title: 'PDF & DOCX Export', desc: 'Download in any format. Clean, professional layout ready to attach.' },
  { title: 'Job Tracker', desc: 'Track every application from applied to offer with a kanban board.' },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <DemoWidget />
      <BeforeAfter />

      {/* Features grid */}
      <section id="features" className="py-24 bg-[#0F172A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Everything you need to apply smarter</h2>
            <p className="text-white/60 text-lg">Not just a letter. A complete job application suite.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-colors">
                <div className="w-8 h-8 bg-[#3B82F6]/20 rounded-lg flex items-center justify-center mb-4">
                  <Check size={16} className="text-[#3B82F6]" />
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingTable />
      <FAQ />

      {/* Final CTA */}
      <section className="py-24 bg-gradient-to-r from-[#3B82F6] to-[#2563EB]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to land the interview?</h2>
          <p className="text-white/80 text-lg mb-8">Join 127,000+ job seekers who use ApplyAI to apply with confidence.</p>
          <Button size="lg" asChild className="bg-white text-[#3B82F6] hover:bg-gray-50 text-lg px-8 py-4 h-auto font-semibold">
            <Link href="/signup">Get started free — no credit card needed</Link>
          </Button>
        </div>
      </section>
    </>
  )
}
