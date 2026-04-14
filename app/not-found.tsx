import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background">
      <div className="text-center px-6">
        <p className="text-sm font-medium uppercase tracking-widest text-text-muted mb-4">
          404
        </p>
        <h1 className="font-display font-semibold text-4xl text-text-primary mb-4">
          That page doesn&apos;t exist.
        </h1>
        <p className="text-text-muted mb-8">
          It may have moved, or you may have followed an old link.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
