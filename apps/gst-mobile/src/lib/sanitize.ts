export const MAX_AMOUNT = 1000000000
export const MAX_GST_RATE = 100

export function sanitizeNumberText(value: string) {
  return value.replace(/[^0-9.]/g, '')
}

export function toSafeNumber(value: string, max: number) {
  const n = Number(value || 0)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.min(n, max)
}

