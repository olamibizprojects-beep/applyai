import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: { default: 'ApplyAI — AI Cover Letter Generator', template: '%s | ApplyAI' },
  description: 'Generate tailored, ATS-optimized cover letters in 60 seconds. Paste a job description, upload your resume, get hired faster.',
  keywords: ['cover letter generator', 'AI cover letter', 'ATS optimized', 'job application'],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'ApplyAI',
    title: 'ApplyAI — AI Cover Letter Generator',
    description: 'Get a tailored, ATS-optimized cover letter in 60 seconds.',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <SessionProvider>
          {children}
          <Toaster position="bottom-right" />
        </SessionProvider>
      </body>
    </html>
  )
}
