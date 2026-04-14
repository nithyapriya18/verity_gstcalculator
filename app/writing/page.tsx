import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/mdx'
import { PostCard } from '@/components/post-card'
import { AnimateIn } from '@/components/animate-in'

export const metadata: Metadata = {
  title: 'Writing',
  description: 'Thinking out loud. Things learned building products for real businesses.',
}

// PLACEHOLDER: Falls back gracefully if no MDX files exist yet
async function getPosts() {
  try {
    return getAllPosts('writing')
  } catch {
    return []
  }
}

// PLACEHOLDER fallback posts for when content directory is empty
const fallbackPosts = [
  {
    slug: 'manual-process-cost',
    title: 'The most expensive thing a small business owns is a manual process',
    date: '2026-02-10',
    excerpt:
      "It doesn't show up on any balance sheet. But every hour spent on a task that should run itself is an hour not spent on the thing that actually grows your business.",
    readingTime: '4 min read',
    tags: ['Product thinking'],
    content: '',
  },
  {
    slug: 'ninety-minutes-blank-page',
    title: 'Why I always start with 90 minutes and a blank page',
    date: '2026-01-22',
    excerpt:
      "Most people want to skip the conversation and get straight to the solution. In my experience, that's the fastest way to build the wrong thing.",
    readingTime: '5 min read',
    tags: ['Client stories'],
    content: '',
  },
]

export default async function WritingPage() {
  const mdxPosts = await getPosts()
  const posts = mdxPosts.length > 0 ? mdxPosts : fallbackPosts

  return (
    <div>
      {/* Header */}
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-text-primary mb-4">
              Thinking out loud
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-text-muted text-lg md:text-xl max-w-xl leading-relaxed">
              Things I&apos;ve learned building products for real businesses.
              No fluff. No content marketing. Just honest observations.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Posts */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <div className="flex flex-col gap-4">
            {posts.map((post) => (
              <AnimateIn key={post.slug}>
                <PostCard
                  slug={post.slug}
                  title={post.title}
                  date={post.date}
                  excerpt={post.excerpt}
                  readingTime={post.readingTime}
                  tags={post.tags}
                  variant="horizontal"
                />
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
