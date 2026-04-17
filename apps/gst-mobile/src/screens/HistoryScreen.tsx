import * as Clipboard from 'expo-clipboard'
import { useMemo, useState } from 'react'
import { Pressable, ScrollView, Share, StyleSheet, Text, TextInput, View } from 'react-native'
import { Button } from '@/src/components/ui/Button'
import type { HistoryEntry } from '@/src/context/HistoryContext'
import { getHistoryRowDisplay } from '@/src/lib/historyDisplay'
import { appStyles } from '@/src/theme/styles'
import { colors, spacing, typography } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'

function parseYmd(s: string) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim())
  if (!m) return null
  return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])).getTime()
}

export function HistoryScreen(props: {
  entries: HistoryEntry[]
  onClear: () => Promise<void>
}) {
  const { language } = useAppSettings()
  const lang = language
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [openId, setOpenId] = useState<string | null>(null)

  const kindLabels = useMemo(
    () => ({ calc: t(lang, 'historyKindCalc'), invoice: t(lang, 'historyKindInvoice') }),
    [lang],
  )

  const filtered = useMemo(() => {
    const fromTs = from ? parseYmd(from) : null
    const toTs = to ? parseYmd(to) : null
    const end = toTs !== null ? toTs + 86400000 - 1 : null
    return props.entries.filter((e) => {
      if (fromTs !== null && e.createdAt < fromTs) return false
      if (end !== null && e.createdAt > end) return false
      return true
    })
  }, [from, props.entries, to])

  async function onCopy(text: string) {
    await Clipboard.setStringAsync(text)
  }

  async function onShare(text: string) {
    await Share.share({ message: text })
  }

  return (
    <ScrollView contentContainerStyle={styles.wrap} keyboardShouldPersistTaps="handled">
      <View style={appStyles.card}>
        <View style={styles.headerRow}>
          <Text style={appStyles.sectionTitle}>{t(lang, 'historyTitle')}</Text>
          <Button label={t(lang, 'clearAll')} variant="ghost" onPress={props.onClear} disabled={props.entries.length === 0} />
        </View>

        <Text style={appStyles.helper}>
          {t(lang, 'filterDate')} (YYYY-MM-DD)
        </Text>
        <View style={styles.filterRow}>
          <TextInput
            value={from}
            onChangeText={setFrom}
            placeholder={t(lang, 'dateFromPlaceholder')}
            placeholderTextColor={colors.textMuted}
            style={styles.filterInput}
          />
          <TextInput
            value={to}
            onChangeText={setTo}
            placeholder={t(lang, 'dateToPlaceholder')}
            placeholderTextColor={colors.textMuted}
            style={styles.filterInput}
          />
        </View>

        {filtered.length === 0 ? (
          <Text style={appStyles.helper}>{t(lang, 'historyEmpty')}</Text>
        ) : (
          <View style={{ gap: spacing.md }}>
            {filtered.map((entry) => {
              const expanded = openId === entry.id
              const row = getHistoryRowDisplay(entry, kindLabels)
              return (
                <View key={entry.id} style={styles.card}>
                  <Pressable onPress={() => setOpenId(expanded ? null : entry.id)}>
                    <View style={styles.rowTop}>
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>{row.kindBadge}</Text>
                      </View>
                      <Text style={styles.grandTotal}>{row.grandTotalLabel}</Text>
                    </View>
                    <Text style={styles.when}>
                      {t(lang, 'historyColDate')}: {row.dateLabel}
                    </Text>
                    <Text style={styles.summaryLine}>
                      {t(lang, 'historyColAmount')}: {row.amountLabel} · {t(lang, 'historyColRate')}: {row.gstRateLabel}
                    </Text>
                  </Pressable>
                  {expanded ? <Text style={styles.mono}>{entry.body}</Text> : null}
                  <View style={styles.actions}>
                    <Button label={t(lang, 'copySummary')} variant="secondary" onPress={() => void onCopy(entry.body)} />
                    <Button label={t(lang, 'share')} onPress={() => void onShare(entry.body)} />
                  </View>
                </View>
              )
            })}
          </View>
        )}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bg,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.text,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.lg,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  badge: {
    backgroundColor: colors.chipActive,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: colors.chipTextActive,
    fontWeight: '900',
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  grandTotal: {
    color: colors.text,
    fontWeight: '900',
    fontSize: typography.h2,
    flex: 1,
    textAlign: 'right',
  },
  when: {
    color: colors.textMuted,
    fontSize: typography.small,
    fontWeight: '700',
    marginBottom: 4,
  },
  summaryLine: {
    color: colors.text,
    fontSize: typography.small,
    fontWeight: '800',
    marginBottom: spacing.sm,
  },
  mono: {
    color: colors.text,
    fontSize: typography.mono,
    fontWeight: '700',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
})
