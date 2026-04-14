'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface AnimateInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  from?: 'bottom' | 'left' | 'right' | 'none'
}

export function AnimateIn({
  children,
  className,
  delay = 0,
  from = 'bottom',
}: AnimateInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const initial = {
    opacity: 0,
    y: from === 'bottom' ? 24 : 0,
    x: from === 'left' ? -24 : from === 'right' ? 24 : 0,
  }

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={isInView ? { opacity: 1, y: 0, x: 0 } : initial}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
