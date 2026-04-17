import type { HistoryEntry } from '@/src/context/HistoryContext'
import { formatIndianRupee } from '@/src/lib/formatIndian'

export type HistoryRowDisplay = {
  dateLabel: string
  amountLabel: string
  gstRateLabel: string
  grandTotalLabel: string
  kindBadge: string
}

function parseFromBody(body: string): { rate?: string; total?: string; input?: string } {
  const rateRaw =
    body.match(/(?:GST\s*rate|GST Rate|GST दर)\s*:\s*([\d.]+)\s*%/im)?.[1] ?? body.match(/GST:\s*([\d.]+)\s*%/im)?.[1]
  const rate = rateRaw ? `${rateRaw}%` : undefined

  const total =
    body.match(/(?:Grand total|Grand Total|कुल योग)\s*:\s*([^\n]+)/im)?.[1]?.trim() ??
    body.match(/Grand Total:\s*([^\n]+)/im)?.[1]?.trim()

  const input =
    body.match(/(?:Taxable|Base|आधार|कर योग्य)\s*:\s*([^\n]+)/im)?.[1]?.trim() ??
    body.match(/Taxable:\s*([^\n]+)/im)?.[1]?.trim()

  return { rate, total, input }
}

export function getHistoryRowDisplay(
  entry: HistoryEntry,
  labels: { calc: string; invoice: string },
): HistoryRowDisplay {
  const dateLabel = new Date(entry.createdAt).toLocaleString()
  const kindBadge = entry.kind === 'invoice' ? labels.invoice : labels.calc

  if (entry.gstRateLabel != null && entry.grandTotal != null) {
    return {
      dateLabel,
      amountLabel: entry.inputAmount != null ? formatIndianRupee(entry.inputAmount) : '—',
      gstRateLabel: entry.gstRateLabel,
      grandTotalLabel: formatIndianRupee(entry.grandTotal),
      kindBadge,
    }
  }

  const parsed = parseFromBody(entry.body)
  return {
    dateLabel,
    amountLabel: parsed.input ?? '—',
    gstRateLabel: parsed.rate ?? '—',
    grandTotalLabel: parsed.total ?? entry.title.split('·')[0]?.trim() ?? '—',
    kindBadge,
  }
}
