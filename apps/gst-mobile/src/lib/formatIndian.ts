/** Groups integer part Indian-style: 12,34,567 */
function formatIndianIntegerDigits(intPart: string): string {
  const s = intPart.replace(/^0+(?=\d)/, '') || '0'
  if (s.length <= 3) return s
  const last3 = s.slice(-3)
  let rest = s.slice(0, -3)
  const parts: string[] = [last3]
  while (rest.length > 2) {
    parts.unshift(rest.slice(-2))
    rest = rest.slice(0, -2)
  }
  if (rest.length > 0) parts.unshift(rest)
  return parts.join(',')
}

/** Indian-style grouping: ₹12,34,567.89 (lakhs/crores). */
export function formatIndianCurrency(amount: number, fractionDigits = 2): string {
  if (!Number.isFinite(amount)) return fractionDigits > 0 ? '0.00' : '0'
  const negative = amount < 0
  const n = Math.abs(amount)
  const fixed = n.toFixed(fractionDigits)
  const [intPart, frac] = fixed.split('.')
  const grouped = formatIndianIntegerDigits(intPart)
  const num = frac !== undefined ? `${grouped}.${frac}` : grouped
  return negative ? `-${num}` : num
}

export function formatIndianRupee(amount: number, fractionDigits = 2): string {
  return `₹${formatIndianCurrency(amount, fractionDigits)}`
}
