export type Tier = 'FREE' | 'BASIC' | 'PRO'
export type Tone = 'PROFESSIONAL' | 'ENTHUSIASTIC' | 'CONCISE' | 'CREATIVE'
export type DocStatus = 'DRAFT' | 'FINAL' | 'SENT'
export type Stage = 'APPLIED' | 'PHONE_SCREEN' | 'INTERVIEW' | 'FINAL_ROUND' | 'OFFER' | 'REJECTED' | 'WITHDRAWN'

export const TIER_LIMITS = {
  FREE: {
    generationsPerMonth: 3,
    tones: ['PROFESSIONAL'] as Tone[],
    resumeSlots: 0,
    canExportPDF: false,
    canExportDOCX: false,
    watermark: true,
    atsScore: false,
    linkedinOptimizer: false,
    followUpGenerator: false,
    bulletRewriter: false,
    jobTracker: false,
    resumeBuilder: false,
  },
  BASIC: {
    generationsPerMonth: Infinity,
    tones: ['PROFESSIONAL', 'ENTHUSIASTIC', 'CONCISE', 'CREATIVE'] as Tone[],
    resumeSlots: 3,
    canExportPDF: true,
    canExportDOCX: true,
    watermark: false,
    atsScore: false,
    linkedinOptimizer: false,
    followUpGenerator: true,
    bulletRewriter: true,
    jobTracker: true,
    resumeBuilder: false,
  },
  PRO: {
    generationsPerMonth: Infinity,
    tones: ['PROFESSIONAL', 'ENTHUSIASTIC', 'CONCISE', 'CREATIVE'] as Tone[],
    resumeSlots: 5,
    canExportPDF: true,
    canExportDOCX: true,
    watermark: false,
    atsScore: true,
    linkedinOptimizer: true,
    followUpGenerator: true,
    bulletRewriter: true,
    jobTracker: true,
    resumeBuilder: true,
  },
} as const

export const PRICING = {
  BASIC: { monthly: 9, annual: 79, priceId: process.env.STRIPE_BASIC_PRICE_ID! },
  PRO: { monthly: 19, annual: 159, priceId: process.env.STRIPE_PRO_PRICE_ID! },
}

export interface UserProfile {
  id: string
  email: string
  emailVerified: Date | null
  name: string | null
  image: string | null
  stripeCustomerId: string | null
  subscriptionTier: Tier
  subscriptionId: string | null
  subscriptionEnd: Date | null
  generationsUsed: number
  generationsResetAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface ResumeRecord {
  id: string
  userId: string
  name: string
  content: string
  fileUrl: string | null
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CoverLetterRecord {
  id: string
  userId: string
  resumeId: string | null
  companyName: string
  jobTitle: string
  jobDescription: string
  tone: Tone
  content: string
  atsScore: number | null
  atsKeywords: string[]
  status: DocStatus
  createdAt: Date
  updatedAt: Date
}

export interface ApplicationRecord {
  id: string
  userId: string
  coverLetterId: string | null
  companyName: string
  jobTitle: string
  jobUrl: string | null
  stage: Stage
  notes: string | null
  appliedAt: Date
  followUpAt: Date | null
  updatedAt: Date
}

export interface GenerateRequest {
  jobDescription: string
  resumeText: string
  tone: Tone
  additionalContext?: string
  companyName?: string
  jobTitle?: string
}

export interface ATSScoreResult {
  score: number
  matchedKeywords: string[]
  missingKeywords: string[]
  suggestions: string[]
}

export interface LinkedInOptimizeResult {
  headline: string
  about: string
  experienceBullets: string[]
}

export interface BulletRewriteResult {
  rewritten: Array<{ original: string; improved: string }>
}

export interface ApiError {
  error: string
  code?: string
}
