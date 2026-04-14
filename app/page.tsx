import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, ArrowRight } from 'lucide-react'
import { Hero } from '@/components/hero'
import { StagesSection } from '@/components/stages-section'
import { WorkCard, type WorkCardProps } from '@/components/work-card'
import { PostCard, type PostCardProps } from '@/components/post-card'
import { TestimonialCard, TestimonialPlaceholder } from '@/components/testimonial'
import { BeforeAfterToggle } from '@/components/before-after-toggle'
import { AnimateIn } from '@/components/animate-in'
import { CursorGlow } from '@/components/cursor-glow'
import { siteConfig } from '@/config'

const placeholderWork: WorkCardProps[] = [
  {
    slug: 'gst-calculator',
    title: 'GST Calculator for Indian businesses',
    problem: 'Daily tax calculation friction',
    outcome: 'Faster GST breakdowns and instant invoice totals',
    metric: '18% in 1 tap',
    tags: ['Utility app', 'Finance', 'India'],
    beforeText:
      'People switch between spreadsheets and calculators to split CGST/SGST vs IGST, especially while creating quick quotes.',
    afterText:
      'A single web app handles forward + reverse GST and itemized bill totals, with a login-gated live version.',
  },
]

// PLACEHOLDER: Replace with real blog posts
const placeholderPosts: PostCardProps[] = [
  {
    slug: 'manual-process-cost',
    title: 'The most expensive thing a small business owns is a manual process',
    date: '2026-02-10',
    excerpt:
      "It doesn't show up on any balance sheet. But every hour spent on a task that should run itself is an hour not spent on the thing that actually grows your business.",
    readingTime: '4 min read',
    tags: ['Product thinking'],
  },
  {
    slug: 'ninety-minutes-blank-page',
    title: 'Why I always start with 90 minutes and a blank page',
    date: '2026-01-22',
    excerpt:
      'Most people want to skip the conversation and get straight to the solution. In my experience, that\'s the fastest way to build the wrong thing.',
    readingTime: '5 min read',
    tags: ['Client stories'],
  },
]

// PLACEHOLDER: Replace with real testimonials
const testimonials = [
  {
    quote:
      'Nithya understood the problem in the first 20 minutes better than our last developer did in three months.',
    name: '[Client Name]',
    role: 'Founder',
    company: '[Company]',
    companyType: 'Founder · SaaS',
  },
  {
    quote:
      'We had something working in two weeks. I didn\'t think that was possible.',
    name: '[Client Name]',
    role: 'Operations Manager',
    company: '[Company]',
    companyType: 'Owner · Retail',
  },
]

export default function Home() {
  return (
    <div className="relative">
      <CursorGlow />

      {/* Section 1: Hero */}
      <Hero />

      {/* Section 2: The Problem */}
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left: text */}
            <AnimateIn>
              <div className="space-y-5 text-base md:text-lg leading-[1.75] text-text-muted max-w-prose">
                <p>
                  Most founders and small business owners know exactly what&apos;s
                  slowing them down.
                </p>
                <p>
                  A manual process done in spreadsheets. A report built by hand
                  every week. Something they&apos;ve always wished &ldquo;just happened
                  automatically.&rdquo;
                </p>
                <p>
                  They don&apos;t need a lecture on technology. They need someone who
                  listens, figures out the simplest fix, and builds it — fast.
                </p>
                <p className="text-text-primary font-medium">That&apos;s what I do.</p>
              </div>
            </AnimateIn>

            {/* Right: Before/After toggle card */}
            <AnimateIn delay={0.15}>
              <BeforeAfterToggle />
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section id="how-it-works" className="bg-background py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn className="mb-14 md:mb-16">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-text-primary">
              Here&apos;s how we work together
            </h2>
          </AnimateIn>

          <StagesSection />
        </div>
      </section>

      {/* Section 4: About */}
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
            {/* Left: photo */}
            <AnimateIn>
              <div className="relative aspect-[4/5] max-w-sm rounded-3xl overflow-hidden border border-border shadow-sm">
                <Image
                  src="/nithya.jpeg"
                  alt="Nithya — Verity Studios"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
              </div>
            </AnimateIn>

            {/* Right: text */}
            <AnimateIn delay={0.15}>
              <div className="space-y-5">
                <h2 className="font-display font-semibold text-3xl md:text-4xl text-text-primary">
                  Hi, I&apos;m Nithya.
                </h2>
                <div className="space-y-4 text-base md:text-lg leading-[1.75] text-text-muted">
                  <p>
                    I work with founders and small businesses who have a problem
                    and need someone to take it somewhere. I run the discovery,
                    figure out what to build, and ship a working product —
                    usually in 2–4 weeks.
                  </p>
                  <p>
                    I&apos;ve spent years working in data and product, which means I
                    think like a business owner first and a developer second. I
                    won&apos;t rush to a solution until I understand the problem. And
                    I won&apos;t disappear after launch.
                  </p>
                  <p>
                    I work with a small number of clients at a time, which means
                    you get my full attention — not a junior handoff.
                  </p>
                </div>

                {/* Proof points */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                  {[
                    '2–4 week builds',
                    'No jargon, no handoffs',
                    'Discovery-first approach',
                  ].map((point) => (
                    <div
                      key={point}
                      className="flex items-start gap-2 text-sm text-text-primary"
                    >
                      <CheckCircle
                        size={16}
                        className="text-accent shrink-0 mt-0.5"
                      />
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Section 5: Selected Work */}
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn className="mb-3">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-text-primary">
              Things I&apos;ve built
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.05} className="mb-12 md:mb-14">
            <p className="text-text-muted text-lg">
              Each one started with a problem. Here&apos;s what happened.
            </p>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-6">
            {placeholderWork.map((item) => (
              <WorkCard key={item.slug} {...item} />
            ))}
          </div>

          <AnimateIn className="mt-10">
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all duration-200"
            >
              See all work
              <ArrowRight size={14} />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* Section 6: Writing Preview */}
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn className="mb-3">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-text-primary">
              Thinking out loud
            </h2>
          </AnimateIn>
          <AnimateIn delay={0.05} className="mb-12 md:mb-14">
            <p className="text-text-muted text-lg">
              Things I&apos;ve learned building products for real businesses.
            </p>
          </AnimateIn>

          <div className="flex flex-col gap-4">
            {placeholderPosts.map((post) => (
              <AnimateIn key={post.slug}>
                <PostCard {...post} variant="horizontal" />
              </AnimateIn>
            ))}
          </div>

          <AnimateIn className="mt-10">
            <Link
              href="/writing"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:gap-3 transition-all duration-200"
            >
              All writing
              <ArrowRight size={14} />
            </Link>
          </AnimateIn>
        </div>
      </section>

      {/* Section 7: Social Proof */}
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn className="mb-12 md:mb-14">
            <h2 className="font-display font-semibold text-3xl md:text-4xl text-text-primary">
              What clients say
            </h2>
          </AnimateIn>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <AnimateIn key={i} delay={i * 0.1}>
                <TestimonialCard {...t} />
              </AnimateIn>
            ))}
            <AnimateIn delay={0.2}>
              <TestimonialPlaceholder />
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* Section 8: Honest Scope */}
      <section className="bg-surface py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="max-w-2xl border-l-4 border-accent pl-8 py-2">
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-text-primary mb-8">
                This might not be for you
              </h2>
              <div className="space-y-5 text-base md:text-lg leading-[1.75] text-text-muted">
                <p>
                  What I build is designed to solve a specific problem, fast and
                  affordably. It is not designed to handle tens of thousands of
                  simultaneous users, pass an enterprise security audit, or
                  replace a full engineering team.
                </p>
                <p>
                  If your ambition grows beyond that, I&apos;ll help you figure out
                  what comes next — and be honest about where you need more than
                  me.
                </p>
                <p className="text-text-primary font-medium">
                  Most clients find this kind of honesty refreshing.
                  <br />I find it&apos;s the only way to do good work.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section
        className="py-24 md:py-32 text-white text-center"
        style={{ backgroundColor: '#C96B3A' }}
      >
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <h2 className="font-display font-semibold text-3xl md:text-5xl mb-6 leading-tight">
              Have a problem worth solving?
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed">
              Start with a 90-minute Discovery session. We&apos;ll figure out if this
              is the right fit — and what it would take to fix it.
            </p>
            <a
              href={siteConfig.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-accent font-semibold text-base hover:bg-white/95 hover:shadow-xl transition-all duration-200 group"
            >
              Book a Discovery call
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </a>
            <p className="text-white/50 text-sm mt-6">
              No commitment. No sales pitch. Just a conversation.
            </p>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
