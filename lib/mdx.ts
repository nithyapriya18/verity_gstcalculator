import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const contentDirectory = path.join(process.cwd(), 'content')

export interface PostMeta {
  slug: string
  title: string
  date: string
  excerpt: string
  tags?: string[]
  readingTime: string
  // Case study extras
  problem?: string
  outcome?: string
  metric?: string
  beforeText?: string
  afterText?: string
}

export interface Post extends PostMeta {
  content: string
}

export function getPostSlugs(type: 'work' | 'writing'): string[] {
  const dir = path.join(contentDirectory, type)
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
}

export function getPostBySlug(type: 'work' | 'writing', slug: string): Post {
  const fullPath = path.join(contentDirectory, type, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title ?? '',
    date: data.date ?? '',
    excerpt: data.excerpt ?? '',
    tags: data.tags ?? [],
    readingTime: stats.text,
    problem: data.problem,
    outcome: data.outcome,
    metric: data.metric,
    beforeText: data.beforeText,
    afterText: data.afterText,
    content,
  }
}

export function getAllPosts(type: 'work' | 'writing'): Post[] {
  const slugs = getPostSlugs(type)
  return slugs
    .map((slug) => getPostBySlug(type, slug))
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
}
