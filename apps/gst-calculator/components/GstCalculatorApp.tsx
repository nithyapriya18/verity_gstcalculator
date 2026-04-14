'use client'

import { useMemo, useState } from 'react'
import { ArrowUpDown, Check, Copy, LogOut, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { INDIAN_STATES, getStateName } from '@/apps/gst-calculator/lib/states'
import {
  computeFromGstAmount,
  computeFromInclusiveTotal,
  computeFromTaxableValue,
  computeInvoiceItem,
  computeInvoiceTotals,
  getSupplyType,
  roundMoney,
  type InvoiceItemInput,
} from '@/apps/gst-calculator/lib/gst'

type Tab = 'gst' | 'bill'
type GstMode = 'forward' | 'reverse'
type PriceBasis = 'exclusive' | 'inclusive'
type ReverseInput = 'inclusiveTotal' | 'gstAmount'

function formatMoney(n: number) {
  return roundMoney(n).toFixed(2)
}

function TextField(props: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: 'text' | 'number' | 'date'
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-text-primary mb-2">{props.label}</div>
      <input
        type={props.type ?? 'text'}
        value={props.value}
        placeholder={props.placeholder}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full h-11 rounded-xl border border-border/60 bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
      />
    </label>
  )
}

function SelectField(props: {
  label: string
  value: string
  onChange: (v: string) => void
  options: Array<{ value: string; label: string }>
}) {
  return (
    <label className="block">
      <div className="text-sm font-medium text-text-primary mb-2">{props.label}</div>
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full h-11 rounded-xl border border-border/60 bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function Segmented<T extends string>(props: {
  label: string
  value: T
  onChange: (v: T) => void
  options: Array<{ value: T; label: string }>
}) {
  return (
    <div className="block">
      <div className="text-sm font-medium text-text-primary mb-2">{props.label}</div>
      <div
        className="grid w-full rounded-full bg-background p-1"
        style={{ gridTemplateColumns: `repeat(${props.options.length}, minmax(0, 1fr))` }}
      >
        {props.options.map((o) => {
          const active = props.value === o.value
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => props.onChange(o.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                active ? 'bg-accent text-white' : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {o.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ResultRow(props: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-6 py-2.5">
      <div className={`text-sm ${props.strong ? 'text-text-primary font-medium' : 'text-text-muted'}`}>
        {props.label}
      </div>
      <div className={`text-sm tabular-nums pr-3 md:pr-4 ${props.strong ? 'text-text-primary font-semibold' : 'text-text-primary'}`}>
        {props.value}
      </div>
    </div>
  )
}

function Panel(props: { title: string; subtitle?: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section className="rounded-2xl bg-surface/80">
      <div className="px-7 pt-7 pb-5 md:px-8 md:pt-8 md:pb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-sm font-semibold text-text-primary">{props.title}</div>
            {props.subtitle && <div className="text-xs text-text-muted mt-1 leading-relaxed">{props.subtitle}</div>}
          </div>
          {props.right}
        </div>
      </div>
      <div className="px-7 pb-7 md:px-8 md:pb-8">{props.children}</div>
    </section>
  )
}

export function GstCalculatorApp() {
  const [tab, setTab] = useState<Tab>('gst')

  const stateOptions = useMemo(
    () => [{ value: '', label: 'Select…' }, ...INDIAN_STATES.map((s) => ({ value: s.code, label: `${s.name} (${s.code})` }))],
    [],
  )

  const [supplierState, setSupplierState] = useState('27') // Maharashtra
  const [customerState, setCustomerState] = useState('27')
  const supplyType = supplierState && customerState ? getSupplyType(supplierState, customerState) : 'intra'

  const [gstRate, setGstRate] = useState('18')
  const gstRatePercent = Number(gstRate || 0)

  const [gstMode, setGstMode] = useState<GstMode>('forward')
  const [priceBasis, setPriceBasis] = useState<PriceBasis>('exclusive')
  const [reverseInput, setReverseInput] = useState<ReverseInput>('inclusiveTotal')

  const [amountExclusive, setAmountExclusive] = useState('1000')
  const [amountInclusive, setAmountInclusive] = useState('1180')
  const [gstAmount, setGstAmount] = useState('180')

  const gstResult = useMemo(() => {
    const safeSupplyType = supplyType
    if (!Number.isFinite(gstRatePercent) || gstRatePercent < 0) return null

    if (gstMode === 'forward') {
      if (priceBasis === 'exclusive') {
        const taxableValue = Number(amountExclusive || 0)
        return computeFromTaxableValue({ taxableValue, gstRatePercent, supplyType: safeSupplyType })
      }
      const totalInclusive = Number(amountInclusive || 0)
      return computeFromInclusiveTotal({ totalInclusive, gstRatePercent, supplyType: safeSupplyType })
    }

    if (reverseInput === 'inclusiveTotal') {
      const totalInclusive = Number(amountInclusive || 0)
      return computeFromInclusiveTotal({ totalInclusive, gstRatePercent, supplyType: safeSupplyType })
    }

    const g = Number(gstAmount || 0)
    return computeFromGstAmount({ gstAmount: g, gstRatePercent, supplyType: safeSupplyType })
  }, [supplyType, gstMode, priceBasis, reverseInput, amountExclusive, amountInclusive, gstAmount, gstRatePercent])

  // Bill generator
  const [invoiceNo, setInvoiceNo] = useState('INV-0001')
  const [invoiceDate, setInvoiceDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [sellerName, setSellerName] = useState('Seller')
  const [buyerName, setBuyerName] = useState('Buyer')
  const [sellerGstin, setSellerGstin] = useState('')
  const [buyerGstin, setBuyerGstin] = useState('')

  const [items, setItems] = useState<InvoiceItemInput[]>([
    { description: 'Item 1', quantity: 1, unitRate: 1000 },
  ])

  const computedItems = useMemo(() => {
    return items.map((item) =>
      computeInvoiceItem({
        item: {
          description: item.description,
          quantity: Number(item.quantity || 0),
          unitRate: Number(item.unitRate || 0),
        },
        gstRatePercent,
        supplyType,
      }),
    )
  }, [items, gstRatePercent, supplyType])

  const invoiceTotals = useMemo(() => computeInvoiceTotals(computedItems), [computedItems])

  const placeOfSupply = customerState ? `${getStateName(customerState)} (${customerState})` : '—'

  const invoiceText = useMemo(() => {
    const lines: string[] = []
    lines.push(`INVOICE`)
    lines.push(`Invoice No: ${invoiceNo}`)
    lines.push(`Invoice Date: ${invoiceDate}`)
    lines.push(`Supply Type: ${supplyType === 'intra' ? 'Intra-state (CGST+SGST)' : 'Inter-state (IGST)'}`)
    lines.push(`Place of Supply: ${placeOfSupply}`)
    lines.push(`GST Rate: ${gstRatePercent}%`)
    lines.push(``)
    lines.push(`Seller: ${sellerName}${sellerGstin ? ` (GSTIN: ${sellerGstin})` : ''}`)
    lines.push(`Buyer: ${buyerName}${buyerGstin ? ` (GSTIN: ${buyerGstin})` : ''}`)
    lines.push(``)
    lines.push(`Items:`)
    lines.push(`Description | Qty | Unit Rate | Taxable | GST | Total`)
    lines.push(`---|---:|---:|---:|---:|---:`)
    computedItems.forEach((it) => {
      const gstLine = it.totalGst
      lines.push(
        `${it.description || '—'} | ${formatMoney(it.quantity)} | ${formatMoney(it.unitRate)} | ${formatMoney(
          it.taxableValue,
        )} | ${formatMoney(gstLine)} | ${formatMoney(it.total)}`,
      )
    })
    lines.push(``)
    lines.push(`Totals:`)
    lines.push(`Taxable Value: ${formatMoney(invoiceTotals.taxableValue)}`)
    if (supplyType === 'intra') {
      lines.push(`CGST: ${formatMoney(invoiceTotals.cgst)}`)
      lines.push(`SGST: ${formatMoney(invoiceTotals.sgst)}`)
    } else {
      lines.push(`IGST: ${formatMoney(invoiceTotals.igst)}`)
    }
    lines.push(`Total GST: ${formatMoney(invoiceTotals.totalGst)}`)
    lines.push(`Grand Total: ${formatMoney(invoiceTotals.total)}`)
    return lines.join('\n')
  }, [
    invoiceNo,
    invoiceDate,
    sellerName,
    buyerName,
    sellerGstin,
    buyerGstin,
    computedItems,
    invoiceTotals,
    supplyType,
    placeOfSupply,
    gstRatePercent,
  ])

  const [copied, setCopied] = useState(false)
  const [copiedGst, setCopiedGst] = useState(false)

  async function copyInvoice() {
    try {
      await navigator.clipboard.writeText(invoiceText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      setCopied(false)
    }
  }

  async function copyGstSummary() {
    if (!gstResult) return
    const lines = [
      `GST SUMMARY`,
      `Supply: ${gstResult.supplyType === 'intra' ? 'Intra-state (CGST+SGST)' : 'Inter-state (IGST)'}`,
      `Rate: ${gstRatePercent}%`,
      `Taxable Value: ${formatMoney(gstResult.taxableValue)}`,
      gstResult.supplyType === 'intra'
        ? `CGST: ${formatMoney(gstResult.cgst)} | SGST: ${formatMoney(gstResult.sgst)}`
        : `IGST: ${formatMoney(gstResult.igst)}`,
      `Total GST: ${formatMoney(gstResult.totalGst)}`,
      `Grand Total: ${formatMoney(gstResult.total)}`,
    ]

    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopiedGst(true)
      window.setTimeout(() => setCopiedGst(false), 1200)
    } catch {
      setCopiedGst(false)
    }
  }

  function swapStates() {
    setSupplierState(customerState)
    setCustomerState(supplierState)
  }

  function resetCalculator() {
    setGstRate('18')
    setGstMode('forward')
    setPriceBasis('exclusive')
    setReverseInput('inclusiveTotal')
    setAmountExclusive('1000')
    setAmountInclusive('1180')
    setGstAmount('180')
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = '/login?next=/gst-calculator'
  }

  return (
    <div className="bg-background py-14 md:py-16">
      <div className="max-w-layout mx-auto px-6 md:px-8">
        <div>
          <div className="px-0 py-2 md:py-3">
            <div className="flex items-start justify-between gap-6">
              <div className="max-w-3xl">
                <h1 className="font-display font-semibold text-3xl md:text-4xl text-text-primary">GST Calculator</h1>
                <p className="text-text-muted text-base md:text-lg leading-relaxed mt-2">
                  Forward + reverse GST calculation, plus an itemized bill generator.
                </p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-border/60 bg-background text-text-primary hover:bg-accent-light transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>

            <div className="mt-6 inline-flex rounded-full bg-background p-1 w-fit">
              <button
                type="button"
                onClick={() => setTab('gst')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  tab === 'gst' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                GST Calculation
              </button>
              <button
                type="button"
                onClick={() => setTab('bill')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  tab === 'bill' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                Bill Generator
              </button>
            </div>
          </div>

          <div className="px-0 py-6 md:py-8">
            <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              <Panel title="Inputs" subtitle="Select supplier/customer states to decide CGST+SGST vs IGST.">
              <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
                <SelectField label="Supplier state" value={supplierState} onChange={setSupplierState} options={stateOptions} />
                <button
                  type="button"
                  onClick={swapStates}
                  className="h-11 w-11 rounded-xl bg-background text-text-muted hover:text-text-primary hover:bg-accent-light transition"
                  aria-label="Swap supplier and customer states"
                >
                  <ArrowUpDown size={16} className="mx-auto" />
                </button>
                <SelectField label="Customer state" value={customerState} onChange={setCustomerState} options={stateOptions} />
              </div>

              <div className="mt-5 grid sm:grid-cols-2 gap-4 items-end">
                <TextField label="GST rate (%)" value={gstRate} onChange={setGstRate} type="number" placeholder="18" />
                <div className="rounded-xl bg-background px-4 py-3">
                  <div className="text-xs font-semibold text-text-muted uppercase tracking-wide">Supply type</div>
                  <div className="mt-1 text-sm text-text-primary font-semibold">
                    {supplyType === 'intra' ? 'Intra-state (CGST + SGST)' : 'Inter-state (IGST)'}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {['3', '5', '12', '18', '28'].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setGstRate(rate)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                      gstRate === rate ? 'bg-accent text-white' : 'bg-background text-text-muted hover:text-text-primary'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
                <button
                  type="button"
                  onClick={resetCalculator}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-background text-text-muted hover:text-text-primary transition"
                >
                  <RotateCcw size={12} />
                  Reset
                </button>
              </div>

              {tab === 'gst' && (
                <div className="mt-7 space-y-6">
                  <Segmented
                    label="Mode"
                    value={gstMode}
                    onChange={setGstMode}
                    options={[
                      { value: 'forward', label: 'Forward' },
                      { value: 'reverse', label: 'Reverse' },
                    ]}
                  />

                  {gstMode === 'forward' ? (
                    <div className="space-y-4">
                      <Segmented
                        label="Price basis"
                        value={priceBasis}
                        onChange={setPriceBasis}
                        options={[
                          { value: 'exclusive', label: 'Tax-exclusive' },
                          { value: 'inclusive', label: 'Tax-inclusive' },
                        ]}
                      />
                      {priceBasis === 'exclusive' ? (
                        <TextField
                          label="Taxable value"
                          value={amountExclusive}
                          onChange={setAmountExclusive}
                          type="number"
                          placeholder="1000"
                        />
                      ) : (
                        <TextField
                          label="Total (inclusive of GST)"
                          value={amountInclusive}
                          onChange={setAmountInclusive}
                          type="number"
                          placeholder="1180"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Segmented
                        label="Reverse input"
                        value={reverseInput}
                        onChange={setReverseInput}
                        options={[
                          { value: 'inclusiveTotal', label: 'Inclusive total' },
                          { value: 'gstAmount', label: 'GST amount' },
                        ]}
                      />
                      {reverseInput === 'inclusiveTotal' ? (
                        <TextField
                          label="Total (inclusive of GST)"
                          value={amountInclusive}
                          onChange={setAmountInclusive}
                          type="number"
                          placeholder="1180"
                        />
                      ) : (
                        <TextField
                          label="GST amount"
                          value={gstAmount}
                          onChange={setGstAmount}
                          type="number"
                          placeholder="180"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {tab === 'bill' && (
                <div className="mt-7 space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <TextField label="Invoice no" value={invoiceNo} onChange={setInvoiceNo} placeholder="INV-0001" />
                    <TextField label="Invoice date" value={invoiceDate} onChange={setInvoiceDate} type="date" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <TextField label="Seller name" value={sellerName} onChange={setSellerName} placeholder="Seller" />
                    <TextField label="Buyer name" value={buyerName} onChange={setBuyerName} placeholder="Buyer" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <TextField label="Seller GSTIN (optional)" value={sellerGstin} onChange={setSellerGstin} placeholder="27ABCDE1234F1Z5" />
                    <TextField label="Buyer GSTIN (optional)" value={buyerGstin} onChange={setBuyerGstin} placeholder="29ABCDE1234F1Z5" />
                  </div>

                  <div className="rounded-xl bg-background p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold text-text-primary">Items</div>
                        <div className="text-xs text-text-muted mt-1 leading-relaxed">
                          Unit rate is treated as tax-exclusive (taxable). GST is added on top.
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setItems((prev) => [
                            ...prev,
                            { description: `Item ${prev.length + 1}`, quantity: 1, unitRate: 0 },
                          ])
                        }
                        className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl bg-accent text-white font-semibold hover:bg-accent/90 transition"
                      >
                        <Plus size={16} />
                        Add item
                      </button>
                    </div>

                    <div className="mt-4 space-y-3">
                      {items.map((it, idx) => (
                        <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end rounded-xl bg-surface p-4">
                          <div className="sm:col-span-6">
                            <TextField
                              label="Description"
                              value={it.description}
                              onChange={(v) =>
                                setItems((prev) => prev.map((p, i) => (i === idx ? { ...p, description: v } : p)))
                              }
                              placeholder="Consulting"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <TextField
                              label="Qty"
                              value={String(it.quantity)}
                              onChange={(v) =>
                                setItems((prev) =>
                                  prev.map((p, i) => (i === idx ? { ...p, quantity: Number(v || 0) } : p)),
                                )
                              }
                              type="number"
                              placeholder="1"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <TextField
                              label="Unit rate"
                              value={String(it.unitRate)}
                              onChange={(v) =>
                                setItems((prev) =>
                                  prev.map((p, i) => (i === idx ? { ...p, unitRate: Number(v || 0) } : p)),
                                )
                              }
                              type="number"
                              placeholder="1000"
                            />
                          </div>
                          <div className="sm:col-span-1 flex sm:justify-end">
                            <button
                              type="button"
                              onClick={() => setItems((prev) => prev.filter((_, i) => i !== idx))}
                              className="inline-flex items-center justify-center rounded-xl bg-background px-3 py-3 text-text-muted hover:text-text-primary hover:bg-accent-light transition"
                              aria-label="Remove item"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              </Panel>

              <Panel
                title={tab === 'gst' ? 'Results' : 'Invoice output'}
                subtitle={tab === 'gst' ? 'Calculated automatically from your inputs.' : 'Copy as plain text (MVP).'}
                right={
                  tab === 'bill' ? (
                    <button
                      type="button"
                      onClick={copyInvoice}
                      className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-border/60 bg-background text-text-primary hover:bg-accent-light transition"
                    >
                      {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={copyGstSummary}
                      className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-xl border border-border/60 bg-background text-text-primary hover:bg-accent-light transition"
                    >
                      {copiedGst ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                      {copiedGst ? 'Copied' : 'Copy'}
                    </button>
                  )
                }
              >
              {tab === 'gst' ? (
                <>
                  <div className="rounded-xl bg-background px-6 py-5 md:px-7">
                    {gstResult ? (
                      <div className="space-y-1">
                        <ResultRow label="Taxable value" value={formatMoney(gstResult.taxableValue)} />
                        {gstResult.supplyType === 'intra' ? (
                          <>
                            <ResultRow label="CGST" value={formatMoney(gstResult.cgst)} />
                            <ResultRow label="SGST" value={formatMoney(gstResult.sgst)} />
                          </>
                        ) : (
                          <ResultRow label="IGST" value={formatMoney(gstResult.igst)} />
                        )}
                        <div className="border-t border-border/60 my-3" />
                        <ResultRow label="Total GST" value={formatMoney(gstResult.totalGst)} strong />
                        <ResultRow label="Grand total" value={formatMoney(gstResult.total)} strong />
                      </div>
                    ) : (
                      <div className="text-sm text-text-muted">Enter valid values to see results.</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-xl bg-background px-6 py-5 md:px-7">
                    <ResultRow label="Taxable value" value={formatMoney(invoiceTotals.taxableValue)} />
                    {supplyType === 'intra' ? (
                      <>
                        <ResultRow label="CGST" value={formatMoney(invoiceTotals.cgst)} />
                        <ResultRow label="SGST" value={formatMoney(invoiceTotals.sgst)} />
                      </>
                    ) : (
                      <ResultRow label="IGST" value={formatMoney(invoiceTotals.igst)} />
                    )}
                    <div className="border-t border-border/60 my-3" />
                    <ResultRow label="Total GST" value={formatMoney(invoiceTotals.totalGst)} strong />
                    <ResultRow label="Grand total" value={formatMoney(invoiceTotals.total)} strong />
                  </div>

                  <div className="mt-6">
                    <div className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-2">Preview</div>
                    <pre className="whitespace-pre-wrap text-xs leading-relaxed rounded-xl bg-background p-5 text-text-primary">
                      {invoiceText}
                    </pre>
                  </div>
                </>
              )}
              </Panel>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

