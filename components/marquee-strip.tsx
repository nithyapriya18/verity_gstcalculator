'use client'

import { siteConfig } from '@/config'

export function MarqueeStrip() {
  const text = `Currently: ${siteConfig.currentlyBuilding} · Discovery slots open in April · Based in India, working globally ·`
  const repeated = `${text} ${text}`

  return (
    <div className="bg-surface border-b border-border overflow-hidden py-2">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-xs text-text-muted tracking-wide mx-8">{repeated}</span>
        <span className="text-xs text-text-muted tracking-wide mx-8" aria-hidden>
          {repeated}
        </span>
      </div>
    </div>
  )
}
