# ApplyAI — Claude Code Context

## What this is
ApplyAI is a freemium SaaS for AI-powered cover letter generation. Users paste a job
description + resume and get a tailored cover letter in 60 seconds.

## Key commands
- `npm run dev` — start dev server on port 3000
- `npm run build` — production build
- `npx prisma migrate dev` — run migrations
- `npx prisma studio` — open DB GUI
- `npx prisma db seed` — seed test data
- `stripe listen --forward-to localhost:3000/api/stripe/webhook` — test webhooks locally
- Production domain: https://applyai.ink

## Architecture
- Next.js 14 App Router, TypeScript strict
- Prisma + PostgreSQL for all data
- NextAuth v5 for auth (Google + magic link)
- Claude API for all AI generation (streaming via SSE)
- Stripe for billing (webhook-driven state updates)

## Freemium logic
- Location: `lib/ratelimit.ts` and `app/api/generate/route.ts`
- Free limits: 3 generations/month, Professional tone only, no export, watermarked PDFs
- Basic ($9/mo): unlimited generations, all tones, PDF+DOCX export, 3 resume slots
- Pro ($19/mo): everything in Basic + ATS scorer, LinkedIn optimizer, follow-up generator,
  resume bullet rewriter, job tracker, priority processing

## AI system prompt
- Location: `lib/anthropic.ts` — exported as `COVER_LETTER_SYSTEM_PROMPT`
- Tuned to avoid all detected AI writing patterns
- Do not change without testing output quality

## Stripe webhook events handled
- checkout.session.completed → upgrade user tier
- customer.subscription.deleted → downgrade to FREE
- invoice.payment_failed → send payment failure email

## Important files
- `types/index.ts` — all shared TypeScript types and enums
- `lib/auth.ts` — NextAuth config with Prisma adapter
- `prisma/schema.prisma` — single source of truth for data model
