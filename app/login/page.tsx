'use client'

import { FormEvent, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const params = useSearchParams()
  const nextPath = params.get('next') || '/gst-calculator'

  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        setError('Incorrect password. Please try again.')
        setLoading(false)
        return
      }

      router.push(nextPath)
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)] py-16 md:py-20">
      <div className="max-w-layout mx-auto px-6 md:px-8">
        <div className="max-w-md mx-auto rounded-3xl border border-border bg-surface p-7 md:p-8">
          <h1 className="font-display font-semibold text-3xl text-text-primary">Login required</h1>
          <p className="text-text-muted mt-3 leading-relaxed">
            Enter the access password to use the GST Calculator web app.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <div className="text-sm font-medium text-text-primary mb-2">Password</div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
                placeholder="Enter password"
                autoFocus
                required
              />
            </label>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking…' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

