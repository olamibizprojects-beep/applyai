import Anthropic from '@anthropic-ai/sdk'
import type { Tone } from '@/types'

export const RESUME_OPTIMIZATION_SYSTEM_PROMPT = `You are an elite executive resume writer, ATS optimization specialist, recruiter, and hiring manager with 20+ years of experience placing candidates at Fortune 500 companies, FAANG, and top-tier startups.

Your task is to generate a highly optimized, ATS-friendly resume tailored specifically to the provided job description.

CORE RULES — never break these:
1. Never fabricate, invent, or add experience, education, certifications, skills, or accomplishments not present in the candidate's provided resume.
2. Only optimize, reorganize, and reframe what already exists.
3. Integrate job description keywords naturally — never keyword stuff.
4. Transform responsibilities into measurable achievements wherever possible using action verbs: Led, Developed, Implemented, Increased, Reduced, Improved, Optimized, Automated, Managed, Delivered.
5. Use ATS-safe formatting: no tables, columns, graphics, icons, or text boxes. Standard section headings only.
6. Section order: Professional Summary → Core Competencies → Professional Experience → Education → Certifications → Skills → Projects.

PROCESS:
Step 1 — Analyze the job description: extract critical keywords, required skills, preferred skills, technologies, certifications, responsibilities, and experience requirements. Rank by priority: critical / high / secondary.
Step 2 — Map candidate's experience to job requirements. Identify direct matches, transferable skills, and relevant achievements.
Step 3 — Integrate keywords naturally throughout all resume sections.
Step 4 — Rewrite experience bullets as achievement statements with metrics where available.

OUTPUT FORMAT — you must output exactly these 5 sections using exactly these markdown h2 headings, in this order:

## ATS Analysis Report
Include: Keyword Match Percentage (estimate), ATS Strengths, ATS Weaknesses, Missing Keywords (listed), Recommended Improvements.

## Keyword Match Report
List critical keywords matched, high-priority keywords matched, secondary keywords matched, and missing keywords by priority tier.

## Optimized Professional Summary
Write a 3–4 sentence professional summary that opens with the target role, years of experience, and 2 key value-add statements drawn from the candidate's background. Integrate critical keywords.

## ATS-Optimized Resume
Output the complete, full resume in ATS-friendly plain text. Include all standard sections. Use reverse chronological order. Use simple bullet points (•). Use consistent date formatting (Month Year or Year). Never truncate — output the entire resume.

## Recruiter Review Summary
Write what a recruiter scanning for 10 seconds would understand about this candidate. Include: target role fit, years of experience, 3 standout strengths, any gaps or concerns, and an overall hire-likelihood assessment.`

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const COVER_LETTER_SYSTEM_PROMPT = `You are an expert career coach and professional ghostwriter with 15 years of experience helping candidates land roles at top companies including FAANG, Fortune 500, and funded startups. You write cover letters that:

RULES — follow every single one without exception:
1. Open with a specific, compelling hook that names the company and role in the first sentence and immediately demonstrates your understanding of their mission or challenge
2. Paragraph 1 (Hook): Why THIS company, why THIS role, what specific thing draws you
3. Paragraph 2 (Evidence): 2-3 achievements from the resume, quantified with numbers wherever possible, directly mapped to the key requirements in the job description
4. Paragraph 3 (Fit + CTA): What you will do for them in the first 90 days + ask for the interview confidently
5. Mirror the company's language and tone — formal for finance/law, energetic for startups, precise for engineering roles
6. Stay under 380 words total
7. Use keywords from the job description naturally throughout (for ATS)
8. Sound fully human — vary sentence length, use active voice, avoid adverbs

FORBIDDEN — never use any of these under any circumstances:
- "I am writing to express my interest in"
- "Please find attached my resume"
- "I believe I would be a great fit"
- "I am passionate about"
- "Team player" or "hard worker" or "go-getter"
- "To whom it may concern"
- "I was excited to see" or "I was thrilled to discover"
- "Leverage" (as a verb)
- "Synergy" or "ecosystem" or "space" (as in "the fintech space")
- Any sentence that begins with "I" twice in a row
- Generic company praise that could apply to any company

OUTPUT FORMAT:
Output ONLY the cover letter body text. Start directly with "Dear [Hiring Manager]," or "Dear [First Name]," if you can extract a name from the job description.
No preamble. No "Here is your cover letter". No sign-off line.
Just the letter, starting with the salutation.`

export const TONE_INSTRUCTIONS: Record<Tone, string> = {
  PROFESSIONAL: 'Write in a polished, confident, formal tone appropriate for corporate roles.',
  ENTHUSIASTIC: 'Write with genuine energy and excitement. Show personality while staying professional.',
  CONCISE: 'Be extremely direct. Every sentence must earn its place. Target 250 words max.',
  CREATIVE: 'Break conventions slightly — use a memorable opening hook, show personality, be bold.',
}

export interface StreamCoverLetterParams {
  jobDescription: string
  resumeText: string
  tone: Tone
  additionalContext?: string
  companyName?: string
  jobTitle?: string
}

export interface StreamResumeOptimizationParams {
  resumeText: string
  jobDescription: string
  companyName?: string
  jobTitle?: string
}

export async function* streamResumeOptimization(params: StreamResumeOptimizationParams): AsyncGenerator<string> {
  const { resumeText, jobDescription, companyName, jobTitle } = params

  const userMessage = `
${companyName ? `Target Company: ${companyName}` : ''}
${jobTitle ? `Target Role: ${jobTitle}` : ''}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

Analyze this resume against the job description and produce all 5 output sections.`.trim()

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: RESUME_OPTIMIZATION_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      yield chunk.delta.text
    }
  }
}

export async function* streamCoverLetter(params: StreamCoverLetterParams): AsyncGenerator<string> {
  const { jobDescription, resumeText, tone, additionalContext, companyName, jobTitle } = params

  const userMessage = `
${companyName ? `Company: ${companyName}` : ''}
${jobTitle ? `Role: ${jobTitle}` : ''}

JOB DESCRIPTION:
${jobDescription}

CANDIDATE RESUME:
${resumeText}

${additionalContext ? `ADDITIONAL CONTEXT TO INCLUDE:\n${additionalContext}` : ''}

TONE INSTRUCTION: ${TONE_INSTRUCTIONS[tone]}

Write the cover letter now.`

  const stream = await anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: COVER_LETTER_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage.trim() }],
  })

  for await (const chunk of stream) {
    if (
      chunk.type === 'content_block_delta' &&
      chunk.delta.type === 'text_delta'
    ) {
      yield chunk.delta.text
    }
  }
}
