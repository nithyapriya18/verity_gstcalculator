import type { Metadata } from 'next'
import Link from 'next/link'
import { AnimateIn } from '@/components/animate-in'
import { siteConfig } from '@/config'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} handles data for the GST Calculator and this website.`,
}

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-layout mx-auto px-6 md:px-8">
          <AnimateIn>
            <div className="max-w-3xl">
              <p className="text-sm font-medium text-accent mb-3">Legal</p>
              <h1 className="font-display font-semibold text-4xl md:text-5xl text-text-primary leading-tight mb-6">
                Privacy Policy
              </h1>
              <p className="text-text-muted text-sm mb-10">
                Last updated: April 15, 2026 · Operated by {siteConfig.name}
              </p>

              <div className="prose prose-invert max-w-none space-y-8 text-text-primary/90 leading-relaxed">
                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Introduction</h2>
                  <p className="text-text-muted">
                    This policy describes how we collect, use, and protect information when you use our website at{' '}
                    <strong className="text-text-primary">verity-studios.vercel.app</strong> and our mobile applications
                    (including the Verity GST Calculator). We aim to collect only what is needed to provide the service
                    and to improve it responsibly.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Information we collect</h2>
                  <ul className="list-disc pl-5 space-y-2 text-text-muted">
                    <li>
                      <strong className="text-text-primary">Website:</strong> Standard server and analytics data may
                      include IP address, browser type, pages visited, and timestamps, as processed by our hosting
                      provider (Vercel) and any analytics you enable on the site.
                    </li>
                    <li>
                      <strong className="text-text-primary">GST Calculator app (mobile):</strong> The app is designed to
                      work primarily on your device. Calculations and optional saved history may be stored locally on
                      your phone using device storage (for example, AsyncStorage). We do not require an account for core
                      calculator features in the current version.
                    </li>
                    <li>
                      <strong className="text-text-primary">Communications:</strong> If you email us, we receive your
                      email address and the contents of your message.
                    </li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">How we use information</h2>
                  <ul className="list-disc pl-5 space-y-2 text-text-muted">
                    <li>To operate, maintain, and improve our website and apps.</li>
                    <li>To respond to support requests.</li>
                    <li>To comply with legal obligations where applicable.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Sharing and third parties</h2>
                  <p className="text-text-muted">
                    We do not sell your personal information. We may use service providers (such as hosting, analytics,
                    or app store distribution) who process data on our behalf under appropriate agreements. Those
                    providers are subject to their own privacy policies (for example, Apple App Store, Google Play,
                    Vercel).
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Data retention</h2>
                  <p className="text-text-muted">
                    Local data stored only on your device remains until you clear app data or uninstall the app. Email
                    correspondence may be retained as needed to provide support and for ordinary business records.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Your choices</h2>
                  <ul className="list-disc pl-5 space-y-2 text-text-muted">
                    <li>You may disable cookies or analytics in your browser where applicable.</li>
                    <li>You may clear app storage or uninstall the mobile app to remove locally stored data.</li>
                    <li>You may contact us to ask questions about this policy (see Support).</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Children</h2>
                  <p className="text-text-muted">
                    Our services are not directed at children under 13, and we do not knowingly collect personal
                    information from children.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Changes</h2>
                  <p className="text-text-muted">
                    We may update this policy from time to time. The &quot;Last updated&quot; date at the top will change
                    when we do. Continued use after changes constitutes acceptance of the updated policy where permitted
                    by law.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-text-primary mb-3">Contact</h2>
                  <p className="text-text-muted">
                    Questions about this policy:{' '}
                    <a href={`mailto:${siteConfig.email}`} className="text-accent hover:underline">
                      {siteConfig.email}
                    </a>{' '}
                    ·{' '}
                    <Link href="/support" className="text-accent hover:underline">
                      Support page
                    </Link>
                  </p>
                </section>

                <section className="pt-4 border-t border-border/60">
                  <p className="text-sm text-text-muted">
                    <strong className="text-text-primary">Disclaimer:</strong> The GST Calculator is a utility tool for
                    estimation and record-keeping. It does not constitute tax, legal, or accounting advice. Verify
                    results with a qualified professional before relying on them for filings or business decisions.
                  </p>
                </section>
              </div>
            </div>
          </AnimateIn>
        </div>
      </section>
    </div>
  )
}
