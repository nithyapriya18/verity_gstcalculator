import AsyncStorage from '@react-native-async-storage/async-storage'
import * as Clipboard from 'expo-clipboard'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useMemo, useState } from 'react'
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  Linking,
} from 'react-native'
import {
  computeFromGstAmount,
  computeFromInclusiveTotal,
  computeFromTaxableValue,
  computeInvoiceItem,
  computeInvoiceTotals,
  getSupplyType,
  roundMoney,
  type InvoiceItemInput,
} from './src/lib/gst'
import { INDIAN_STATES, getStateName } from './src/lib/states'

type ScreenTab = 'calculator' | 'invoice' | 'history' | 'settings'
type GstMode = 'forward' | 'reverse'
type PriceBasis = 'exclusive' | 'inclusive'
type ReverseInput = 'inclusiveTotal' | 'gstAmount'

const HISTORY_KEY = 'gst_mobile_history_v1'
const PRIVACY_POLICY_URL = 'https://verity-studios.vercel.app/privacy'
const SUPPORT_URL = 'https://verity-studios.vercel.app/support'
const MAX_AMOUNT = 1000000000
const MAX_GST_RATE = 100

function sanitizeCode(value: string) {
  return value.replace(/\D/g, '').slice(0, 2)
}

function sanitizeNumberText(value: string) {
  return value.replace(/[^0-9.]/g, '')
}

function toSafeNumber(value: string, max: number) {
  const n = Number(value || 0)
  if (!Number.isFinite(n) || n < 0) return 0
  return Math.min(n, max)
}

function formatMoney(value: number) {
  return roundMoney(value).toFixed(2)
}

export default function App() {
  const [tab, setTab] = useState<ScreenTab>('calculator')
  const [supplierState, setSupplierState] = useState('27')
  const [customerState, setCustomerState] = useState('27')
  const [gstRate, setGstRate] = useState('18')
  const [gstMode, setGstMode] = useState<GstMode>('forward')
  const [priceBasis, setPriceBasis] = useState<PriceBasis>('exclusive')
  const [reverseInput, setReverseInput] = useState<ReverseInput>('inclusiveTotal')
  const [amountExclusive, setAmountExclusive] = useState('1000')
  const [amountInclusive, setAmountInclusive] = useState('1180')
  const [gstAmount, setGstAmount] = useState('180')
  const [historyEntries, setHistoryEntries] = useState<string[]>([])

  const [invoiceNo, setInvoiceNo] = useState('INV-0001')
  const [sellerName, setSellerName] = useState('Seller')
  const [buyerName, setBuyerName] = useState('Buyer')
  const [items, setItems] = useState<InvoiceItemInput[]>([{ description: 'Item 1', quantity: 1, unitRate: 1000 }])

  const supplyType = getSupplyType(supplierState, customerState)
  const gstRateNumber = toSafeNumber(gstRate, MAX_GST_RATE)
  const supplierStateValid = INDIAN_STATES.some((state) => state.code === supplierState)
  const customerStateValid = INDIAN_STATES.some((state) => state.code === customerState)

  const gstResult = useMemo(() => {
    if (gstMode === 'forward') {
      if (priceBasis === 'exclusive') {
        return computeFromTaxableValue({
          taxableValue: toSafeNumber(amountExclusive, MAX_AMOUNT),
          gstRatePercent: gstRateNumber,
          supplyType,
        })
      }
      return computeFromInclusiveTotal({
        totalInclusive: toSafeNumber(amountInclusive, MAX_AMOUNT),
        gstRatePercent: gstRateNumber,
        supplyType,
      })
    }

    if (reverseInput === 'inclusiveTotal') {
      return computeFromInclusiveTotal({
        totalInclusive: toSafeNumber(amountInclusive, MAX_AMOUNT),
        gstRatePercent: gstRateNumber,
        supplyType,
      })
    }

    return computeFromGstAmount({
      gstAmount: toSafeNumber(gstAmount, MAX_AMOUNT),
      gstRatePercent: gstRateNumber,
      supplyType,
    })
  }, [amountExclusive, amountInclusive, gstAmount, gstMode, gstRateNumber, priceBasis, reverseInput, supplyType])

  const computedItems = useMemo(
    () =>
      items.map((item) =>
        computeInvoiceItem({
          item: {
            ...item,
            quantity: toSafeNumber(String(item.quantity), MAX_AMOUNT),
            unitRate: toSafeNumber(String(item.unitRate), MAX_AMOUNT),
          },
          gstRatePercent: gstRateNumber,
          supplyType,
        }),
      ),
    [gstRateNumber, items, supplyType],
  )

  const invoiceTotals = useMemo(() => computeInvoiceTotals(computedItems), [computedItems])
  const invoiceText = useMemo(() => {
    const lines: string[] = []
    lines.push(`INVOICE ${invoiceNo}`)
    lines.push(`Seller: ${sellerName}`)
    lines.push(`Buyer: ${buyerName}`)
    lines.push(`Supply: ${supplyType === 'intra' ? 'Intra-state (CGST + SGST)' : 'Inter-state (IGST)'}`)
    lines.push(`GST Rate: ${gstRateNumber}%`)
    lines.push('Items:')
    computedItems.forEach((item) => {
      lines.push(
        `- ${item.description || 'Item'} | Qty ${item.quantity} | Rate ${formatMoney(item.unitRate)} | Taxable ${formatMoney(item.taxableValue)} | Total ${formatMoney(item.total)}`,
      )
    })
    lines.push(`Taxable: ${formatMoney(invoiceTotals.taxableValue)}`)
    lines.push(`GST: ${formatMoney(invoiceTotals.totalGst)}`)
    lines.push(`Grand Total: ${formatMoney(invoiceTotals.total)}`)
    return lines.join('\n')
  }, [buyerName, computedItems, gstRateNumber, invoiceNo, invoiceTotals, sellerName, supplyType])

  async function saveHistory(entry: string) {
    const next = [entry, ...historyEntries].slice(0, 30)
    setHistoryEntries(next)
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  }

  async function loadHistory() {
    const stored = await AsyncStorage.getItem(HISTORY_KEY)
    if (stored) setHistoryEntries(JSON.parse(stored))
  }

  useEffect(() => {
    loadHistory()
  }, [])

  async function copyResult() {
    const text = `GST Summary\nSupply: ${supplyType}\nTaxable: ${formatMoney(gstResult.taxableValue)}\nTotal GST: ${formatMoney(gstResult.totalGst)}\nTotal: ${formatMoney(gstResult.total)}`
    await Clipboard.setStringAsync(text)
    await saveHistory(text)
  }

  async function shareInvoice() {
    await Share.share({ message: invoiceText })
    await saveHistory(invoiceText)
  }

  function renderCalculator() {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Calculator</Text>
        <Text style={styles.helper}>Supplier state code</Text>
        <TextInput style={styles.input} value={supplierState} onChangeText={(v) => setSupplierState(sanitizeCode(v))} />
        <Text style={styles.helper}>Customer state code</Text>
        <TextInput style={styles.input} value={customerState} onChangeText={(v) => setCustomerState(sanitizeCode(v))} />
        {!supplierStateValid || !customerStateValid ? (
          <Text style={styles.warning}>Use valid 2-digit GST state codes for accurate split.</Text>
        ) : null}
        <Text style={styles.helper}>GST rate (%)</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={gstRate} onChangeText={(v) => setGstRate(sanitizeNumberText(v))} />
        <View style={styles.row}>
          <Pressable style={gstMode === 'forward' ? styles.activePill : styles.pill} onPress={() => setGstMode('forward')}>
            <Text style={styles.pillText}>Forward</Text>
          </Pressable>
          <Pressable style={gstMode === 'reverse' ? styles.activePill : styles.pill} onPress={() => setGstMode('reverse')}>
            <Text style={styles.pillText}>Reverse</Text>
          </Pressable>
        </View>
        {gstMode === 'forward' ? (
          <>
            <View style={styles.row}>
              <Pressable
                style={priceBasis === 'exclusive' ? styles.activePill : styles.pill}
                onPress={() => setPriceBasis('exclusive')}
              >
                <Text style={styles.pillText}>Tax-exclusive</Text>
              </Pressable>
              <Pressable
                style={priceBasis === 'inclusive' ? styles.activePill : styles.pill}
                onPress={() => setPriceBasis('inclusive')}
              >
                <Text style={styles.pillText}>Tax-inclusive</Text>
              </Pressable>
            </View>
            {priceBasis === 'exclusive' ? (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amountExclusive}
                onChangeText={(v) => setAmountExclusive(sanitizeNumberText(v))}
              />
            ) : (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amountInclusive}
                onChangeText={(v) => setAmountInclusive(sanitizeNumberText(v))}
              />
            )}
          </>
        ) : (
          <>
            <View style={styles.row}>
              <Pressable
                style={reverseInput === 'inclusiveTotal' ? styles.activePill : styles.pill}
                onPress={() => setReverseInput('inclusiveTotal')}
              >
                <Text style={styles.pillText}>Inclusive total</Text>
              </Pressable>
              <Pressable
                style={reverseInput === 'gstAmount' ? styles.activePill : styles.pill}
                onPress={() => setReverseInput('gstAmount')}
              >
                <Text style={styles.pillText}>GST amount</Text>
              </Pressable>
            </View>
            {reverseInput === 'inclusiveTotal' ? (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amountInclusive}
                onChangeText={(v) => setAmountInclusive(sanitizeNumberText(v))}
              />
            ) : (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={gstAmount}
                onChangeText={(v) => setGstAmount(sanitizeNumberText(v))}
              />
            )}
          </>
        )}
        <Text style={styles.result}>Supply Type: {supplyType === 'intra' ? 'Intra-state' : 'Inter-state'}</Text>
        <Text style={styles.result}>Taxable: {formatMoney(gstResult.taxableValue)}</Text>
        <Text style={styles.result}>GST: {formatMoney(gstResult.totalGst)}</Text>
        <Text style={styles.resultStrong}>Total: {formatMoney(gstResult.total)}</Text>
        <Pressable style={styles.primaryBtn} onPress={copyResult}>
          <Text style={styles.primaryBtnText}>Copy Result + Save</Text>
        </Pressable>
      </View>
    )
  }

  function renderInvoice() {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice</Text>
        <TextInput style={styles.input} value={invoiceNo} onChangeText={setInvoiceNo} placeholder="Invoice No" />
        <TextInput style={styles.input} value={sellerName} onChangeText={setSellerName} placeholder="Seller name" />
        <TextInput style={styles.input} value={buyerName} onChangeText={setBuyerName} placeholder="Buyer name" />
        {items.map((item, idx) => (
          <View key={idx} style={styles.itemCard}>
            <TextInput
              style={styles.input}
              value={item.description}
              placeholder="Description"
              onChangeText={(value) => setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, description: value } : it)))}
            />
            <TextInput
              style={styles.input}
              value={String(item.quantity)}
              keyboardType="numeric"
              onChangeText={(value) =>
                setItems((prev) =>
                  prev.map((it, i) =>
                    i === idx ? { ...it, quantity: toSafeNumber(sanitizeNumberText(value), MAX_AMOUNT) } : it,
                  ),
                )
              }
            />
            <TextInput
              style={styles.input}
              value={String(item.unitRate)}
              keyboardType="numeric"
              onChangeText={(value) =>
                setItems((prev) =>
                  prev.map((it, i) =>
                    i === idx ? { ...it, unitRate: toSafeNumber(sanitizeNumberText(value), MAX_AMOUNT) } : it,
                  ),
                )
              }
            />
          </View>
        ))}
        <Pressable
          style={styles.secondaryBtn}
          onPress={() => setItems((prev) => [...prev, { description: `Item ${prev.length + 1}`, quantity: 1, unitRate: 0 }])}
        >
          <Text style={styles.secondaryBtnText}>Add Item</Text>
        </Pressable>
        <Text style={styles.result}>Taxable: {formatMoney(invoiceTotals.taxableValue)}</Text>
        <Text style={styles.result}>GST: {formatMoney(invoiceTotals.totalGst)}</Text>
        <Text style={styles.resultStrong}>Total: {formatMoney(invoiceTotals.total)}</Text>
        <Pressable style={styles.primaryBtn} onPress={shareInvoice}>
          <Text style={styles.primaryBtnText}>Share Invoice + Save</Text>
        </Pressable>
      </View>
    )
  }

  function renderHistory() {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>History</Text>
        {historyEntries.length === 0 ? <Text style={styles.helper}>No saved entries yet.</Text> : null}
        {historyEntries.map((entry, idx) => (
          <View key={idx} style={styles.historyCard}>
            <Text style={styles.historyText}>{entry}</Text>
          </View>
        ))}
      </View>
    )
  }

  function renderSettings() {
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings & Compliance</Text>
        <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
          <Text style={styles.link}>Privacy Policy</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(SUPPORT_URL)}>
          <Text style={styles.link}>Support</Text>
        </Pressable>
        <Text style={styles.helper}>Disclaimer: Utility only. Verify with a tax professional.</Text>
        <Text style={styles.helper}>App version: 1.0.0</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>GST Mobile</Text>
        <Text style={styles.subtitle}>
          {getStateName(supplierState)} to {getStateName(customerState)}
        </Text>
      </View>
      <View style={styles.tabRow}>
        {(['calculator', 'invoice', 'history', 'settings'] as ScreenTab[]).map((name) => (
          <Pressable key={name} style={tab === name ? styles.activeTab : styles.tab} onPress={() => setTab(name)}>
            <Text style={styles.tabText}>{name}</Text>
          </Pressable>
        ))}
      </View>
      <ScrollView style={styles.scroll}>
        {tab === 'calculator' && renderCalculator()}
        {tab === 'invoice' && renderInvoice()}
        {tab === 'history' && renderHistory()}
        {tab === 'settings' && renderSettings()}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fb',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#13203b',
  },
  subtitle: {
    color: '#475467',
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 16,
  },
  tab: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
  },
  activeTab: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#1d4ed8',
    borderRadius: 999,
  },
  tabText: {
    color: '#ffffff',
    textTransform: 'capitalize',
    fontWeight: '600',
  },
  scroll: {
    paddingHorizontal: 16,
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  helper: {
    fontSize: 13,
    color: '#475467',
    marginBottom: 6,
  },
  input: {
    borderColor: '#d0d5dd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: '#e2e8f0',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  activePill: {
    backgroundColor: '#2563eb',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  pillText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  result: {
    color: '#111827',
    marginBottom: 4,
  },
  resultStrong: {
    color: '#0f172a',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 12,
  },
  primaryBtn: {
    backgroundColor: '#0f766e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  secondaryBtn: {
    borderColor: '#1d4ed8',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  secondaryBtnText: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  itemCard: {
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  historyCard: {
    borderWidth: 1,
    borderColor: '#dbe2ea',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
  historyText: {
    color: '#344054',
    fontSize: 12,
  },
  link: {
    color: '#1d4ed8',
    fontWeight: '600',
    marginBottom: 8,
  },
  warning: {
    color: '#b54708',
    fontSize: 12,
    marginBottom: 10,
  },
})
