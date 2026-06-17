import { type Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | AI Cover Letter Tips, ATS Resume Advice & Job Search Strategies — ApplyAI',
  description:
    'Expert guides on writing ATS-optimized cover letters and resumes, job search strategies, LinkedIn optimization, and using AI to land more interviews. Free resources for job seekers.',
  keywords: [
    'AI cover letter generator',
    'ATS optimized cover letter',
    'how to write a cover letter',
    'cover letter examples 2025',
    'ATS resume tips',
    'resume builder AI',
    'job search strategies',
    'LinkedIn profile optimization',
    'cover letter template',
    'ATS score',
    'free cover letter generator',
    'tailored cover letter',
  ],
  alternates: { canonical: 'https://applyai.ink/blog' },
  openGraph: {
    title: 'ApplyAI Blog — Cover Letter & Resume Tips for Job Seekers',
    description:
      'ATS optimization guides, cover letter templates, resume advice, and AI-powered job search strategies.',
    type: 'website',
    url: 'https://applyai.ink/blog',
    siteName: 'ApplyAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApplyAI Blog — Cover Letter & ATS Resume Tips',
    description: 'Expert guides on cover letters, ATS optimization, and AI-powered job search strategies.',
  },
}

const categories = ['All', 'Cover Letters', 'ATS & Tech', 'Resumes', 'LinkedIn', 'Job Search']

const posts = [
  {
    title: 'How to Write an ATS-Optimized Cover Letter in 2025',
    excerpt:
      'Over 75% of applications never reach human eyes. Learn the exact keyword strategy, formatting rules, and tone adjustments that help you pass automated screening — without sounding robotic.',
    date: 'June 10, 2026',
    readTime: '7 min read',
    slug: 'ats-optimized-cover-letter',
    category: 'ATS & Tech',
    featured: true,
  },
  {
    title: '7 Cover Letter Mistakes That Get You Rejected Instantly',
    excerpt:
      'Recruiters spend 7 seconds on your cover letter. Here are the exact phrases and patterns that make them stop reading — and what to write instead.',
    date: 'June 5, 2026',
    readTime: '5 min read',
    slug: 'cover-letter-mistakes',
    category: 'Cover Letters',
    featured: false,
  },
  {
    title: 'What Is an ATS Score and How to Beat It in 2025',
    excerpt:
      'Applicant Tracking Systems score your resume and cover letter before any human sees them. Here\'s exactly how ATS scoring works and the 6 levers you can pull to improve your score fast.',
    date: 'June 2, 2026',
    readTime: '6 min read',
    slug: 'what-is-ats-score',
    category: 'ATS & Tech',
    featured: false,
  },
  {
    title: '10 Resume Keywords Recruiters Actually Search For',
    excerpt:
      'Recruiters don\'t read resumes — they search them. These are the top power keywords by industry that get your profile surfaced in recruiter searches, with examples for each.',
    date: 'May 28, 2026',
    readTime: '8 min read',
    slug: 'resume-keywords-recruiters-search',
    category: 'Resumes',
    featured: false,
  },
  {
    title: 'The One Cover Letter Structure That Gets Callbacks',
    excerpt:
      'After analyzing thousands of successful applications, one structure emerges. It has three paragraphs, a specific hook, and an unconventional close. We break down every element.',
    date: 'May 22, 2026',
    readTime: '6 min read',
    slug: 'cover-letter-structure',
    category: 'Cover Letters',
    featured: false,
  },
  {
    title: 'LinkedIn Profile Optimization: The Complete 2025 Guide',
    excerpt:
      'Your LinkedIn profile is your 24/7 recruiter magnet — or it isn\'t. This guide covers headline formulas, the About section structure, keyword placement, and the 3 things most profiles get wrong.',
    date: 'May 18, 2026',
    readTime: '10 min read',
    slug: 'linkedin-profile-optimization-guide',
    category: 'LinkedIn',
    featured: false,
  },
  {
    title: 'How to Tailor Your Cover Letter to Any Job Description',
    excerpt:
      'Generic cover letters fail. Here\'s a repeatable 4-step process for customizing your cover letter to mirror each job description — and how AI can cut your time from 45 minutes to 60 seconds.',
    date: 'May 12, 2026',
    readTime: '5 min read',
    slug: 'tailor-cover-letter-job-description',
    category: 'Cover Letters',
    featured: false,
  },
  {
    title: 'Follow-Up Email After Applying: Templates That Actually Work',
    excerpt:
      'Most candidates never follow up. The ones who do — with the right message at the right time — get interviews. Here are 3 proven templates for application follow-ups, interview thank-yous, and check-ins.',
    date: 'May 6, 2026',
    readTime: '4 min read',
    slug: 'follow-up-email-after-applying',
    category: 'Job Search',
    featured: false,
  },
  {
    title: 'How to Write a Cover Letter With No Experience (2025 Guide)',
    excerpt:
      'No experience doesn\'t mean no cover letter. Learn how to leverage transferable skills, coursework, volunteer work, and strong framing to write a compelling letter that gets you interviews — even for your first job.',
    date: 'April 29, 2026',
    readTime: '6 min read',
    slug: 'cover-letter-no-experience',
    category: 'Cover Letters',
    featured: false,
  },
  {
    title: 'AI Cover Letter Generators Compared: Free vs Paid in 2025',
    excerpt:
      'We tested 8 AI cover letter tools so you don\'t have to. Here\'s a full breakdown of output quality, customization, ATS-readiness, and value — with a clear recommendation for each use case.',
    date: 'April 20, 2026',
    readTime: '9 min read',
    slug: 'ai-cover-letter-generators-compared',
    category: 'ATS & Tech',
    featured: false,
  },
]

const categoryColors: Record<string, string> = {
  'Cover Letters': 'bg-blue-50 text-blue-700',
  'ATS & Tech': 'bg-emerald-50 text-emerald-700',
  'Resumes': 'bg-orange-50 text-orange-700',
  'LinkedIn': 'bg-sky-50 text-sky-700',
  'Job Search': 'bg-purple-50 text-purple-700',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'ApplyAI Blog',
  description: 'Expert guides on cover letters, ATS optimization, resume writing, and AI-powered job search.',
  url: 'https://applyai.ink/blog',
  publisher: {
    '@type': 'Organization',
    name: 'ApplyAI',
    url: 'https://applyai.ink',
  },
  blogPost: posts.map(post => ({
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `https://applyai.ink/blog/${post.slug}`,
    author: { '@type': 'Organization', name: 'ApplyAI' },
  })),
}

export default function BlogPage() {
  const featured = posts.find(p => p.featured)!
  const regular = posts.filter(p => !p.featured)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-24 min-h-screen bg-[#F8FAFC]">
        {/* Hero */}
        <section className="bg-[#0F172A] py-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-[#3B82F6] text-sm font-semibold tracking-wide uppercase mb-3">ApplyAI Blog</p>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                Land more interviews.<br className="hidden sm:block" /> Apply smarter.
              </h1>
              <p className="text-white/60 text-lg leading-relaxed">
                ATS optimization guides, cover letter strategies, resume tips, and AI-powered job search tactics — written by career experts.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 mt-8">
              {categories.map(cat => (
                <span
                  key={cat}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium cursor-pointer transition-colors ${
                    cat === 'All'
                      ? 'bg-[#3B82F6] text-white'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Featured Post */}
          <article className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden mb-10 hover:shadow-lg transition-shadow group">
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
                  Featured
                </span>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[featured.category] ?? 'bg-gray-100 text-gray-600'}`}>
                  {featured.category}
                </span>
                <span className="text-xs text-[#94A3B8]">{featured.date}</span>
                <span className="text-[#E2E8F0]">·</span>
                <span className="text-xs text-[#94A3B8]">{featured.readTime}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-4 group-hover:text-[#3B82F6] transition-colors leading-snug">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p className="text-[#64748B] leading-relaxed mb-6 max-w-3xl">{featured.excerpt}</p>
              <Link
                href={`/blog/${featured.slug}`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#3B82F6] hover:gap-3 transition-all"
              >
                Read article →
              </Link>
            </div>
          </article>

          {/* Post Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map(post => (
              <article
                key={post.slug}
                className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:shadow-md transition-shadow group flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                    {post.category}
                  </span>
                </div>
                <h2 className="text-base font-semibold text-[#0F172A] mb-2 group-hover:text-[#3B82F6] transition-colors leading-snug flex-1">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-[#64748B] text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#F1F5F9]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#94A3B8]">{post.date}</span>
                    <span className="text-[#E2E8F0]">·</span>
                    <span className="text-xs text-[#94A3B8]">{post.readTime}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} className="text-xs font-medium text-[#3B82F6] hover:underline">
                    Read →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* SEO Content Block */}
          <section className="mt-16 bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-10">
            <h2 className="text-xl font-bold text-[#0F172A] mb-4">About This Blog</h2>
            <div className="prose prose-sm max-w-none text-[#64748B] leading-relaxed space-y-4">
              <p>
                The ApplyAI blog is your go-to resource for modern job search strategies, ATS optimization techniques,
                cover letter writing advice, and AI-powered career tools. Whether you&apos;re crafting your first cover letter
                or optimizing your tenth application, we publish actionable guides grounded in how hiring actually works today.
              </p>
              <p>
                Our articles cover the full job application cycle: understanding how Applicant Tracking Systems (ATS) score
                resumes and cover letters, writing targeted cover letters that pass automated screening, optimizing your
                LinkedIn profile for recruiter searches, and tracking applications through the interview funnel. We also
                compare tools — including AI cover letter generators, resume builders, and ATS checkers — so you can
                choose the right tool for every stage of your search.
              </p>
              <p>
                Popular topics include:{' '}
                <Link href="/blog/ats-optimized-cover-letter" className="text-[#3B82F6] hover:underline">ATS-optimized cover letters</Link>,{' '}
                <Link href="/blog/resume-keywords-recruiters-search" className="text-[#3B82F6] hover:underline">resume keywords</Link>,{' '}
                <Link href="/blog/linkedin-profile-optimization-guide" className="text-[#3B82F6] hover:underline">LinkedIn optimization</Link>, and{' '}
                <Link href="/blog/cover-letter-mistakes" className="text-[#3B82F6] hover:underline">cover letter mistakes to avoid</Link>.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="mt-8 bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to apply smarter?</h2>
            <p className="text-white/80 mb-6">Generate your first ATS-optimized cover letter in 60 seconds — free.</p>
            <Link
              href="/signup"
              className="inline-block bg-white text-[#3B82F6] font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Get started free →
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}
