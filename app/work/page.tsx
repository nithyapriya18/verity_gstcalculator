import { WorkCard, type WorkCardProps } from '@/components/work-card'
import { AnimateIn } from '@/components/animate-in'

const allWork: WorkCardProps[] = [
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

export default function WorkPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-background py-24 md:py-32">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <h1 className="font-display font-semibold text-4xl md:text-5xl text-text-primary mb-4">
              Things I&apos;ve built
            </h1>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <p className="text-text-muted text-lg md:text-xl max-w-xl leading-relaxed">
              Real products I&apos;m shipping. Starting with the GST Calculator.
            </p>
          </AnimateIn>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-surface py-16 md:py-20">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {allWork.map((item) => (
              <WorkCard key={item.slug} {...item} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
