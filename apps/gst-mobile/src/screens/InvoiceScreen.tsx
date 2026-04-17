import { useMemo, useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import { computeInvoiceItem, computeInvoiceTotals, getSupplyType } from '@/src/lib/gst'
import { getStateName } from '@/src/lib/states'
import { MAX_AMOUNT, MAX_GST_RATE, sanitizeNumberText, toSafeNumber } from '@/src/lib/sanitize'
import { formatIndianRupee } from '@/src/lib/formatIndian'
import { Button } from '@/src/components/ui/Button'
import { ChipGroup } from '@/src/components/ui/ChipGroup'
import { TextField } from '@/src/components/ui/TextField'
import { appStyles } from '@/src/theme/styles'
import { colors, spacing, typography } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'
import { useHistory } from '@/src/context/HistoryContext'

type Supply = 'intra' | 'inter'

type ItemRow = {
  description: string
  quantity: string
  unitRate: string
  gstRate: string
}

const RATE_CHIPS = ['5', '12', '18', '28']

function summarizeGstRates(items: ItemRow[], mixedLabel: string): string {
  const set = new Set(items.map((i) => toSafeNumber(sanitizeNumberText(i.gstRate), MAX_GST_RATE)))
  if (set.size === 1) return `${[...set][0]}%`
  return mixedLabel
}

function nextInvoiceNo(current: string) {
  const m = current.match(/^(.*?)(\d+)$/)
  if (!m) return `${current}-2`
  const pad = m[2].length
  const next = String(Number(m[2]) + 1)
  const padded = next.padStart(pad, '0')
  return `${m[1]}${padded}`
}

export function InvoiceScreen(props: {
  onExportPdf: (args: { title: string; html: string }) => Promise<void>
}) {
  const { supplierState, customerState, defaultGstRate, language } = useAppSettings()
  const { addEntry } = useHistory()
  const lang = language

  const [invoiceNo, setInvoiceNo] = useState('INV-0001')
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [sellerName, setSellerName] = useState('')
  const [sellerGstin, setSellerGstin] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [notes, setNotes] = useState('')

  const supplyType: Supply = getSupplyType(supplierState, customerState)

  const [items, setItems] = useState<ItemRow[]>(() => [
    { description: `${t(language, 'itemNumber')} 1`, quantity: '1', unitRate: '0', gstRate: defaultGstRate },
  ])

  const computedItems = useMemo(
    () =>
      items.map((it) =>
        computeInvoiceItem({
          item: {
            description: it.description,
            quantity: toSafeNumber(sanitizeNumberText(it.quantity), MAX_AMOUNT),
            unitRate: toSafeNumber(sanitizeNumberText(it.unitRate), MAX_AMOUNT),
            gstRatePercent: toSafeNumber(sanitizeNumberText(it.gstRate), MAX_GST_RATE),
          },
          supplyType,
        }),
      ),
    [items, supplyType],
  )

  const totals = useMemo(() => computeInvoiceTotals(computedItems), [computedItems])

  const contextLine = `${getStateName(supplierState)} → ${getStateName(customerState)} · ${
    supplyType === 'intra' ? t(lang, 'intraLabel') : t(lang, 'interLabel')
  }`

  const plainText = useMemo(() => {
    const lines: string[] = []
    lines.push(`INVOICE`)
    lines.push(`Invoice No: ${invoiceNo}`)
    lines.push(`Invoice Date: ${invoiceDate}`)
    lines.push(`Seller: ${sellerName}`)
    if (sellerGstin.trim()) lines.push(`Seller GSTIN: ${sellerGstin}`)
    lines.push(`Seller state: ${getStateName(supplierState)}`)
    lines.push(`Buyer: ${buyerName}`)
    lines.push(`Buyer state: ${getStateName(customerState)}`)
    lines.push(`Route: ${contextLine}`)
    if (notes.trim()) lines.push(`Notes: ${notes}`)
    lines.push('')
    lines.push('Items:')
    computedItems.forEach((it, i) => {
      const rate = items[i]?.gstRate ?? ''
      lines.push(
        `- ${it.description || 'Item'} | GST ${rate}% | Qty ${it.quantity} | Rate ${formatIndianRupee(it.unitRate)} | Taxable ${formatIndianRupee(
          it.taxableValue,
        )} | GST ${formatIndianRupee(it.totalGst)} | Total ${formatIndianRupee(it.total)}`,
      )
    })
    lines.push('')
    lines.push(`Taxable: ${formatIndianRupee(totals.taxableValue)}`)
    if (supplyType === 'intra') {
      lines.push(`CGST: ${formatIndianRupee(totals.cgst)} · SGST: ${formatIndianRupee(totals.sgst)}`)
    } else {
      lines.push(`IGST: ${formatIndianRupee(totals.igst)}`)
    }
    lines.push(`Total GST: ${formatIndianRupee(totals.totalGst)}`)
    lines.push(`Grand Total: ${formatIndianRupee(totals.total)}`)
    return lines.join('\n')
  }, [buyerName, computedItems, contextLine, invoiceDate, invoiceNo, items, lang, notes, sellerGstin, sellerName, supplyType, totals])

  const html = useMemo(() => {
    const rows = computedItems
      .map((it, idx) => {
        const rate = items[idx]?.gstRate ?? ''
        return `
        <tr>
          <td style="padding:8px;border-bottom:1px solid #E6D9C8;">${escapeHtml(it.description || 'Item')}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #E6D9C8;">${rate}%</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #E6D9C8;">${it.quantity}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #E6D9C8;">${formatIndianRupee(it.unitRate)}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #E6D9C8;">${formatIndianRupee(it.taxableValue)}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #E6D9C8;">${formatIndianRupee(it.totalGst)}</td>
          <td style="padding:8px;text-align:right;border-bottom:1px solid #E6D9C8;">${formatIndianRupee(it.total)}</td>
        </tr>`
      })
      .join('')

    const taxLines =
      supplyType === 'intra'
        ? `<div><b>CGST</b>: ${formatIndianRupee(totals.cgst)} &nbsp; <b>SGST</b>: ${formatIndianRupee(totals.sgst)}</div>`
        : `<div><b>IGST</b>: ${formatIndianRupee(totals.igst)}</div>`

    const notesBlock = notes.trim()
      ? `<div style="margin-top:12px;padding:12px;border:1px solid #E6D9C8;border-radius:12px;background:#FBF7F0;"><b>Notes</b><div style="margin-top:6px;">${escapeHtml(
          notes,
        )}</div></div>`
      : ''

    return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Invoice ${escapeHtml(invoiceNo)}</title>
  </head>
  <body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial; color:#1F1B16; background:#FBF7F0; padding:24px;">
    <div style="max-width:820px; margin:0 auto; background:#FFFFFF; border:1px solid #E6D9C8; border-radius:18px; padding:22px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:16px;">
        <div>
          <div style="font-size:22px; font-weight:800;">Invoice</div>
          <div style="color:#6B5E52; margin-top:4px;">${escapeHtml(contextLine)}</div>
        </div>
        <div style="text-align:right;">
          <div><b>${escapeHtml(invoiceNo)}</b></div>
          <div style="color:#6B5E52;">${escapeHtml(invoiceDate)}</div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; gap:18px; margin-top:18px;">
        <div style="flex:1;">
          <div style="font-size:12px; color:#6B5E52; font-weight:700; text-transform:uppercase;">Seller</div>
          <div style="margin-top:4px; font-weight:700;">${escapeHtml(sellerName)}</div>
          <div style="margin-top:6px; color:#6B5E52; font-size:12px;">${escapeHtml(getStateName(supplierState))}</div>
          ${sellerGstin.trim() ? `<div style="margin-top:6px; font-size:12px;">GSTIN: ${escapeHtml(sellerGstin)}</div>` : ''}
        </div>
        <div style="flex:1;">
          <div style="font-size:12px; color:#6B5E52; font-weight:700; text-transform:uppercase;">Buyer</div>
          <div style="margin-top:4px; font-weight:700;">${escapeHtml(buyerName)}</div>
          <div style="margin-top:6px; color:#6B5E52; font-size:12px;">${escapeHtml(getStateName(customerState))}</div>
        </div>
      </div>

      <table style="width:100%; border-collapse:collapse; margin-top:18px; font-size:13px;">
        <thead>
          <tr style="background:#F3EBDD;">
            <th style="text-align:left; padding:10px; border-bottom:1px solid #E6D9C8;">Description</th>
            <th style="text-align:right; padding:10px; border-bottom:1px solid #E6D9C8;">GST%</th>
            <th style="text-align:right; padding:10px; border-bottom:1px solid #E6D9C8;">Qty</th>
            <th style="text-align:right; padding:10px; border-bottom:1px solid #E6D9C8;">Rate</th>
            <th style="text-align:right; padding:10px; border-bottom:1px solid #E6D9C8;">Taxable</th>
            <th style="text-align:right; padding:10px; border-bottom:1px solid #E6D9C8;">GST</th>
            <th style="text-align:right; padding:10px; border-bottom:1px solid #E6D9C8;">Total</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>

      ${notesBlock}

      <div style="margin-top:18px; display:flex; justify-content:flex-end;">
        <div style="min-width:280px; background:#F3EBDD; border:1px solid #E6D9C8; border-radius:14px; padding:14px;">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;"><span>Taxable</span><b>${formatIndianRupee(totals.taxableValue)}</b></div>
          ${taxLines}
          <div style="display:flex; justify-content:space-between; margin-top:8px;"><span>Total GST</span><b>${formatIndianRupee(totals.totalGst)}</b></div>
          <div style="display:flex; justify-content:space-between; margin-top:8px; font-size:16px;"><span>Grand Total</span><b>${formatIndianRupee(totals.total)}</b></div>
        </div>
      </div>

      <div style="color:#6B5E52; font-size:11px; margin-top:14px;">
        Generated by Verity GST Mobile. Utility summary — not tax advice.
      </div>
    </div>
  </body>
</html>`
  }, [buyerName, computedItems, contextLine, invoiceDate, invoiceNo, items, notes, sellerGstin, sellerName, supplyType, totals])

  function updateItem(idx: number, patch: Partial<ItemRow>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)))
  }

  function removeItem(idx: number) {
    setItems((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((_, i) => i !== idx)
    })
  }

  function confirmRemove(idx: number) {
    if (items.length <= 1) return
    Alert.alert(t(lang, 'removeItemTitle'), t(lang, 'removeItemMessage'), [
      { text: t(lang, 'cancel'), style: 'cancel' },
      { text: t(lang, 'remove'), style: 'destructive', onPress: () => removeItem(idx) },
    ])
  }

  async function shareAndSave() {
    const { Share } = await import('react-native')
    await Share.share({ message: plainText })
    const gstLabel = summarizeGstRates(items, t(lang, 'mixedGstRates'))
    addEntry({
      kind: 'invoice',
      title: `${invoiceNo} · ${formatIndianRupee(totals.total)}`,
      body: plainText,
      inputAmount: totals.taxableValue,
      gstRateLabel: gstLabel,
      grandTotal: totals.total,
    })
    setInvoiceNo((n) => nextInvoiceNo(n))
  }

  async function exportPdfAndSave() {
    await props.onExportPdf({ title: `Invoice-${invoiceNo}`, html })
    const gstLabel = summarizeGstRates(items, t(lang, 'mixedGstRates'))
    addEntry({
      kind: 'invoice',
      title: `${invoiceNo} · ${formatIndianRupee(totals.total)} (PDF)`,
      body: plainText,
      inputAmount: totals.taxableValue,
      gstRateLabel: gstLabel,
      grandTotal: totals.total,
    })
    setInvoiceNo((n) => nextInvoiceNo(n))
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <View style={appStyles.card}>
        <Text style={appStyles.sectionTitle}>{t(lang, 'invoiceTitle')}</Text>
        <Text style={styles.context}>{contextLine}</Text>
        <Text style={appStyles.helper}>
          {t(lang, 'sellerState')}: {getStateName(supplierState)} · {t(lang, 'buyerState')}: {getStateName(customerState)} ({t(lang, 'stateSettingsHint')})
        </Text>

        <View style={styles.threeCol}>
          <View style={styles.col}>
            <TextField label={t(lang, 'invoiceNo')} value={invoiceNo} onChange={setInvoiceNo} placeholder="INV-0001" />
          </View>
          <View style={styles.col}>
            <TextField label={t(lang, 'invoiceDateLabel')} value={invoiceDate} onChange={setInvoiceDate} placeholder="2026-04-15" />
          </View>
        </View>
        <TextField label={t(lang, 'sellerName')} value={sellerName} onChange={setSellerName} placeholder={t(lang, 'placeholderBusiness')} />
        <TextField label={t(lang, 'sellerGstin')} value={sellerGstin} onChange={setSellerGstin} placeholder={t(lang, 'optionalShort')} />
        <TextField label={t(lang, 'buyerName')} value={buyerName} onChange={setBuyerName} placeholder={t(lang, 'placeholderCustomer')} />

        <View style={appStyles.divider} />

        <Text style={appStyles.sectionTitle}>{t(lang, 'invoiceLineItems')}</Text>
        <Text style={styles.hint}>
          {t(lang, 'lineGst')} · default {defaultGstRate}%
        </Text>

        {items.map((it, idx) => {
          const computed = computedItems[idx]
          return (
            <View key={idx} style={styles.itemCard}>
              <Text style={styles.itemTitle}>
                {t(lang, 'itemNumber')} {idx + 1}
              </Text>
              <TextField
                label={t(lang, 'description')}
                value={it.description}
                onChange={(v) => updateItem(idx, { description: v })}
                placeholder={t(lang, 'placeholderProduct')}
              />
              <ChipGroup
                value={RATE_CHIPS.includes(it.gstRate) ? it.gstRate : '__custom__'}
                onChange={(v) => {
                  if (v === '__custom__') updateItem(idx, { gstRate: '3' })
                  else updateItem(idx, { gstRate: v })
                }}
                options={[
                  ...RATE_CHIPS.map((r) => ({ value: r, label: `${r}%` })),
                  { value: '__custom__', label: '+' },
                ]}
              />
              {!RATE_CHIPS.includes(it.gstRate) ? (
                <TextField label={t(lang, 'gstRate')} value={it.gstRate} onChange={(v) => updateItem(idx, { gstRate: sanitizeNumberText(v) })} keyboardType="numeric" placeholder="18" />
              ) : null}
              <View style={styles.itemRow}>
                <View style={{ flex: 1 }}>
                  <TextField
                    label={t(lang, 'qty')}
                    value={it.quantity}
                    onChange={(v) => updateItem(idx, { quantity: sanitizeNumberText(v) })}
                    keyboardType="numeric"
                    placeholder="1"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <TextField
                    label={t(lang, 'rate')}
                    value={it.unitRate}
                    onChange={(v) => updateItem(idx, { unitRate: sanitizeNumberText(v) })}
                    keyboardType="numeric"
                    prefix="₹"
                    placeholder="0"
                  />
                </View>
              </View>
              <View style={styles.itemTotals}>
                <Text style={styles.itemTotalsKey}>{t(lang, 'rowTotal')}</Text>
                <Text style={styles.itemTotalsVal}>{formatIndianRupee(computed.total)}</Text>
              </View>
              <View style={styles.itemActions}>
                <Button variant="ghost" label={t(lang, 'remove')} onPress={() => confirmRemove(idx)} disabled={items.length <= 1} />
              </View>
            </View>
          )
        })}

        <Button
          label={t(lang, 'addItem')}
          variant="secondary"
          onPress={() =>
            setItems((p) => [
              ...p,
              {
                description: `${t(lang, 'itemNumber')} ${p.length + 1}`,
                quantity: '1',
                unitRate: '0',
                gstRate: defaultGstRate,
              },
            ])
          }
        />

        <TextField label={t(lang, 'invoiceNotes')} value={notes} onChange={setNotes} placeholder={t(lang, 'placeholderThanks')} />

        <View style={appStyles.divider} />

        <View style={styles.totalsCard}>
          <Text style={styles.totalsTitle}>{t(lang, 'totalsHeading')}</Text>
          <View style={styles.totalsRow}>
            <Text style={styles.totalsKey}>{t(lang, 'taxable')}</Text>
            <Text style={styles.totalsVal}>{formatIndianRupee(totals.taxableValue)}</Text>
          </View>
          {supplyType === 'intra' ? (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsKey}>CGST + SGST</Text>
              <Text style={styles.totalsVal}>
                {formatIndianRupee(totals.cgst)} + {formatIndianRupee(totals.sgst)}
              </Text>
            </View>
          ) : (
            <View style={styles.totalsRow}>
              <Text style={styles.totalsKey}>IGST</Text>
              <Text style={styles.totalsVal}>{formatIndianRupee(totals.igst)}</Text>
            </View>
          )}
          <View style={styles.totalsRow}>
            <Text style={styles.totalsKey}>{t(lang, 'totalGst')}</Text>
            <Text style={styles.totalsVal}>{formatIndianRupee(totals.totalGst)}</Text>
          </View>
          <View style={styles.totalsRowStrong}>
            <Text style={styles.totalsKeyStrong}>{t(lang, 'grandTotal')}</Text>
            <Text style={styles.totalsValStrong}>{formatIndianRupee(totals.total)}</Text>
          </View>
        </View>

        <View style={{ height: spacing.md }} />
        <Button label={t(lang, 'shareWhatsapp')} onPress={() => void shareAndSave()} />
        <View style={{ height: spacing.sm }} />
        <Button label={t(lang, 'exportPdf')} variant="secondary" onPress={() => void exportPdfAndSave()} />
        <Text style={[appStyles.helper, { marginTop: spacing.sm }]}>{t(lang, 'shareSheetHint')}</Text>
      </View>
    </ScrollView>
  )
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/'/g, '&#039;')
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bg,
  },
  context: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginBottom: spacing.sm,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.small,
    marginBottom: spacing.md,
  },
  threeCol: { flexDirection: 'row', gap: spacing.md },
  col: { flex: 1 },
  itemCard: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  itemTitle: {
    fontSize: typography.small,
    color: colors.textMuted,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  itemRow: { flexDirection: 'row', gap: spacing.md },
  itemTotals: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  itemTotalsKey: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '900',
  },
  itemTotalsVal: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '900',
  },
  itemActions: {
    marginTop: spacing.sm,
    alignItems: 'flex-start',
  },
  totalsCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  totalsTitle: {
    fontSize: typography.h2,
    fontWeight: '900',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  totalsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xs },
  totalsKey: { color: colors.textMuted, fontSize: typography.small, fontWeight: '900' },
  totalsVal: { color: colors.text, fontSize: typography.small, fontWeight: '900' },
  totalsRowStrong: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalsKeyStrong: { color: colors.text, fontSize: typography.body, fontWeight: '900' },
  totalsValStrong: { color: colors.text, fontSize: typography.body, fontWeight: '900' },
})
