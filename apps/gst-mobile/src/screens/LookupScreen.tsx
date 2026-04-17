import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { useNavigation } from '@react-navigation/native'
import { useMemo, useState } from 'react'
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { HSN_SAC_ENTRIES, type HsnSacEntry } from '@/src/data/hsnSac'
import { searchHsn } from '@/src/lib/searchHsn'
import { appStyles } from '@/src/theme/styles'
import { colors, spacing, typography } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'
import type { MainTabParamList } from '@/src/navigation/types'

type LookupNav = BottomTabNavigationProp<MainTabParamList, 'Lookup'>

export function LookupScreen() {
  const navigation = useNavigation<LookupNav>()
  const { language, setPendingCalculatorGstRate } = useAppSettings()
  const lang = language
  const [q, setQ] = useState('')

  const results = useMemo(() => searchHsn(HSN_SAC_ENTRIES, q), [q])

  function onPick(entry: HsnSacEntry) {
    setPendingCalculatorGstRate(String(entry.gstRatePercent))
    navigation.navigate('Calculate')
  }

  return (
    <View style={styles.wrap}>
      <View style={appStyles.card}>
        <Text style={appStyles.sectionTitle}>{t(lang, 'lookupTitle')}</Text>
        <Text style={appStyles.helper}>{t(lang, 'tapAppliesRate')}</Text>
        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder={t(lang, 'lookupPlaceholder')}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {!q.trim() ? <Text style={appStyles.helper}>{t(lang, 'lookupEmpty')}</Text> : null}
        {q.trim() && results.length === 0 ? <Text style={appStyles.helper}>{t(lang, 'lookupNoResults')}</Text> : null}
        <FlatList
          data={results}
          keyExtractor={(item) => item.code + item.description}
          style={{ marginTop: spacing.md }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <Pressable onPress={() => onPick(item)} style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.code}>
                  {item.code} · {item.gstRatePercent}%
                </Text>
                <Text style={styles.desc}>{item.description}</Text>
              </View>
              <Text style={styles.chev}>›</Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
    backgroundColor: colors.bg,
  },
  input: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: typography.body,
    color: colors.text,
    fontWeight: '700',
    backgroundColor: colors.surface,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  rowPressed: { opacity: 0.85 },
  code: { color: colors.text, fontWeight: '900', fontSize: typography.small },
  desc: { color: colors.textMuted, marginTop: 4, fontWeight: '600', fontSize: typography.small },
  chev: { color: colors.textMuted, fontSize: 22, fontWeight: '900' },
})
