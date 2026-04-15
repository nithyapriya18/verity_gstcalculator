import Link from 'next/link'
import { siteConfig } from '@/config'
import { Logo } from '@/components/logo'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="max-w-layout mx-auto px-6 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Logo + copyright */}
          <div className="flex items-center gap-3 text-sm text-text-muted">
            <Logo size={28} showName={false} />
            <span className="font-display font-semibold text-text-primary">{siteConfig.name}</span>
            <span>·</span>
            <span>© 2026</span>
          </div>

          {/* Center: tagline (mobile) */}
          <p className="md:hidden text-xs text-text-muted text-center">
            Available for new projects · Based in India · Working globally
          </p>
          <p className="hidden md:block text-xs text-text-muted">
            Available for new projects · Based in India · Working globally
          </p>

          {/* Right: links */}
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <Link href="/privacy" className="text-text-muted hover:text-accent transition-colors">
              Privacy
            </Link>
            <Link href="/support" className="text-text-muted hover:text-accent transition-colors">
              Support
            </Link>
            <a
              href={siteConfig.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent transition-colors"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-text-muted hover:text-accent transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
