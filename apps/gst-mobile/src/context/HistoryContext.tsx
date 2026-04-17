import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const HISTORY_KEY = 'gst_mobile_history_v3'

export type HistoryEntry = {
  id: string
  createdAt: number
  kind: 'calc' | 'invoice'
  title: string
  body: string
  /** Primary input amount (calc: typed amount; invoice: total taxable). */
  inputAmount?: number
  gstRateLabel?: string
  grandTotal?: number
}

type HistoryContextValue = {
  entries: HistoryEntry[]
  hydrated: boolean
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => void
  clear: () => Promise<void>
}

const HistoryContext = createContext<HistoryContextValue | null>(null)

export function HistoryProvider(props: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(HISTORY_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as HistoryEntry[]
          if (Array.isArray(parsed)) setEntries(parsed)
        }
      } catch {
        /* ignore */
      } finally {
        if (!cancelled) setHydrated(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback(async (next: HistoryEntry[]) => {
    setEntries(next)
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  }, [])

  const addEntry = useCallback((e: Omit<HistoryEntry, 'id' | 'createdAt'>) => {
    const full: HistoryEntry = {
      ...e,
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: Date.now(),
    }
    setEntries((prev) => {
      const next = [full, ...prev].slice(0, 200)
      void AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const clear = useCallback(async () => {
    await persist([])
  }, [persist])

  const value = useMemo(() => ({ entries, hydrated, addEntry, clear }), [entries, hydrated, addEntry, clear])

  return <HistoryContext.Provider value={value}>{props.children}</HistoryContext.Provider>
}

export function useHistory() {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider')
  return ctx
}
