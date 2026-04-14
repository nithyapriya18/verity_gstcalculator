'use client'

import { siteConfig } from '@/config'

export function AvailabilityPill() {
  const { available, bookedUntil } = siteConfig.availability

  if (available) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-800 text-xs font-medium uppercase tracking-widest">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        Available for new projects
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium uppercase tracking-widest">
      <span className="relative flex h-2 w-2">
        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
      </span>
      Booked until {bookedUntil}
    </span>
  )
}
