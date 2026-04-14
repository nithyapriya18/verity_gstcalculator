import type { Metadata } from 'next'
import { GstCalculatorApp } from '@/apps/gst-calculator/components/GstCalculatorApp'

export const metadata: Metadata = {
  title: 'GST Calculator',
  description: 'Forward & reverse GST calculator with an itemized bill generator.',
}

export default function GstCalculatorPage() {
  return <GstCalculatorApp />
}

