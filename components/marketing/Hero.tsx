'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

export function Hero() {
  const [count, setCount] = useState(127453)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => c + Math.floor(Math.random() * 3))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1e3a5f] to-[#0F172A] animate-[gradient_8s_ease_infinite]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(59,130,246,0.15)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(16,185,129,0.08)_0%,_transparent_60%)]" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Social proof badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              {count.toLocaleString()} cover letters generated so far
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Land the interview.{' '}
            <span className="text-[#3B82F6]">Your AI cover letter,</span>
            <br />in 60 seconds.
          </h1>

          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Paste a job description. Upload your resume. Get a tailored, ATS-optimized cover letter
            that sounds like you wrote it — because you approved every word.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white text-lg px-8 py-4 h-auto rounded-lg shadow-lg shadow-blue-500/25 transition-transform active:scale-[0.98]"
              asChild
            >
              <Link href="/signup">Generate your cover letter free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto rounded-lg"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              See how it works ↓
            </Button>
          </div>

          <p className="text-white/40 text-sm mt-6">No credit card required · 3 free letters per month</p>
        </motion.div>
      </div>
    </section>
  )
}
