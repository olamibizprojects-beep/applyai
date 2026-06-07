import { type Metadata } from 'next'
import { Check, X } from 'lucide-react'
import { StripePricingTables } from '@/components/marketing/StripePricingTables'

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Simple, transparent pricing. Start free, upgrade when you need more.',
}

const comparison = [
  { feature: 'Cover letter generations', free: '3/month', basic: 'Unlimited', pro: 'Unlimited' },
  { feature: 'Tones', free: 'Professional only', basic: 'All 4', pro: 'All 4' },
  { feature: 'PDF export', free: false, basic: true, pro: true },
  { feature: 'DOCX export', free: false, basic: true, pro: true },
  { feature: 'Watermark-free export', free: false, basic: true, pro: true },
  { feature: 'Saved resume slots', free: '0', basic: '3', pro: '5' },
  { feature: 'Job application tracker', free: false, basic: true, pro: true },
  { feature: 'Follow-up email generator', free: false, basic: true, pro: true },
  { feature: 'Resume bullet rewriter', free: false, basic: true, pro: true },
  { feature: 'ATS compatibility scorer', free: false, basic: false, pro: true },
  { feature: 'LinkedIn profile optimizer', free: false, basic: false, pro: true },
  { feature: 'Priority AI processing', free: false, basic: false, pro: true },
  { feature: '7-day free trial', free: false, basic: false, pro: true },
]

function Cell({ val }: { val: boolean | string }) {
  if (typeof val === 'string') return <span className="text-sm text-[#374151]">{val}</span>
  return val
    ? <Check size={18} className="text-[#10B981] mx-auto" />
    : <X size={18} className="text-[#E2E8F0] mx-auto" />
}

export default function PricingPage() {
  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-16 bg-[#F8FAFC] text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#0F172A] mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-[#64748B] text-lg">
            Start free. Upgrade when you land the interview.
          </p>
        </div>
      </section>

      {/* Stripe Embedded Pricing Tables */}
      <StripePricingTables />

      {/* Full feature comparison table */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0F172A] mb-8 text-center">Full feature comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#64748B]">Feature</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-[#64748B]">Free</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-[#3B82F6]">Basic $9/mo</th>
                  <th className="text-center px-6 py-4 text-sm font-semibold text-[#0F172A]">Pro $19/mo</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                    <td className="px-6 py-3 text-sm text-[#374151]">{row.feature}</td>
                    <td className="px-6 py-3 text-center"><Cell val={row.free} /></td>
                    <td className="px-6 py-3 text-center"><Cell val={row.basic} /></td>
                    <td className="px-6 py-3 text-center"><Cell val={row.pro} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
