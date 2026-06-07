# ApplyAI — AI Cover Letter & Job Application Suite

ApplyAI is a freemium SaaS application that helps job seekers generate tailored, ATS-optimized cover letters in under 60 seconds. Users paste a job description, upload or paste their resume, select a writing tone, and receive a fully written cover letter streamed in real time — powered by Claude Sonnet.

The product follows a freemium model: a generous free tier (3 letters/month) drives signups, while paid tiers unlock unlimited generations, all tone modes, PDF/DOCX export, the job application tracker, ATS compatibility scoring, LinkedIn profile optimization, and resume bullet rewriting.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router + TypeScript (strict) |
| Styling | Tailwind CSS + shadcn/ui |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js v5 (Google OAuth + Resend magic link) |
| AI | Anthropic Claude API with streaming |
| Payments | Stripe subscriptions + webhooks |
| Email | Resend |
| File uploads | UploadThing |
| Rate limiting | Upstash Redis |
| Deployment | Vercel |

## Prerequisites

- Node.js 18+
- PostgreSQL database (local or hosted)
- Anthropic API key
- Stripe account
- Google OAuth credentials
- Resend account
- UploadThing account
- Upstash Redis instance

## Local Setup

```bash
git clone https://github.com/your-org/applyai.git
cd applyai
npm install
cp .env.example .env.local
# Fill in all values in .env.local
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

## Testing Stripe Webhooks Locally

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## Deployment to Vercel

1. Push code to GitHub
2. Import at vercel.com/new
3. Add all env vars from .env.example
4. Set up production PostgreSQL
5. Run: npx prisma migrate deploy
6. Configure Stripe webhook: https://your-domain.vercel.app/api/stripe/webhook

## Environment Variables

See `.env.example` for all required variables with descriptions.

## Architecture

- App Router + Server Components for data-fetching pages, client components only for interactive UI
- Streaming Claude API response piped directly to HTTP response (< 1s time-to-first-token)
- Stripe webhooks as authoritative subscription state source
- Upstash Redis sliding-window rate limiting for anonymous and free-tier users
- NextAuth v5 with PrismaAdapter for Google + magic link auth
