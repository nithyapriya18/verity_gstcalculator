import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Calendar, Clock } from 'lucide-react'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = getAllPosts('work')
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = getPostBySlug('work', slug)
    return { title: post.title, description: post.excerpt }
  } catch {
    return { title: 'Case Study' }
  }
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params
  let post
  try {
    post = getPostBySlug('work', slug)
  } catch {
    notFound()
  }

  const formatted = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="bg-background min-h-screen">
      {/* Back link */}
      <div className="max-w-content mx-auto px-6 md:px-8 pt-12">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Back to work
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-content mx-auto px-6 md:px-8 py-12">
        {post.problem && (
          <span className="text-xs font-medium uppercase tracking-widest text-accent bg-accent-light px-2.5 py-1 rounded-full mb-5 inline-block">
            {post.problem}
          </span>
        )}
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-text-primary leading-tight mb-5">
          {post.title}
        </h1>

        {post.metric && (
          <div className="text-3xl font-display font-semibold text-accent mb-6">
            {post.metric}
          </div>
        )}

        {slug === 'gst-calculator' && (
          <div className="mb-7">
            <Link
              href="/gst-calculator"
              className="inline-flex items-center gap-2 text-sm px-5 py-2.5 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200"
            >
              Open live app
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        <div className="flex flex-wrap gap-5 text-sm text-text-muted">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {formatted}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {post.readingTime}
          </span>
        </div>

        <div className="h-px bg-border mt-8" />
      </header>

      {/* Body */}
      <div className="max-w-content mx-auto px-6 md:px-8 pb-24 prose">
        {post.content
          .trim()
          .split(/\n{2,}/)
          .map((block, index) => {
            if (block.startsWith('## ')) {
              return (
                <h2 key={index} className="font-display font-semibold text-2xl mt-10 mb-4">
                  {block.replace('## ', '')}
                </h2>
              )
            }

            if (block.startsWith('- ')) {
              const items = block
                .split('\n')
                .map((line) => line.trim())
                .filter((line) => line.startsWith('- '))
                .map((line) => line.replace(/^- /, ''))

              return (
                <ul key={index} className="list-disc pl-6 space-y-2 mb-5">
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            }

            const linkOnly = block.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
            if (linkOnly) {
              const [, label, href] = linkOnly
              return (
                <p key={index}>
                  <Link href={href} className="text-accent underline underline-offset-4">
                    {label}
                  </Link>
                </p>
              )
            }

            return (
              <p key={index} className="mb-5">
                {block}
              </p>
            )
          })}
      </div>
    </article>
  )
}
