export type SupplyType = 'intra' | 'inter'

export type GstBreakdown = {
  supplyType: SupplyType
  gstRatePercent: number
  taxableValue: number
  cgst: number
  sgst: number
  igst: number
  totalGst: number
  total: number
}

export type InvoiceItemInput = {
  description: string
  quantity: number
  unitRate: number // taxable (tax-exclusive) per-unit rate
}

export type InvoiceItemComputed = InvoiceItemInput & {
  taxableValue: number
  cgst: number
  sgst: number
  igst: number
  totalGst: number
  total: number
}

export function roundMoney(n: number) {
  if (!Number.isFinite(n)) return 0
  return Math.round((n + Number.EPSILON) * 100) / 100
}

function clampNonNegative(n: number) {
  if (!Number.isFinite(n)) return 0
  return n < 0 ? 0 : n
}

export function getSupplyType(supplierStateCode: string, customerStateCode: string): SupplyType {
  return supplierStateCode === customerStateCode ? 'intra' : 'inter'
}

export function computeFromTaxableValue(args: {
  taxableValue: number
  gstRatePercent: number
  supplyType: SupplyType
}): GstBreakdown {
  const taxableValue = clampNonNegative(args.taxableValue)
  const gstRatePercent = clampNonNegative(args.gstRatePercent)

  const r = gstRatePercent / 100

  let cgst = 0
  let sgst = 0
  let igst = 0

  if (args.supplyType === 'intra') {
    const half = r / 2
    cgst = taxableValue * half
    sgst = taxableValue * half
  } else {
    igst = taxableValue * r
  }

  const totalGst = cgst + sgst + igst
  const total = taxableValue + totalGst

  return {
    supplyType: args.supplyType,
    gstRatePercent,
    taxableValue: roundMoney(taxableValue),
    cgst: roundMoney(cgst),
    sgst: roundMoney(sgst),
    igst: roundMoney(igst),
    totalGst: roundMoney(totalGst),
    total: roundMoney(total),
  }
}

export function computeFromInclusiveTotal(args: {
  totalInclusive: number
  gstRatePercent: number
  supplyType: SupplyType
}): GstBreakdown {
  const totalInclusive = clampNonNegative(args.totalInclusive)
  const gstRatePercent = clampNonNegative(args.gstRatePercent)
  const r = gstRatePercent / 100

  const taxableValue = r === 0 ? totalInclusive : totalInclusive / (1 + r)
  return computeFromTaxableValue({ taxableValue, gstRatePercent, supplyType: args.supplyType })
}

export function computeFromGstAmount(args: {
  gstAmount: number
  gstRatePercent: number
  supplyType: SupplyType
}): GstBreakdown {
  const gstAmount = clampNonNegative(args.gstAmount)
  const gstRatePercent = clampNonNegative(args.gstRatePercent)
  const r = gstRatePercent / 100

  const taxableValue = r === 0 ? 0 : gstAmount / r
  const breakdown = computeFromTaxableValue({ taxableValue, gstRatePercent, supplyType: args.supplyType })

  // Normalize component split to match the GST amount input (rounding can drift slightly).
  // Keep taxableValue from derived calc; adjust only totals if needed.
  const delta = roundMoney(gstAmount - breakdown.totalGst)
  if (delta !== 0) {
    if (breakdown.supplyType === 'inter') {
      breakdown.igst = roundMoney(breakdown.igst + delta)
    } else {
      // Split delta evenly between CGST/SGST.
      const half = delta / 2
      breakdown.cgst = roundMoney(breakdown.cgst + half)
      breakdown.sgst = roundMoney(breakdown.sgst + half)
    }
    breakdown.totalGst = roundMoney(breakdown.cgst + breakdown.sgst + breakdown.igst)
    breakdown.total = roundMoney(breakdown.taxableValue + breakdown.totalGst)
  }

  return breakdown
}

export function computeInvoiceItem(args: {
  item: InvoiceItemInput
  gstRatePercent: number
  supplyType: SupplyType
}): InvoiceItemComputed {
  const quantity = clampNonNegative(args.item.quantity)
  const unitRate = clampNonNegative(args.item.unitRate)
  const taxableValue = quantity * unitRate
  const breakdown = computeFromTaxableValue({
    taxableValue,
    gstRatePercent: args.gstRatePercent,
    supplyType: args.supplyType,
  })

  return {
    description: args.item.description,
    quantity: roundMoney(quantity),
    unitRate: roundMoney(unitRate),
    taxableValue: breakdown.taxableValue,
    cgst: breakdown.cgst,
    sgst: breakdown.sgst,
    igst: breakdown.igst,
    totalGst: breakdown.totalGst,
    total: breakdown.total,
  }
}

export function computeInvoiceTotals(items: InvoiceItemComputed[]): Omit<GstBreakdown, 'gstRatePercent' | 'supplyType'> {
  const sum = (key: keyof InvoiceItemComputed) => items.reduce((acc, it) => acc + (it[key] as number), 0)
  const taxableValue = sum('taxableValue')
  const cgst = sum('cgst')
  const sgst = sum('sgst')
  const igst = sum('igst')
  const totalGst = sum('totalGst')
  const total = sum('total')

  return {
    taxableValue: roundMoney(taxableValue),
    cgst: roundMoney(cgst),
    sgst: roundMoney(sgst),
    igst: roundMoney(igst),
    totalGst: roundMoney(totalGst),
    total: roundMoney(total),
  }
}

