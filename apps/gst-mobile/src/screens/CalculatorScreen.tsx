import { useFocusEffect, useNavigation } from '@react-navigation/native'
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import * as Clipboard from 'expo-clipboard'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Modal, Pressable, ScrollView, Share, StyleSheet, Text, View } from 'react-native'
import { computeFromInclusiveTotal, computeFromTaxableValue, getSupplyType } from '@/src/lib/gst'
import { getStateName } from '@/src/lib/states'
import { MAX_AMOUNT, MAX_GST_RATE, sanitizeNumberText, toSafeNumber } from '@/src/lib/sanitize'
import { formatIndianRupee } from '@/src/lib/formatIndian'
import { Button } from '@/src/components/ui/Button'
import { ChipGroup } from '@/src/components/ui/ChipGroup'
import { TextField } from '@/src/components/ui/TextField'
import { HSN_SAC_ENTRIES, type HsnSacEntry } from '@/src/data/hsnSac'
import { searchHsn } from '@/src/lib/searchHsn'
import { appStyles } from '@/src/theme/styles'
import { colors, radius, spacing, typography } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'
import { useHistory } from '@/src/context/HistoryContext'
import type { MainTabParamList } from '@/src/navigation/types'

type CalcMode = 'add' | 'remove'

type Nav = BottomTabNavigationProp<MainTabParamList, 'Calculate'>

const RATE_CHIPS = ['5', '12', '18', '28']

export function CalculatorScreen() {
  const navigation = useNavigation<Nav>()
  const {
    supplierState,
    customerState,
    defaultGstRate,
    language,
    autoSaveHistory,
    pendingCalculatorGstRate,
    setPendingCalculatorGstRate,
  } = useAppSettings()
  const { addEntry } = useHistory()
  const lang = language

  const supplyType = getSupplyType(supplierState, customerState)

  const [gstRate, setGstRate] = useState(defaultGstRate)
  const [mode, setMode] = useState<CalcMode>('add')
  const [amountText, setAmountText] = useState('1000')
  const [customOpen, setCustomOpen] = useState(false)
  const [hsnQuery, setHsnQuery] = useState('')
  const [selectedHsn, setSelectedHsn] = useState<HsnSacEntry | null>(null)

  const gstRateNumber = toSafeNumber(gstRate, MAX_GST_RATE)
  const canCalculate = selectedHsn !== null
  const hsnResults = useMemo(() => searchHsn(HSN_SAC_ENTRIES, hsnQuery, 8), [hsnQuery])

  useEffect(() => {
    setGstRate(defaultGstRate)
  }, [defaultGstRate])

  useFocusEffect(
    useCallback(() => {
      if (pendingCalculatorGstRate) {
        setGstRate(pendingCalculatorGstRate)
        setPendingCalculatorGstRate(null)
      }
    }, [pendingCalculatorGstRate, setPendingCalculatorGstRate]),
  )

  const breakdown = useMemo(() => {
    if (!canCalculate) {
      return computeFromTaxableValue({ taxableValue: 0, gstRatePercent: gstRateNumber, supplyType })
    }
    const amt = toSafeNumber(amountText, MAX_AMOUNT)
    if (mode === 'add') {
      return computeFromTaxableValue({ taxableValue: amt, gstRatePercent: gstRateNumber, supplyType })
    }
    return computeFromInclusiveTotal({ totalInclusive: amt, gstRatePercent: gstRateNumber, supplyType })
  }, [amountText, canCalculate, gstRateNumber, mode, supplyType])

  const contextLine = `${getStateName(supplierState)} → ${getStateName(customerState)} · ${
    supplyType === 'intra' ? t(lang, 'intraLabel') : t(lang, 'interLabel')
  }`

  const resultTextLines = useMemo(
    () =>
      [
        `GST SUMMARY`,
        contextLine,
        `HSN/SAC: ${selectedHsn?.code ?? '-'} ${selectedHsn?.description ?? ''}`,
        `${t(lang, 'gstRate')}: ${gstRateNumber}%`,
        `${t(lang, 'base')}: ${formatIndianRupee(breakdown.taxableValue)}`,
        supplyType === 'intra'
          ? `CGST: ${formatIndianRupee(breakdown.cgst)} · SGST: ${formatIndianRupee(breakdown.sgst)}`
          : `IGST: ${formatIndianRupee(breakdown.igst)}`,
        `${t(lang, 'totalGst')}: ${formatIndianRupee(breakdown.totalGst)}`,
        `${t(lang, 'grandTotal')}: ${formatIndianRupee(breakdown.total)}`,
      ].join('\n'),
    [breakdown, contextLine, gstRateNumber, lang, selectedHsn, supplyType],
  )

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastSavedDigest = useRef<string>('')
  useEffect(() => {
    if (!autoSaveHistory) return
    if (!canCalculate) return
    const amt = toSafeNumber(amountText, MAX_AMOUNT)
    if (amt <= 0) return
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => {
      if (resultTextLines === lastSavedDigest.current) return
      lastSavedDigest.current = resultTextLines
      void addEntry({
        kind: 'calc',
        title: `${formatIndianRupee(breakdown.total)} · ${gstRateNumber}%`,
        body: resultTextLines,
        inputAmount: toSafeNumber(amountText, MAX_AMOUNT),
        gstRateLabel: `${gstRateNumber}%`,
        grandTotal: breakdown.total,
      })
    }, 1500)
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [addEntry, amountText, autoSaveHistory, breakdown.total, canCalculate, gstRateNumber, resultTextLines])

  async function onCopy() {
    if (!canCalculate) return
    await Clipboard.setStringAsync(resultTextLines)
  }

  async function onShare() {
    if (!canCalculate) return
    await Share.share({ message: resultTextLines })
  }

  function onSaveManual() {
    if (!canCalculate) return
    addEntry({
      kind: 'calc',
      title: `${formatIndianRupee(breakdown.total)} · ${gstRateNumber}%`,
      body: resultTextLines,
      inputAmount: toSafeNumber(amountText, MAX_AMOUNT),
      gstRateLabel: `${gstRateNumber}%`,
      grandTotal: breakdown.total,
    })
  }

  const amountLabel = mode === 'add' ? t(lang, 'amountHintAdd') : t(lang, 'amountHintRemove')

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <View style={appStyles.card}>
        <Text style={appStyles.sectionTitle}>{t(lang, 'calculatorTitle')}</Text>

        <View style={styles.statesRow}>
          <Text style={styles.statesText} numberOfLines={2}>
            {t(lang, 'statesRow')}: {contextLine}
          </Text>
          <Pressable onPress={() => navigation.navigate('More', { screen: 'Settings' })} hitSlop={8}>
            <Text style={styles.changeLink}>{t(lang, 'changeStates')}</Text>
          </Pressable>
        </View>
        <Text style={appStyles.helper}>{t(lang, 'stateSettingsHint')}</Text>

        <TextField
          label={t(lang, 'lookupTitle')}
          value={hsnQuery}
          onChange={setHsnQuery}
          placeholder={t(lang, 'lookupPlaceholder')}
          hint={selectedHsn ? `${selectedHsn.code} · ${selectedHsn.description}` : 'Required before calculation'}
        />
        {hsnQuery.trim().length > 0 ? (
          <View style={styles.lookupList}>
            {hsnResults.map((item) => (
              <Pressable
                key={`${item.code}-${item.description}`}
                onPress={() => {
                  setSelectedHsn(item)
                  setGstRate(String(item.gstRatePercent))
                  setHsnQuery(item.description)
                }}
                style={({ pressed }) => [styles.lookupRow, pressed && styles.lookupRowPressed]}
              >
                <Text style={styles.lookupCode}>
                  {item.code} · {item.gstRatePercent}%
                </Text>
                <Text style={styles.lookupDesc}>{item.description}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        <Text style={appStyles.label}>{t(lang, 'gstRate')}</Text>
        <View style={styles.rateRow}>
          <View style={styles.rateChipsRow}>
            <ChipGroup
              value={RATE_CHIPS.includes(gstRate) ? gstRate : null}
              onChange={(v) => setGstRate(v)}
              options={RATE_CHIPS.map((r) => ({ value: r, label: `${r}%` }))}
            />
            <Pressable
              accessibilityLabel={t(lang, 'customRateA11y')}
              onPress={() => setCustomOpen(true)}
              style={({ pressed }) => [
                styles.plusChip,
                !RATE_CHIPS.includes(gstRate) ? styles.plusChipActive : null,
                pressed && styles.plusChipPressed,
              ]}
            >
              <Text style={[!RATE_CHIPS.includes(gstRate) ? styles.plusChipTextActive : styles.plusChipText]}>+</Text>
            </Pressable>
          </View>
          {!RATE_CHIPS.includes(gstRate) ? (
            <Text style={appStyles.helper}>
              {t(lang, 'customRate')}: {gstRate}%
            </Text>
          ) : null}
        </View>

        <Text style={appStyles.label}>{t(lang, 'addGst')} / {t(lang, 'removeGst')}</Text>
        <ChipGroup
          value={mode}
          onChange={(v) => setMode(v as CalcMode)}
          options={[
            { value: 'add', label: t(lang, 'addGst') },
            { value: 'remove', label: t(lang, 'removeGst') },
          ]}
        />

        <View style={{ height: spacing.md }} />

        <TextField
          label={t(lang, 'amountLabel')}
          hint={amountLabel}
          value={amountText}
          onChange={(v) => setAmountText(sanitizeNumberText(v))}
          keyboardType="numeric"
          prefix="₹"
          placeholder="0"
          editable={canCalculate}
        />
        {!canCalculate ? <Text style={styles.requiredHint}>Select an HSN/SAC row first to enable calculation.</Text> : null}

        <View style={appStyles.divider} />

        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>{t(lang, 'grandTotal')}</Text>
          <Text style={styles.resultAmount}>{formatIndianRupee(breakdown.total)}</Text>
          <View style={styles.miniGrid}>
            <View style={styles.miniRow}>
              <Text style={styles.miniKey}>{t(lang, 'base')}</Text>
              <Text style={styles.miniVal}>{formatIndianRupee(breakdown.taxableValue)}</Text>
            </View>
            {supplyType === 'intra' ? (
              <>
                <View style={styles.miniRow}>
                  <Text style={styles.miniKey}>CGST</Text>
                  <Text style={styles.miniVal}>{formatIndianRupee(breakdown.cgst)}</Text>
                </View>
                <View style={styles.miniRow}>
                  <Text style={styles.miniKey}>SGST</Text>
                  <Text style={styles.miniVal}>{formatIndianRupee(breakdown.sgst)}</Text>
                </View>
              </>
            ) : (
              <View style={styles.miniRow}>
                <Text style={styles.miniKey}>IGST</Text>
                <Text style={styles.miniVal}>{formatIndianRupee(breakdown.igst)}</Text>
              </View>
            )}
            <View style={styles.miniRow}>
              <Text style={styles.miniKey}>{t(lang, 'totalGst')}</Text>
              <Text style={styles.miniVal}>{formatIndianRupee(breakdown.totalGst)}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: spacing.md }} />
        <View style={styles.actions}>
          <Button label={t(lang, 'copySummary')} variant="secondary" onPress={() => void onCopy()} disabled={!canCalculate} />
          <Button label={t(lang, 'share')} onPress={() => void onShare()} disabled={!canCalculate} />
        </View>
        <View style={{ height: spacing.sm }} />
        <Button label={t(lang, 'saveHistory')} variant="secondary" onPress={() => void onSaveManual()} disabled={!canCalculate} />
        <Text style={[appStyles.helper, { marginTop: spacing.sm }]}>{t(lang, 'disclaimerShort')}</Text>
      </View>

      <Modal visible={customOpen} animationType="fade" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={appStyles.sectionTitle}>{t(lang, 'customRate')}</Text>
            <TextField label={t(lang, 'gstRate')} value={gstRate} onChange={(v) => setGstRate(sanitizeNumberText(v))} keyboardType="numeric" placeholder="18" />
            <View style={{ height: spacing.md }} />
            <Button label={t(lang, 'done')} onPress={() => setCustomOpen(false)} />
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bg,
  },
  statesRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  statesText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
  },
  changeLink: {
    color: colors.accent,
    fontWeight: '900',
    fontSize: typography.small,
  },
  lookupList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  lookupRow: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lookupRowPressed: {
    opacity: 0.85,
  },
  lookupCode: {
    color: colors.text,
    fontWeight: '900',
    fontSize: typography.small,
  },
  lookupDesc: {
    color: colors.textMuted,
    marginTop: 2,
    fontSize: typography.small,
    fontWeight: '600',
  },
  rateRow: {
    marginBottom: spacing.sm,
  },
  rateChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
  },
  plusChip: {
    backgroundColor: colors.chip,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusChipActive: {
    backgroundColor: colors.chipActive,
    borderColor: colors.chipActive,
  },
  plusChipPressed: {
    opacity: 0.86,
  },
  plusChipText: {
    color: colors.text,
    fontWeight: '900',
    fontSize: 18,
  },
  plusChipTextActive: {
    color: colors.chipTextActive,
    fontWeight: '900',
    fontSize: 18,
  },
  resultCard: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: 16,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultLabel: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '800',
  },
  resultAmount: {
    color: colors.text,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.4,
    marginTop: spacing.xs,
  },
  miniGrid: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  miniRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  miniKey: {
    color: colors.textMuted,
    fontWeight: '800',
    fontSize: typography.small,
  },
  miniVal: {
    color: colors.text,
    fontWeight: '900',
    fontSize: typography.small,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  requiredHint: {
    color: colors.warning,
    fontSize: typography.small,
    fontWeight: '700',
    marginTop: -2,
    marginBottom: spacing.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  modalCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
})
