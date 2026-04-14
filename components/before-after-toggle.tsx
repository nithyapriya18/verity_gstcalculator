'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const before = {
  label: 'Before',
  text: '"We export to Excel every Monday, clean it manually, and email it by noon. It takes 3 people 2 hours."',
}

const after = {
  label: 'After',
  text: '"One click. Done. It runs itself."',
}

export function BeforeAfterToggle() {
  const [showing, setShowing] = useState<'before' | 'after'>('before')
  const content = showing === 'before' ? before : after

  return (
    <div className="bg-background rounded-2xl p-6 shadow-sm border border-border flex flex-col gap-5">
      {/* Toggle */}
      <div className="flex gap-1 p-1 bg-surface rounded-full self-start">
        {(['before', 'after'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setShowing(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              showing === tab
                ? 'bg-accent text-white shadow-sm'
                : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative min-h-[100px] flex items-start">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={showing}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={`text-base leading-relaxed ${
              showing === 'before'
                ? 'text-text-muted'
                : 'text-text-primary font-medium'
            }`}
          >
            {content.text}
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {/* Sticky note aesthetic line */}
      <div className="h-px bg-border" />
      <p className="text-xs text-text-muted">
        {showing === 'before'
          ? 'A real conversation I had last month.'
          : 'Three weeks later.'}
      </p>
    </div>
  )
}
