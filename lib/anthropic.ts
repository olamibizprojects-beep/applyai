import Anthropic from '@anthropic-ai/sdk'
import type { Tone } from '@/types'

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
