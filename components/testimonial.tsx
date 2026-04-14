export interface TestimonialProps {
  quote: string
  name: string
  role: string
  company: string
  companyType: string
}

export function TestimonialCard({
  quote,
  name,
  role,
  company,
  companyType,
}: TestimonialProps) {
  // Split quote: first ~4 words get display treatment
  const words = quote.split(' ')
  const leadWords = words.slice(0, 4).join(' ')
  const restWords = words.slice(4).join(' ')

  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-border bg-background p-7 hover:border-accent/30 hover:shadow-md transition-all duration-200">
      {/* Quote mark */}
      <span className="text-4xl font-display text-accent/30 leading-none">&ldquo;</span>

      <blockquote className="text-base leading-relaxed text-text-primary flex-1">
        <span className="font-display italic text-text-primary">{leadWords} </span>
        {restWords}
      </blockquote>

      {/* Attribution */}
      <div className="border-t border-border pt-4 flex items-start justify-between gap-3">
        <div>
          <p className="font-medium text-text-primary text-sm">{name}</p>
          <p className="text-xs text-text-muted mt-0.5">
            {role} · {company}
          </p>
        </div>
        <span className="text-xs text-accent bg-accent-light px-2.5 py-1 rounded-full font-medium shrink-0">
          {companyType}
        </span>
      </div>
    </div>
  )
}

export function TestimonialPlaceholder() {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-dashed border-border bg-surface/50 p-7 items-center justify-center text-center">
      <p className="font-display italic text-text-muted text-base">
        Your testimonial could be here.
      </p>
      <p className="text-sm text-text-muted leading-relaxed">
        Happy clients are the best part of this work.
        <br />
        Let&apos;s make you one.
      </p>
      <a
        href="/start"
        className="text-sm font-medium text-accent hover:underline underline-offset-2"
      >
        Book a Discovery call →
      </a>
    </div>
  )
}
