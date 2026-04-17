import type { HsnSacEntry } from '@/src/data/hsnSac'

function normalize(s: string) {
  return s.toLowerCase().trim()
}

export function searchHsn(entries: HsnSacEntry[], query: string, limit = 40): HsnSacEntry[] {
  const q = normalize(query)
  if (!q) return []
  const words = q.split(/\s+/).filter(Boolean)
  const scored: { e: HsnSacEntry; score: number }[] = []
  for (const e of entries) {
    const desc = e.description.toLowerCase()
    const tokens = e.tokens.map((t) => t.toLowerCase())
    let score = 0
    let allWordsMatched = true
    for (const w of words) {
      const codePart = w.replace(/\D/g, '')
      const inCode = codePart.length > 0 && e.code.includes(codePart)
      const inDesc = desc.includes(w)
      const inToken = tokens.some((t) => t.includes(w))
      if (!inCode && !inDesc && !inToken) {
        allWordsMatched = false
        break
      }
      if (inCode) score += 6
      if (inDesc) score += 4
      if (inToken) score += 5
    }
    if (!allWordsMatched) continue
    if (desc.startsWith(q)) score += 8
    if (tokens.some((t) => t.startsWith(q))) score += 9
    const qCode = q.replace(/\D/g, '')
    if (qCode.length > 0 && e.code.startsWith(qCode)) score += 7
    if (score > 0) scored.push({ e, score })
  }
  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((x) => x.e)
}
