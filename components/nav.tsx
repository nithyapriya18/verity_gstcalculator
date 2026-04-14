'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { siteConfig } from '@/config'
import { MarqueeStrip } from '@/components/marquee-strip'
import { Logo } from '@/components/logo'

const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/writing', label: 'Writing' },
]

export function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      {siteConfig.showMarqueeStrip && <MarqueeStrip />}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-sm border-b border-border shadow-sm'
            : 'bg-background'
        }`}
      >
        <div className="max-w-layout mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Logo size={34} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors duration-200 hover:text-text-primary ${
                  pathname.startsWith(link.href)
                    ? 'text-text-primary font-medium'
                    : 'text-text-muted'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/start"
              className="text-sm px-4 py-2 rounded-full bg-accent text-white font-medium hover:bg-accent/90 transition-all duration-200 hover:shadow-md"
            >
              Start here
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 -mr-2 text-text-muted hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 top-16 bg-text-primary/20 backdrop-blur-sm z-30"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="fixed top-16 right-0 bottom-0 w-72 bg-background border-l border-border z-40 flex flex-col p-8 gap-2"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`py-3 text-lg border-b border-border transition-colors hover:text-accent ${
                      pathname.startsWith(link.href)
                        ? 'text-text-primary font-medium'
                        : 'text-text-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="mt-4">
                  <Link
                    href="/start"
                    className="block text-center py-3 px-6 rounded-full bg-accent text-white font-medium text-base hover:bg-accent/90 transition-all"
                  >
                    Start here
                  </Link>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
