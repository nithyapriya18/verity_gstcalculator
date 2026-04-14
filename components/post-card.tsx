import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export interface PostCardProps {
  slug: string
  title: string
  date: string
  excerpt: string
  readingTime?: string
  tags?: string[]
  variant?: 'horizontal' | 'vertical'
}

export function PostCard({
  slug,
  title,
  date,
  excerpt,
  readingTime,
  tags,
  variant = 'horizontal',
}: PostCardProps) {
  const formatted = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  if (variant === 'vertical') {
    return (
      <Link
        href={`/writing/${slug}`}
        className="group block rounded-2xl border border-border bg-background p-6 hover:border-accent/30 hover:shadow-md transition-all duration-200"
      >
        <div className="flex flex-wrap gap-2 mb-3">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="text-xs text-accent bg-accent-light px-2.5 py-1 rounded-full font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-display font-semibold text-text-primary text-xl leading-snug mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed mb-4">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>{formatted}</span>
          {readingTime && <span>{readingTime}</span>}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/writing/${slug}`}
      className="group flex items-start gap-6 rounded-2xl border border-border bg-background p-6 hover:border-accent/30 hover:shadow-md transition-all duration-200"
    >
      {/* Date column */}
      <div className="shrink-0 pt-1">
        <time className="text-xs text-text-muted whitespace-nowrap">{formatted}</time>
        {readingTime && (
          <p className="text-xs text-text-muted mt-1">{readingTime}</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="font-display font-semibold text-text-primary text-xl leading-snug mb-2 group-hover:text-accent transition-colors">
          {title}
        </h3>
        <p className="text-text-muted text-sm leading-relaxed">{excerpt}</p>
      </div>

      {/* Arrow */}
      <ArrowRight
        size={16}
        className="shrink-0 text-text-muted mt-1 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200"
      />
    </Link>
  )
}
