'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

interface StageCardProps {
  number: number
  title: string
  description: string
  Icon: LucideIcon
  delay?: number
}

export function StageCard({
  number,
  title,
  description,
  Icon,
  delay = 0,
}: StageCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group relative flex-1 bg-background rounded-2xl p-6 border border-border hover:border-accent/30 hover:shadow-md transition-all duration-200"
    >
      {/* Stage number */}
      <span className="text-xs font-medium text-text-muted uppercase tracking-widest mb-4 block">
        {String(number).padStart(2, '0')}
      </span>

      {/* Icon */}
      <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center mb-4 group-hover:bg-accent transition-colors duration-200">
        <Icon
          size={20}
          className="text-accent group-hover:text-white transition-colors duration-200"
        />
      </div>

      {/* Title */}
      <h3 className="font-display font-semibold text-text-primary text-lg mb-3 leading-snug">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-muted text-sm leading-relaxed">{description}</p>
    </motion.div>
  )
}
