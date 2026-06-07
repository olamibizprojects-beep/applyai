'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import Link from 'next/link'

const plans = [
  {
    name: 'Free',
    tier: 'FREE',
    monthly: 0,
    annual: 0,
    cta: 'Get started',
    href: '/signup',
    popular: false,
    features: [
      '3 cover letters per month',
      'Professional tone only',
      'Copy & paste export',
      'Basic templates',
    ],
    notIncluded: [
      'PDF & DOCX export',
      'All 4 tones',
      'Job tracker',
      'ATS scorer',
      'Resume storage',
    ],
  },
  {
    name: 'Basic',
    tier: 'BASIC',
    monthly: 9,
    annual: 79,
    cta: 'Start applying',
    href: '/signup?plan=basic',
    popular: true,
    features: [
      'Unlimited cover letters',
      'All 4 tones (Professional, Enthusiastic, Concise, Creative)',
      'PDF & DOCX export',
      'Email follow-up generator',
      'Resume bullet rewriter',
      'Job application tracker',
      '3 saved resume slots',
    ],
    notIncluded: [
      'ATS compatibility scorer',
      'LinkedIn profile optimizer',
    ],
  },
  {
    name: 'Pro',
    tier: 'PRO',
    monthly: 19,
    annual: 159,
    cta: 'Get hired faster',
    href: '/signup?plan=pro',
    popular: false,
    trial: '7-day free trial',
    features: [
      'Everything in Basic',
      'ATS compatibility scorer',
      'LinkedIn profile optimizer',
      'Priority AI processing',
      '5 saved resume slots',
      'Advanced analytics',
    ],
    notIncluded: [],
  },
]

export function PricingTable() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-24 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0F172A] mb-4">Simple, transparent pricing</h2>
          <p className="text-[#64748B] text-lg mb-8">Start free. Upgrade when you land the interview.</p>

          <div className="inline-flex items-center gap-3 bg-white border border-[#E2E8F0] rounded-full px-2 py-2">
            <button
              onClick={() => setAnnual(false)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!annual ? 'bg-[#0F172A] text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${annual ? 'bg-[#0F172A] text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Annual <span className="text-[#10B981]">save 30%</span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.tier}
              className={`relative bg-white rounded-2xl border p-8 flex flex-col ${
                plan.popular
                  ? 'border-[#3B82F6] shadow-lg shadow-blue-100 scale-105'
                  : 'border-[#E2E8F0] hover:shadow-md transition-shadow'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-[#3B82F6] text-white px-4 py-1">Most popular</Badge>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#0F172A] mb-2">{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold text-[#0F172A]">
                    ${annual && plan.monthly > 0 ? Math.round(plan.annual / 12) : plan.monthly}
                  </span>
                  {plan.monthly > 0 && <span className="text-[#64748B] mb-1">/mo</span>}
                </div>
                {annual && plan.annual > 0 && (
                  <p className="text-xs text-[#64748B] mt-1">Billed ${plan.annual}/year</p>
                )}
                {plan.trial && (
                  <p className="text-xs text-[#10B981] font-medium mt-1">{plan.trial}, cancel anytime</p>
                )}
              </div>

              <Button
                asChild
                className={`mb-6 h-11 font-semibold ${
                  plan.popular
                    ? 'bg-[#3B82F6] hover:bg-[#2563EB] text-white'
                    : 'bg-[#0F172A] hover:bg-[#1e293b] text-white'
                }`}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#374151]">
                    <Check size={16} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[#94A3B8] line-through">
                    <span className="w-4 h-4 mt-0.5 flex-shrink-0 text-center text-xs">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
