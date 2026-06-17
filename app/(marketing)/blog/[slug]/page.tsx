import { type Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { getPost, getAllSlugs, blogPosts, type ContentBlock } from '@/lib/blog-posts'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return { title: 'Not Found' }

  return {
    title: `${post.title} — ApplyAI Blog`,
    description: post.metaDescription,
    alternates: { canonical: `https://applyai.ink/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.metaDescription,
      type: 'article',
      url: `https://applyai.ink/blog/${post.slug}`,
      publishedTime: post.date,
      siteName: 'ApplyAI',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription,
    },
  }
}

const categoryColors: Record<string, string> = {
  'Cover Letters': 'bg-blue-50 text-blue-700',
  'ATS & Tech': 'bg-emerald-50 text-emerald-700',
  'Resumes': 'bg-orange-50 text-orange-700',
  'LinkedIn': 'bg-sky-50 text-sky-700',
  'Job Search': 'bg-purple-50 text-purple-700',
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'h2':
      return <h2 className="text-xl font-bold text-[#0F172A] mt-8 mb-3">{block.text}</h2>
    case 'h3':
      return <h3 className="text-lg font-semibold text-[#0F172A] mt-6 mb-2">{block.text}</h3>
    case 'p':
      return <p className="text-[#374151] leading-relaxed mb-4">{block.text}</p>
    case 'ul':
      return (
        <ul className="list-none space-y-2 mb-4 pl-0">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[#374151] leading-relaxed">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#3B82F6] flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'ol':
      return (
        <ol className="space-y-3 mb-4 pl-0">
          {block.items?.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[#374151] leading-relaxed">
              <span className="mt-0.5 w-6 h-6 rounded-full bg-[#EFF6FF] text-[#3B82F6] text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      )
    case 'tip':
      return (
        <div className="flex items-start gap-3 bg-[#FFF7ED] border border-orange-100 rounded-xl px-5 py-4 mb-4">
          <span className="text-orange-500 font-bold text-xs mt-0.5 flex-shrink-0 tracking-wide">TIP</span>
          <p className="text-sm text-[#92400E] leading-relaxed">{block.text}</p>
        </div>
      )
    case 'warning':
      return (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-xl px-5 py-4 mb-4">
          <span className="text-red-600 font-bold text-xs mt-0.5 flex-shrink-0">NOTE</span>
          <p className="text-sm text-red-800 leading-relaxed">{block.text}</p>
        </div>
      )
    case 'quote':
      return (
        <blockquote className="border-l-4 border-[#3B82F6] bg-[#F8FAFC] rounded-r-xl pl-5 pr-5 py-4 mb-4">
          <p className="text-[#374151] leading-relaxed whitespace-pre-line text-sm">{block.text}</p>
        </blockquote>
      )
    default:
      return null
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    datePublished: post.date,
    author: { '@type': 'Organization', name: 'ApplyAI', url: 'https://applyai.ink' },
    publisher: { '@type': 'Organization', name: 'ApplyAI', url: 'https://applyai.ink' },
    url: `https://applyai.ink/blog/${post.slug}`,
    mainEntityOfPage: `https://applyai.ink/blog/${post.slug}`,
  }

  const related = blogPosts
    .filter(p => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3)

  const otherRelated = related.length < 3
    ? blogPosts.filter(p => p.slug !== post.slug && p.category !== post.category).slice(0, 3 - related.length)
    : []

  const relatedPosts = [...related, ...otherRelated].slice(0, 3)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="pt-24 min-h-screen bg-[#F8FAFC]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[#64748B] hover:text-[#0F172A] transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[post.category] ?? 'bg-gray-100 text-gray-600'}`}>
                {post.category}
              </span>
              <span className="text-xs text-[#94A3B8]">{post.date}</span>
              <span className="text-[#E2E8F0]">·</span>
              <span className="text-xs text-[#94A3B8]">{post.readTime}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0F172A] leading-tight mb-4">
              {post.title}
            </h1>
            <p className="text-[#64748B] text-lg leading-relaxed">
              {post.excerpt}
            </p>
          </header>

          {/* Divider */}
          <div className="border-t border-[#E2E8F0] mb-8" />

          {/* Article body */}
          <article className="bg-white rounded-2xl border border-[#E2E8F0] p-8 sm:p-10 mb-8">
            {post.content.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </article>

          {/* CTA */}
          <div className="bg-gradient-to-r from-[#3B82F6] to-[#2563EB] rounded-2xl p-8 text-center mb-10">
            <h2 className="text-xl font-bold text-white mb-2">Put this into practice</h2>
            <p className="text-white/80 text-sm mb-5">Generate a tailored, ATS-optimized cover letter in 60 seconds — free.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-block bg-white text-[#3B82F6] font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
              >
                Get started free →
              </Link>
              <Link
                href="/guide"
                className="inline-block bg-white/20 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-white/30 transition-colors text-sm"
              >
                See how it works
              </Link>
            </div>
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-[#0F172A] mb-4">More articles</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {relatedPosts.map(rp => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-md transition-shadow group"
                  >
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[rp.category] ?? 'bg-gray-100 text-gray-600'}`}>
                      {rp.category}
                    </span>
                    <h3 className="text-sm font-semibold text-[#0F172A] mt-2 leading-snug group-hover:text-[#3B82F6] transition-colors">
                      {rp.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] mt-2">{rp.readTime}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
