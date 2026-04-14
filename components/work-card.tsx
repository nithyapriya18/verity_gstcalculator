'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export interface WorkCardProps {
  slug: string
  title: string
  problem: string
  outcome: string
  metric: string
  tags: string[]
  beforeText: string
  afterText: string
}

export function WorkCard({
  slug,
  title,
  problem,
  outcome,
  metric,
  tags,
  beforeText,
  afterText,
}: WorkCardProps) {
  const [showing, setShowing] = useState<'before' | 'after'>('before')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="group flex flex-col rounded-2xl overflow-hidden border border-border bg-background hover:border-accent/30 hover:shadow-md transition-all duration-300"
    >
      {/* Cover area */}
      <div className="relative h-44 bg-gradient-to-br from-accent-light via-surface to-border flex items-center justify-center overflow-hidden">
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-30">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-accent/20"
              style={{
                width: `${(i + 1) * 80}px`,
                height: `${(i + 1) * 80}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        {/* Metric */}
        <span className="relative z-10 text-2xl font-display font-semibold text-accent">
          {metric}
        </span>

        {/* Toggle pill */}
        <div className="absolute top-3 right-3 flex gap-0.5 p-0.5 bg-white/70 backdrop-blur-sm rounded-full">
          {(['before', 'after'] as const).map((tab) => (
            <button
              key={tab}
              onClick={(e) => {
                e.preventDefault()
                setShowing(tab)
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                showing === tab
                  ? 'bg-accent text-white'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Problem tag */}
        <span className="text-xs font-medium uppercase tracking-widest text-accent bg-accent-light px-2.5 py-1 rounded-full self-start">
          {problem}
        </span>

        <h3 className="font-display font-semibold text-text-primary text-lg leading-snug">
          {title}
        </h3>

        {/* Before/after toggle content */}
        <div className="min-h-[56px]">
          <AnimatePresence mode="wait">
            <motion.p
              key={showing}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-sm text-text-muted leading-relaxed"
            >
              {showing === 'before' ? beforeText : afterText}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-text-muted bg-surface px-2.5 py-1 rounded-full border border-border"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Read more */}
        <Link
          href={`/work/${slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-2.5 transition-all duration-200 mt-2"
        >
          Read the story
          <ArrowRight size={14} />
        </Link>
      </div>
    </motion.div>
  )
}
