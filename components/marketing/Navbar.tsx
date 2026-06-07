'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#0F172A]">Apply<span className="text-[#3B82F6]">AI</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pricing</Link>
            <Link href="/blog" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" asChild><Link href="/login">Sign in</Link></Button>
            <Button asChild className="bg-[#3B82F6] hover:bg-[#2563EB] text-white">
              <Link href="/signup">Get started free</Link>
            </Button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          <Link href="/#features" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Features</Link>
          <Link href="/pricing" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Pricing</Link>
          <Link href="/blog" className="block text-sm font-medium text-gray-700 py-2" onClick={() => setMenuOpen(false)}>Blog</Link>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" asChild className="flex-1"><Link href="/login">Sign in</Link></Button>
            <Button asChild className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white"><Link href="/signup">Get started</Link></Button>
          </div>
        </div>
      )}
    </nav>
  )
}
