import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Resend from 'next-auth/providers/resend'
import { prisma } from '@/lib/prisma'
import type { Tier } from '@/types'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY!,
      from: process.env.RESEND_FROM_EMAIL ?? 'noreply@applyai.ink',
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { subscriptionTier: true, generationsUsed: true, generationsResetAt: true },
        })
        if (dbUser) {
          session.user.subscriptionTier = dbUser.subscriptionTier as Tier
          session.user.generationsUsed = dbUser.generationsUsed
          session.user.generationsResetAt = dbUser.generationsResetAt
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  events: {
    async createUser({ user }) {
      if (user.email) {
        try {
          const { Resend: ResendClient } = await import('resend')
          const resend = new ResendClient(process.env.RESEND_API_KEY!)
          await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL ?? 'noreply@applyai.ink',
            to: user.email,
            subject: 'Welcome to ApplyAI!',
            html: `
              <div style="font-family: Inter, system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background: #F8FAFC;">
                <div style="background: white; border-radius: 12px; padding: 40px; border: 1px solid #E2E8F0;">
                  <h1 style="color: #0F172A; font-size: 24px; margin-bottom: 8px;">Welcome to ApplyAI, ${user.name?.split(' ')[0] ?? 'there'}! 👋</h1>
                  <p style="color: #64748B; font-size: 16px; line-height: 1.6;">You're now ready to generate tailored, ATS-optimized cover letters in under 60 seconds.</p>
                  <div style="background: #F1F5F9; border-radius: 8px; padding: 24px; margin: 24px 0;">
                    <h3 style="color: #0F172A; margin: 0 0 12px;">What you get on the free plan:</h3>
                    <ul style="color: #64748B; padding-left: 20px; margin: 0;">
                      <li style="margin-bottom: 8px;">3 cover letter generations per month</li>
                      <li style="margin-bottom: 8px;">Professional tone</li>
                      <li style="margin-bottom: 8px;">Copy &amp; paste export</li>
                    </ul>
                  </div>
                  <a href="${process.env.NEXT_PUBLIC_APP_URL}/generate" style="display: inline-block; background: #3B82F6; color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px;">Generate your first cover letter →</a>
                </div>
              </div>
            `,
          })
        } catch {
          // Non-critical — don't block sign-in if email fails
        }
      }
    },
  },
})

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      subscriptionTier: Tier
      generationsUsed: number
      generationsResetAt: Date
    }
  }
}
