'use client'

import { useEffect, useRef } from 'react'

interface StripePricingEmbedProps {
  tableId: string
  publishableKey: string
  customerEmail?: string
  clientReferenceId?: string
}

export function StripePricingEmbed({
  tableId,
  publishableKey,
  customerEmail,
  clientReferenceId,
}: StripePricingEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Load the Stripe script once
    const scriptId = 'stripe-pricing-table-script'
    let script = document.getElementById(scriptId) as HTMLScriptElement | null

    const render = () => {
      if (!container) return
      container.innerHTML = ''

      const attrs: Record<string, string> = {
        'pricing-table-id': tableId,
        'publishable-key': publishableKey,
      }
      if (customerEmail) attrs['customer-email'] = customerEmail
      if (clientReferenceId) attrs['client-reference-id'] = clientReferenceId

      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ')

      container.innerHTML = `<stripe-pricing-table ${attrStr}></stripe-pricing-table>`
    }

    if (!script) {
      script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://js.stripe.com/v3/pricing-table.js'
      script.async = true
      script.onload = render
      document.head.appendChild(script)
    } else {
      // Script already loaded
      render()
    }

    return () => {
      if (container) container.innerHTML = ''
    }
  }, [tableId, publishableKey, customerEmail, clientReferenceId])

  return <div ref={containerRef} className="w-full" />
}
