import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { ReadingProgress } from '@/components/reading-progress'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  try {
    const posts = getAllPosts('writing')
    return posts.map((p) => ({ slug: p.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = getPostBySlug('writing', params.slug)
    return { title: post.title, description: post.excerpt }
  } catch {
    return { title: 'Post' }
  }
}

export default function PostPage({ params }: Props) {
  let post
  try {
    post = getPostBySlug('writing', params.slug)
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
      <ReadingProgress />

      {/* Back link */}
      <div className="max-w-content mx-auto px-6 md:px-8 pt-12">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Back to writing
        </Link>
      </div>

      {/* Header */}
      <header className="max-w-content mx-auto px-6 md:px-8 py-12">
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 mb-5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-accent bg-accent-light px-2.5 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="font-display font-semibold text-3xl md:text-4xl text-text-primary leading-tight mb-6">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-5 text-sm text-text-muted mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {formatted}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {post.readingTime}
          </span>
          <span className="text-text-muted">by Nithya</span>
        </div>

        <div className="h-px bg-border" />
      </header>

      {/* Body */}
      <div className="max-w-content mx-auto px-6 md:px-8 pb-24 prose">
        <MDXRemote source={post.content} />
      </div>

      {/* Back link (bottom) */}
      <div className="max-w-content mx-auto px-6 md:px-8 pb-16 border-t border-border pt-8">
        <Link
          href="/writing"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-accent transition-colors"
        >
          <ArrowLeft size={14} />
          Back to writing
        </Link>
      </div>
    </article>
  )
}
