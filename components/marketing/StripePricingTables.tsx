'use client'

import { useState, useEffect } from 'react'
import { StripePricingEmbed } from './StripePricingEmbed'

const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
const BASIC_TABLE_ID  = process.env.NEXT_PUBLIC_STRIPE_BASIC_TABLE_ID!
const PRO_TABLE_ID    = process.env.NEXT_PUBLIC_STRIPE_PRO_TABLE_ID!

export function StripePricingTables() {
  const [selected, setSelected] = useState<'basic' | 'pro'>('basic')

  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Plan toggle */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#F1F5F9] border border-[#E2E8F0] rounded-full p-1.5">
            <button
              onClick={() => setSelected('basic')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                selected === 'basic'
                  ? 'bg-[#3B82F6] text-white shadow'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Basic — $9/mo
            </button>
            <button
              onClick={() => setSelected('pro')}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                selected === 'pro'
                  ? 'bg-[#0F172A] text-white shadow'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Pro — $19/mo ✦
            </button>
          </div>
        </div>

        {/* Stripe embedded table */}
        <div className="min-h-[480px]">
          {selected === 'basic' ? (
            <StripePricingEmbed
              key="basic"
              tableId={BASIC_TABLE_ID}
              publishableKey={PUBLISHABLE_KEY}
            />
          ) : (
            <StripePricingEmbed
              key="pro"
              tableId={PRO_TABLE_ID}
              publishableKey={PUBLISHABLE_KEY}
            />
          )}
        </div>

        <p className="text-center text-xs text-[#94A3B8] mt-6">
          Secured by Stripe · Cancel anytime · No hidden fees
        </p>
      </div>
    </section>
  )
}
