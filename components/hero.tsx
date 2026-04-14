'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { AvailabilityPill } from '@/components/availability-pill'
import { HeroAnimation } from '@/components/hero-animation'
import { siteConfig } from '@/config'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] },
})

export function Hero() {
  return (
    <section className="min-h-[calc(100vh-4rem)] flex items-center bg-background">
      <div className="max-w-layout mx-auto px-6 md:px-8 py-16 md:py-20 w-full">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ── Left: text ── */}
          <div>
            <motion.div {...fadeUp(0)} className="mb-8">
              <AvailabilityPill />
            </motion.div>

            <motion.h1
              {...fadeUp(0.1)}
              className="text-[2.5rem] md:text-[3.5rem] lg:text-[4rem] leading-[1.1] font-display font-semibold text-text-primary mb-6"
            >
              I take your idea{' '}
              <br className="hidden sm:block" />
              <em style={{ fontStyle: 'italic' }} className="text-accent">
                from vision to reality.
              </em>
            </motion.h1>

            <motion.p
              {...fadeUp(0.2)}
              className="text-lg md:text-xl text-text-muted leading-relaxed max-w-[42ch] mb-10"
            >
              Discovery, design, and delivery — all in one.
              <br />
              No large team. No months of back-and-forth.
            </motion.p>

            <motion.div
              {...fadeUp(0.3)}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
            >
              <a
                href={siteConfig.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-accent text-white text-base font-medium hover:bg-accent/90 hover:shadow-lg transition-all duration-200 group"
              >
                Book a free Discovery call
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </a>

              <a
                href="#how-it-works"
                className="text-sm text-text-muted hover:text-text-primary transition-colors"
              >
                See how it works ↓
              </a>
            </motion.div>
          </div>

          {/* ── Right: animated network ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hidden md:flex items-center justify-center h-72 lg:h-96"
          >
            <HeroAnimation />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
