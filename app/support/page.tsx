import type { Metadata } from 'next'
import Link from 'next/link'
import { Mail, MessageCircle } from 'lucide-react'
import { AnimateIn } from '@/components/animate-in'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Support',
  description: `Get help with ${siteConfig.name} and the Verity GST Calculator.`,
}

export default function SupportPage() {
  return (
    <div>
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-accent mb-3">Help</p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-text-primary leading-tight mb-6">
                Support
              </h1>
              <p className="text-text-muted text-lg leading-relaxed mb-10">
                We&apos;re here if something breaks, if you have a question about the GST Calculator app, or if you want
                to talk about a project.
              </p>

              <div className="space-y-6 mb-12">
                <a
                  href={`mailto:${siteConfig.email}?subject=Verity%20GST%20Calculator%20%E2%80%94%20Support`}
                  className="flex items-start gap-4 rounded-2xl border border-border/60 bg-surface/80 p-6 hover:border-accent/40 transition-colors group"
                >
                  <div className="rounded-xl bg-accent/10 p-3 text-accent group-hover:bg-accent/15 transition-colors">
                    <Mail size={22} />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-lg text-text-primary mb-1">Email</h2>
                    <p className="text-accent font-medium">{siteConfig.email}</p>
                    <p className="text-text-muted text-sm mt-2">
                      Best for bug reports, feature ideas, and general questions. We typically reply within a few
                      business days.
                    </p>
                  </div>
                </a>

                <div className="flex items-start gap-4 rounded-2xl border border-border/60 bg-surface/80 p-6">
                  <div className="rounded-xl bg-accent/10 p-3 text-accent">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h2 className="font-display font-semibold text-lg text-text-primary mb-1">GST Calculator (mobile)</h2>
                    <p className="text-text-muted text-sm leading-relaxed">
                      For App Store or Play Store reviews and listing questions, mention your device model and app
                      version in your email. For calculation questions, remember the app is a helper tool — confirm
                      important figures with your accountant or tax advisor.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-surface/60 border border-border/40 p-6 md:p-8">
                <h2 className="font-display font-semibold text-lg text-text-primary mb-4">Quick links</h2>
                <ul className="space-y-3 text-text-muted">
                  <li>
                    <Link href="/privacy" className="text-accent hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/" className="text-accent hover:underline">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/gst-calculator" className="text-accent hover:underline">
                      GST Calculator (web)
                    </Link>
                  </li>
                </ul>
              </div>

              <p className="text-sm text-text-muted mt-10">
                Operated by {siteConfig.name}. This page is hosted at{' '}
                <span className="text-text-primary/80">verity-studios.vercel.app/support</span>.
              </p>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
