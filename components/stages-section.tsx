'use client'

import { Search, Layers, Rocket, RefreshCw } from 'lucide-react'
import { StageCard } from '@/components/stage-card'

const stages = [
  {
    number: 1,
    title: 'Discovery & Scoping',
    Icon: Search,
    description:
      'We spend 90 minutes on your problem. I ask questions. You talk. I take notes and come back with a one-page plan: what to build, how long it takes, what it costs. You decide if you want to go further.',
  },
  {
    number: 2,
    title: 'Working Prototype',
    Icon: Layers,
    description:
      'A real, clickable version of the core idea — built in 1–2 weeks. Something you can show your team or test with real users before committing to the full build.',
  },
  {
    number: 3,
    title: 'Full Build & Launch',
    Icon: Rocket,
    description:
      "Complete product, deployed, handed over with a walkthrough. Ready to use from day one. Most builds are done in 2–4 weeks.",
  },
  {
    number: 4,
    title: 'Ongoing Support',
    Icon: RefreshCw,
    description:
      "Once you're live, I offer a monthly support option. Bug fixes, small changes, hosting — handled. You focus on your business.",
  },
]

export function StagesSection() {
  return (
    <>
      {/* Desktop: horizontal */}
      <div className="hidden md:flex gap-0 items-stretch relative">
        <div
          className="absolute top-[42px] left-0 right-0 h-px"
          style={{
            backgroundImage:
              'repeating-linear-gradient(90deg, #E5E2D9 0, #E5E2D9 6px, transparent 6px, transparent 16px)',
          }}
        />
        {stages.map((stage, i) => (
          <StageCard key={stage.number} {...stage} delay={i * 0.1} />
        ))}
      </div>

      {/* Mobile: vertical */}
      <div className="md:hidden flex flex-col gap-4 relative">
        <div
          className="absolute left-5 top-10 bottom-10 w-px"
          style={{
            backgroundImage:
              'repeating-linear-gradient(180deg, #E5E2D9 0, #E5E2D9 6px, transparent 6px, transparent 16px)',
          }}
        />
        {stages.map((stage, i) => (
          <StageCard key={stage.number} {...stage} delay={i * 0.1} />
        ))}
      </div>
    </>
  )
}
