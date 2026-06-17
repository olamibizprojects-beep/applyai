import { type Metadata } from 'next'
import Link from 'next/link'
import {
  UserPlus,
  ClipboardList,
  FileText,
  Wand2,
  ScanSearch,
  ScrollText,
  Briefcase,
  Download,
  Kanban,
  ChevronRight,
  Lock,
  Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'How to Use ApplyAI — Step-by-Step Guide',
  description:
    'A complete step-by-step guide to using ApplyAI: generating ATS-optimized cover letters, scoring your resume, optimizing LinkedIn, and tracking job applications. Get hired faster.',
  keywords: [
    'how to use ApplyAI',
    'AI cover letter tutorial',
    'ATS cover letter guide',
    'how to generate cover letter AI',
    'cover letter generator tutorial',
    'job application guide',
    'ATS resume builder guide',
  ],
  alternates: { canonical: 'https://applyai.ink/guide' },
  openGraph: {
    title: 'How to Use ApplyAI — Step-by-Step Guide',
    description:
      'Complete guide to generating ATS cover letters, optimizing your resume, and tracking applications with ApplyAI.',
    type: 'article',
    url: 'https://applyai.ink/guide',
  },
}

interface Step {
  number: number
  icon: React.ElementType
  title: string
  description: string
  detail: string
  tip?: string
  proOnly?: boolean
  basicPlus?: boolean
}

const steps: Step[] = [
  {
    number: 1,
    icon: UserPlus,
    title: 'Create Your Free Account',
    description: 'Sign up in under 30 seconds with Google or your email address. No credit card required on the free plan.',
    detail:
      'Head to applyai.ink and click "Get started free." You can sign in with your Google account for instant access, or use your email to receive a magic link — no password needed. Your free account includes 3 cover letter generations per month so you can try everything before upgrading.',
    tip: 'Use Google sign-in for the fastest setup — one click and you\'re in.',
  },
  {
    number: 2,
    icon: ClipboardList,
    title: 'Paste the Job Description',
    description: 'Copy the full job posting — requirements, responsibilities, and company info — and paste it into the generator.',
    detail:
      'Open the Generate page from the dashboard sidebar. In the Job Description field, paste the complete job posting. The more detail you include (required skills, responsibilities, company culture, tech stack), the more precisely ApplyAI can tailor your cover letter. Include the company name and job title in their respective fields for the best output.',
    tip: 'Include the full posting — don\'t trim requirements or "nice to have" sections. AI uses all of it.',
  },
  {
    number: 3,
    icon: FileText,
    title: 'Add Your Resume',
    description: 'Paste your resume as plain text. ApplyAI maps your experience and achievements to the job requirements automatically.',
    detail:
      'In the Resume field, paste your resume as plain text. Include all sections: work experience with dates, education, skills, certifications, and any notable achievements with numbers. ApplyAI identifies your most relevant experience, selects the strongest matching accomplishments, and naturally weaves job description keywords throughout your cover letter.',
    tip: 'Use metrics wherever possible ("increased revenue by 32%", "managed team of 8"). Numbers stand out.',
  },
  {
    number: 4,
    icon: Wand2,
    title: 'Choose Your Tone and Generate',
    description: 'Select a writing tone, then click Generate. Your tailored cover letter streams in real time — done in under 60 seconds.',
    detail:
      'Choose from four tones: Professional (formal, polished), Enthusiastic (energetic, personality-forward), Concise (direct, under 250 words), or Creative (bold, memorable). The AI writes a three-paragraph letter: a company-specific hook, quantified achievements mapped to the role, and a confident call-to-action. The letter appears word-by-word as it\'s written.',
    tip: 'Concise tone works best for senior roles where time is scarce. Enthusiastic tone wins at startups and creative agencies.',
  },
  {
    number: 5,
    icon: ScanSearch,
    title: 'Review and Refine in the Editor',
    description: 'Read your generated letter in the built-in editor. Adjust tone, add personal details, or refine specific sentences.',
    detail:
      'After generation, your cover letter opens in a rich text editor. Read it carefully — check that the company name is right, the role title is accurate, and any achievement numbers are correct. You can edit directly in the editor, then mark the letter as Final when you\'re happy. All your letters are saved automatically and accessible from My Letters.',
    tip: 'Add one personal, specific detail about the company that the AI couldn\'t know — it signals genuine interest.',
  },
  {
    number: 6,
    icon: ScrollText,
    title: 'Optimize Your Resume with the ATS Builder',
    description: 'Paste your resume + job description to get a fully rewritten, ATS-ready resume with keyword analysis.',
    detail:
      'Go to Resume Builder in the sidebar. Paste your current resume and the target job description. The AI runs a full ATS analysis: it identifies critical keywords you\'re missing, rewrites your experience bullets as achievement statements, restructures your resume in ATS-safe formatting, and delivers an ATS Analysis Report, Keyword Match Report, and Recruiter Review Summary alongside the optimized resume.',
    tip: 'Copy the "Optimized Professional Summary" section first — it\'s ready to paste directly onto LinkedIn.',
    proOnly: true,
  },
  {
    number: 7,
    icon: ScanSearch,
    title: 'Check Your ATS Score',
    description: 'Run your cover letter against the job description to see your keyword match percentage and missing terms.',
    detail:
      'In the ATS Scorer (accessible from a generated letter), paste the job description and your cover letter. The scorer returns a 0–100 keyword match score, a list of matched keywords, missing keywords ranked by priority, and specific recommendations. Aim for 70%+ on critical keywords before submitting. If the score is low, regenerate with the same inputs or manually add the flagged terms.',
    tip: 'Don\'t aim for 100% — it can make the letter sound forced. 75–85% is the sweet spot.',
    proOnly: true,
  },
  {
    number: 8,
    icon: Briefcase,
    title: 'Optimize Your LinkedIn Profile',
    description: 'Paste your LinkedIn profile text and target role. Get a rewritten headline, About section, and experience bullets.',
    detail:
      'Go to LinkedIn Optimizer in the sidebar. Paste your current LinkedIn About section and recent work experience descriptions, then specify your target role. ApplyAI rewrites your headline using a proven recruiter-magnet formula, rewrites your About section with the right keywords for your target industry, and delivers improved experience bullets with stronger action verbs and metrics.',
    tip: 'Update your LinkedIn headline first — it\'s the #1 factor in recruiter search ranking.',
    proOnly: true,
  },
  {
    number: 9,
    icon: Download,
    title: 'Export as PDF or DOCX',
    description: 'Download your finalized cover letter as a clean, professional PDF or Word document — ready to attach to any application.',
    detail:
      'From the letter editor or My Letters page, click Export. Choose PDF for most online applications (ATS-safe, consistent formatting) or DOCX if the employer specifically requests a Word document. Basic and Pro plans export without watermarks. Free plan exports include an ApplyAI watermark — upgrade to remove it.',
    tip: 'Always submit PDF unless the posting says otherwise. Word files can reformat unpredictably across systems.',
    basicPlus: true,
  },
  {
    number: 10,
    icon: Kanban,
    title: 'Track Every Application in the Job Tracker',
    description: 'Log each application and move it through stages: Applied → Phone Screen → Interview → Final Round → Offer.',
    detail:
      'Open Job Tracker from the sidebar. Add a new application with the company, role, and job URL. Link it to the cover letter you generated. As your application progresses, drag it through the kanban stages. You can add notes, set follow-up reminders, and see a full history of every application in one place — no more spreadsheets.',
    tip: 'Set a follow-up date when you add each application. Following up 5–7 business days after applying increases callback rates significantly.',
    basicPlus: true,
  },
]

const toc = [
  'Create your free account',
  'Paste the job description',
  'Add your resume',
  'Choose your tone and generate',
  'Review and refine',
  'Optimize your resume (PRO)',
  'Check your ATS score (PRO)',
  'Optimize LinkedIn (PRO)',
  'Export PDF or DOCX',
  'Track applications',
]

export default function GuidePage() {
  return (
    <div className="pt-24 min-h-screen bg-[#F8FAFC]">
      {/* Hero */}
      <section className="bg-[#0F172A] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#3B82F6] text-sm font-semibold tracking-wide uppercase mb-3">Complete Guide</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            How to Use ApplyAI
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            A step-by-step walkthrough of every feature — from generating your first cover letter to tracking offers.
            Takes about 5 minutes to read.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#3B82F6] text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-[#2563EB] transition-colors text-sm"
            >
              <Zap size={15} />
              Get started free
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors text-sm"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Table of Contents */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 mb-10">
          <h2 className="text-sm font-semibold text-[#374151] mb-4 uppercase tracking-wide">In this guide</h2>
          <ol className="space-y-2">
            {toc.map((item, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F1F5F9] text-[#64748B] text-xs font-semibold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <a
                  href={`#step-${i + 1}`}
                  className="text-sm text-[#3B82F6] hover:underline"
                >
                  {item}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Plan Legend */}
        <div className="flex flex-wrap gap-3 mb-8 text-xs font-medium">
          <span className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full text-[#374151]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            Available on Free plan
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full text-[#374151]">
            <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
            Basic plan and above
          </span>
          <span className="flex items-center gap-1.5 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-full text-[#374151]">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            PRO plan only
          </span>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step) => {
            const Icon = step.icon
            const planBadge = step.proOnly
              ? { label: 'PRO', color: 'bg-purple-100 text-purple-700' }
              : step.basicPlus
              ? { label: 'Basic+', color: 'bg-blue-100 text-blue-700' }
              : { label: 'Free', color: 'bg-emerald-100 text-emerald-700' }

            return (
              <article
                key={step.number}
                id={`step-${step.number}`}
                className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden scroll-mt-24"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex items-start gap-5">
                    {/* Step number + icon */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                        <Icon size={22} className="text-[#3B82F6]" />
                      </div>
                      <span className="text-xs font-bold text-[#94A3B8]">Step {step.number}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h2 className="text-lg font-bold text-[#0F172A]">{step.title}</h2>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1 ${planBadge.color}`}>
                          {step.proOnly && <Lock size={10} />}
                          {planBadge.label}
                        </span>
                      </div>

                      <p className="text-[#374151] font-medium text-sm mb-3 leading-relaxed">
                        {step.description}
                      </p>

                      <p className="text-[#64748B] text-sm leading-relaxed mb-4">
                        {step.detail}
                      </p>

                      {step.tip && (
                        <div className="flex items-start gap-2.5 bg-[#FFF7ED] border border-orange-100 rounded-lg px-4 py-3">
                          <span className="text-orange-500 font-bold text-xs mt-0.5 flex-shrink-0">TIP</span>
                          <p className="text-sm text-[#92400E] leading-relaxed">{step.tip}</p>
                        </div>
                      )}

                      {step.proOnly && (
                        <div className="mt-3 flex items-center gap-2">
                          <Link
                            href="/pricing"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700 hover:underline"
                          >
                            Upgrade to PRO to unlock this feature
                            <ChevronRight size={13} />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        {/* FAQ */}
        <section className="mt-12 bg-white rounded-xl border border-[#E2E8F0] p-8">
          <h2 className="text-xl font-bold text-[#0F172A] mb-6">Common Questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'How many cover letters can I generate on the free plan?',
                a: '3 cover letters per month. Each generation resets at the start of your billing cycle. Upgrade to Basic or Pro for unlimited generations.',
              },
              {
                q: 'Does ApplyAI fabricate experience or achievements?',
                a: 'No. ApplyAI only optimizes and reorganizes information that exists in your resume. It never invents experience, credentials, or numbers. The AI selects and reframes your strongest real achievements.',
              },
              {
                q: 'Will the cover letter pass ATS screening?',
                a: 'Yes — ApplyAI is purpose-built for ATS. It uses plain text structure, standard section headings, job description keywords woven in naturally, and avoids tables, columns, or graphics that break ATS parsing.',
              },
              {
                q: 'Can I use ApplyAI for different industries?',
                a: 'Yes. ApplyAI adapts to the job description you provide. It works for tech, finance, healthcare, law, marketing, creative, and any other industry. The tone and vocabulary automatically match the role.',
              },
              {
                q: 'How is the ATS Resume Builder different from the cover letter generator?',
                a: 'The cover letter generator creates a tailored letter for a specific application. The ATS Resume Builder rewrites your entire resume — rewriting bullets as achievement statements, restructuring sections for ATS compliance, and integrating job-specific keywords throughout.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-[#F1F5F9] last:border-0 pb-6 last:pb-0">
                <h3 className="font-semibold text-[#0F172A] text-sm mb-2">{q}</h3>
                <p className="text-[#64748B] text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-8 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to start applying smarter?</h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Create your free account and generate your first tailored, ATS-optimized cover letter in under 60 seconds.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/signup"
              className="inline-block bg-white text-[#3B82F6] font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get started free →
            </Link>
            <Link
              href="/pricing"
              className="inline-block bg-white/20 text-white font-medium px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
            >
              See all features
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
