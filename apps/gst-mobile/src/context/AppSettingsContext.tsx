import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Localization from 'expo-localization'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'gst_mobile_settings_v1'

export type LanguageCode = 'en' | 'hi'
export type FilingFrequency = 'monthly' | 'quarterly'

export type AppSettings = {
  supplierState: string
  customerState: string
  defaultGstRate: string
  language: LanguageCode
  autoSaveHistory: boolean
  filingFrequency: FilingFrequency
}

const defaultSettings: AppSettings = {
  supplierState: '27',
  customerState: '27',
  defaultGstRate: '18',
  language: 'en',
  autoSaveHistory: true,
  filingFrequency: 'monthly',
}

function detectLanguage(): LanguageCode {
  const locales = Localization.getLocales?.() ?? []
  const tag = (locales[0]?.languageTag ?? 'en').toLowerCase()
  return tag.startsWith('hi') ? 'hi' : 'en'
}

type AppSettingsContextValue = AppSettings & {
  setSupplierState: (v: string) => void
  setCustomerState: (v: string) => void
  setDefaultGstRate: (v: string) => void
  setLanguage: (v: LanguageCode) => void
  setAutoSaveHistory: (v: boolean) => void
  setFilingFrequency: (v: FilingFrequency) => void
  /** When user picks HSN row, calculator applies this once. */
  pendingCalculatorGstRate: string | null
  setPendingCalculatorGstRate: (v: string | null) => void
  hydrated: boolean
}

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null)

export function AppSettingsProvider(props: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings)
  const [hydrated, setHydrated] = useState(false)
  const [pendingCalculatorGstRate, setPendingCalculatorGstRate] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<AppSettings>
          setSettings({
            ...defaultSettings,
            ...parsed,
            supplierState: parsed.supplierState ?? defaultSettings.supplierState,
            customerState: parsed.customerState ?? defaultSettings.customerState,
            defaultGstRate: parsed.defaultGstRate ?? defaultSettings.defaultGstRate,
            language: parsed.language === 'hi' ? 'hi' : 'en',
            autoSaveHistory: typeof parsed.autoSaveHistory === 'boolean' ? parsed.autoSaveHistory : defaultSettings.autoSaveHistory,
            filingFrequency: parsed.filingFrequency === 'quarterly' ? 'quarterly' : 'monthly',
          })
        } else {
          setSettings((s) => ({ ...s, language: detectLanguage() }))
        }
      } catch {
        setSettings((s) => ({ ...s, language: detectLanguage() }))
      } finally {
        if (!cancelled) setHydrated(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const persist = useCallback((next: AppSettings) => {
    setSettings(next)
    void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const setSupplierState = useCallback((v: string) => persist({ ...settings, supplierState: v }), [persist, settings])
  const setCustomerState = useCallback((v: string) => persist({ ...settings, customerState: v }), [persist, settings])
  const setDefaultGstRate = useCallback((v: string) => persist({ ...settings, defaultGstRate: v }), [persist, settings])
  const setLanguage = useCallback((v: LanguageCode) => persist({ ...settings, language: v }), [persist, settings])
  const setAutoSaveHistory = useCallback((v: boolean) => persist({ ...settings, autoSaveHistory: v }), [persist, settings])
  const setFilingFrequency = useCallback((v: FilingFrequency) => persist({ ...settings, filingFrequency: v }), [persist, settings])

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      ...settings,
      setSupplierState,
      setCustomerState,
      setDefaultGstRate,
      setLanguage,
      setAutoSaveHistory,
      setFilingFrequency,
      pendingCalculatorGstRate,
      setPendingCalculatorGstRate,
      hydrated,
    }),
    [
      settings,
      setSupplierState,
      setCustomerState,
      setDefaultGstRate,
      setLanguage,
      setAutoSaveHistory,
      setFilingFrequency,
      pendingCalculatorGstRate,
      hydrated,
    ],
  )

  return <AppSettingsContext.Provider value={value}>{props.children}</AppSettingsContext.Provider>
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext)
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider')
  return ctx
}
