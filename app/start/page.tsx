import type { Metadata } from 'next'
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import { AnimateIn } from '@/components/animate-in'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Start Here',
  description: "Let's figure out if I'm the right fit for your project.",
}

const goodFit = [
  'You have a specific problem you can describe in a sentence or two.',
  'You need something working fast — not a year from now.',
  'You\'re a founder or small business owner, not a large corporation.',
  'You want one person who understands the whole problem.',
  'You\'ve tried to fix this manually and you\'re done with that.',
]

const notGoodFit = [
  'You need a team of developers for a large-scale product.',
  'You\'re not sure what problem you\'re trying to solve yet.',
  'You need to pass an enterprise security audit.',
  'You\'re looking for the cheapest possible option.',
  'You need someone on-site, full-time.',
]

const stages = [
  {
    step: '01',
    title: 'Discovery call',
    description: '90 minutes. I ask questions. You talk. We figure out the shape of the problem.',
  },
  {
    step: '02',
    title: 'One-page plan',
    description: 'I come back with what to build, how long it takes, and what it costs. Clear and simple.',
  },
  {
    step: '03',
    title: 'Working prototype',
    description: 'A real, usable first version in 1–2 weeks. Something you can react to.',
  },
  {
    step: '04',
    title: 'Full build',
    description: 'Complete product, deployed and handed over. Most builds are done in 2–4 weeks.',
  },
]

export default function StartPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="max-w-2xl">
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-text-primary leading-tight mb-6">
                Let&apos;s figure out if I&apos;m the right fit.
              </h1>
              <p className="text-lg md:text-xl text-text-muted leading-relaxed">
                I keep my client list small, which means I can give each project
                proper attention. Here&apos;s how to know if we should work together.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* Who this is for */}
      <section className="bg-surface py-20 md:py-28">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn className="mb-12">
            <h2 className="font-display font-semibold text-3xl text-text-primary">
              Is this for you?
            </h2>
          </AnimateIn>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Good fit */}
            <AnimateIn>
              <div className="bg-background rounded-2xl p-7 border border-border">
                <h3 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
                  <CheckCircle size={18} className="text-green-600" />
                  This is probably for you if…
                </h3>
                <ul className="space-y-3">
                  {goodFit.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-muted leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>

            {/* Not good fit */}
            <AnimateIn delay={0.1}>
              <div className="bg-background rounded-2xl p-7 border border-border">
                <h3 className="font-semibold text-text-primary mb-5 flex items-center gap-2">
                  <XCircle size={18} className="text-red-400" />
                  This is probably NOT for you if…
                </h3>
                <ul className="space-y-3">
                  {notGoodFit.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-text-muted leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateIn>
          </div>
        </div>
      </section>

      {/* The process */}
      <section className="bg-background py-20 md:py-28">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn className="mb-12">
            <h2 className="font-display font-semibold text-3xl text-text-primary">
              How it works
            </h2>
          </AnimateIn>

          <div className="flex flex-col gap-0">
            {stages.map((stage, i) => (
              <AnimateIn key={stage.step} delay={i * 0.08}>
                <div className="flex gap-6 pb-10 last:pb-0 relative">
                  {/* Vertical line */}
                  {i < stages.length - 1 && (
                    <div
                      className="absolute left-5 top-10 bottom-0 w-px"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(180deg, #E5E2D9 0, #E5E2D9 6px, transparent 6px, transparent 14px)',
                      }}
                    />
                  )}
                  {/* Step number */}
                  <div className="w-10 h-10 rounded-full bg-accent-light flex items-center justify-center shrink-0 z-10">
                    <span className="text-xs font-semibold text-accent">{stage.step}</span>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-semibold text-text-primary mb-1">{stage.title}</h3>
                    <p className="text-text-muted text-sm leading-relaxed">{stage.description}</p>
                  </div>
                </div>
              </AnimateIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing signal */}
      <section className="bg-surface py-20 md:py-28">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="max-w-2xl border-l-4 border-accent pl-8">
              <h2 className="font-display font-semibold text-3xl text-text-primary mb-6">
                On pricing
              </h2>
              <div className="space-y-4 text-base md:text-lg text-text-muted leading-relaxed">
                <p>
                  Discovery sessions start from{' '}
                  <span className="text-text-primary font-medium">
                    ₹15,000 / $300.
                  </span>{' '}
                  Full builds are scoped after that — no surprise quotes.
                </p>
                <p>
                  You&apos;ll know the number before any work begins. I don&apos;t do open-ended retainers or hourly billing on the main build.
                </p>
                <p>
                  Monthly support, once you&apos;re live, is a flat fee. Simple.
                </p>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="max-w-xl">
              <h2 className="font-display font-semibold text-3xl md:text-4xl text-text-primary mb-4">
                Ready to talk?
              </h2>
              <p className="text-text-muted text-lg leading-relaxed mb-8">
                Book a 90-minute Discovery session. We&apos;ll look at your problem together and figure out if I can help.
              </p>
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-accent text-white font-semibold text-base hover:bg-accent/90 hover:shadow-lg transition-all duration-200 group"
              >
                Book a Discovery call
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </a>
              <p className="text-text-muted text-sm mt-5">
                No commitment. No sales pitch. Just a conversation.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
