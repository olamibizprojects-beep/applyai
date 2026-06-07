import { type Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Job search tips, cover letter advice, and career resources from ApplyAI.',
}

const posts = [
  {
    title: '7 Cover Letter Mistakes That Get You Rejected Instantly',
    excerpt: 'Recruiters spend 7 seconds on your cover letter. Here are the phrases that make them stop reading.',
    date: 'June 1, 2025',
    readTime: '5 min read',
    slug: 'cover-letter-mistakes',
  },
  {
    title: 'How to Write an ATS-Optimized Cover Letter in 2025',
    excerpt: 'Over 75% of resumes never reach human eyes. Learn how to beat the bots without sounding robotic.',
    date: 'May 28, 2025',
    readTime: '7 min read',
    slug: 'ats-optimized-cover-letter',
  },
  {
    title: 'The One Cover Letter Structure That Gets Callbacks',
    excerpt: 'After analyzing 10,000 successful applications, one pattern emerges. We break it down.',
    date: 'May 20, 2025',
    readTime: '6 min read',
    slug: 'cover-letter-structure',
  },
]

export default function BlogPage() {
  return (
    <div className="pt-24 min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-4xl font-bold text-[#0F172A] mb-4">Blog</h1>
        <p className="text-[#64748B] text-lg mb-12">Job search tips, cover letter advice, and career resources.</p>

        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white rounded-xl border border-[#E2E8F0] p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs text-[#64748B]">{post.date}</span>
                <span className="text-[#E2E8F0]">·</span>
                <span className="text-xs text-[#64748B]">{post.readTime}</span>
              </div>
              <h2 className="text-xl font-semibold text-[#0F172A] mb-3 hover:text-[#3B82F6] transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-[#64748B] text-sm leading-relaxed">{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className="inline-block mt-4 text-sm font-medium text-[#3B82F6] hover:underline">
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
