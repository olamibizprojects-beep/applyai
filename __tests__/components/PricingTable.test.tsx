import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PricingTable } from '@/components/marketing/PricingTable'

describe('PricingTable', () => {
  it('renders all three pricing tiers', () => {
    render(<PricingTable />)
    expect(screen.getByText('Free')).toBeDefined()
    expect(screen.getByText('Basic')).toBeDefined()
    expect(screen.getByText('Pro')).toBeDefined()
  })

  it('renders correct monthly prices', () => {
    render(<PricingTable />)
    expect(screen.getByText('$0')).toBeDefined()
    expect(screen.getByText('$9')).toBeDefined()
    expect(screen.getByText('$19')).toBeDefined()
  })

  it('shows Most popular badge on Basic plan', () => {
    render(<PricingTable />)
    expect(screen.getByText('Most popular')).toBeDefined()
  })

  it('shows trial text on Pro plan', () => {
    render(<PricingTable />)
    expect(screen.getByText(/7-day free trial/i)).toBeDefined()
  })

  it('renders feature lists for all plans', () => {
    render(<PricingTable />)
    expect(screen.getByText(/3 cover letters per month/i)).toBeDefined()
    expect(screen.getByText(/Unlimited cover letters/i)).toBeDefined()
    expect(screen.getByText(/ATS compatibility scorer/i)).toBeDefined()
  })
})
