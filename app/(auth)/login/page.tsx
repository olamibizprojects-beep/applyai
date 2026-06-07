'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [emailLoading, setEmailLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleGoogle() {
    setGoogleLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setEmailLoading(true)
    try {
      const result = await signIn('resend', { email, redirect: false, callbackUrl: '/dashboard' })
      if (result?.error) {
        toast.error('Failed to send magic link. Please try again.')
      } else {
        setEmailSent(true)
      }
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-[#0F172A]">Apply<span className="text-[#3B82F6]">AI</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-[#0F172A]">Welcome back</h1>
          <p className="text-[#64748B] text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-8 shadow-sm">
          {emailSent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✉️</span>
              </div>
              <h2 className="font-semibold text-[#0F172A] mb-2">Check your email</h2>
              <p className="text-[#64748B] text-sm">We sent a magic link to <strong>{email}</strong>. Click it to sign in.</p>
            </div>
          ) : (
            <>
              <Button
                onClick={handleGoogle}
                disabled={googleLoading}
                className="w-full h-11 bg-white border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC] font-medium"
                variant="outline"
              >
                {googleLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                Continue with Google
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E2E8F0]" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-[#94A3B8]">or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleEmail} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-[#374151]">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-1 h-10"
                    required
                    disabled={emailLoading}
                  />
                </div>
                <Button type="submit" disabled={emailLoading} className="w-full h-11 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium">
                  {emailLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send magic link
                </Button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-sm text-[#64748B] mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#3B82F6] font-medium hover:underline">Create one free</Link>
        </p>
        <p className="text-center mt-4">
          <Link href="/" className="text-sm text-[#94A3B8] hover:text-[#64748B]">← Back to home</Link>
        </p>
      </div>
    </div>
  )
}
