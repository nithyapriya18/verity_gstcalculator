import { Linking, StyleSheet, Switch, Text, View } from 'react-native'
import Constants from 'expo-constants'
import { Button } from '@/src/components/ui/Button'
import { ChipGroup } from '@/src/components/ui/ChipGroup'
import { StatePicker } from '@/src/components/ui/StatePicker'
import { TextField } from '@/src/components/ui/TextField'
import { appStyles } from '@/src/theme/styles'
import { colors, spacing } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings, type LanguageCode } from '@/src/context/AppSettingsContext'
import { sanitizeNumberText } from '@/src/lib/sanitize'

const PRIVACY_POLICY_URL = 'https://verity-studios.vercel.app/privacy'
const SUPPORT_URL = 'https://verity-studios.vercel.app/support'

export function SettingsScreen() {
  const {
    language,
    setLanguage,
    supplierState,
    customerState,
    setSupplierState,
    setCustomerState,
    defaultGstRate,
    setDefaultGstRate,
    autoSaveHistory,
    setAutoSaveHistory,
    filingFrequency,
    setFilingFrequency,
  } = useAppSettings()
  const lang = language

  const version = Constants.expoConfig?.version ?? '1.0.0'

  return (
    <View style={styles.wrap}>
      <View style={appStyles.card}>
        <Text style={appStyles.sectionTitle}>{t(lang, 'settingsTitle')}</Text>
        <Text style={appStyles.helper}>{t(lang, 'disclaimerShort')}</Text>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t(lang, 'defaultSupplierState')}</Text>
          <StatePicker label="" value={supplierState} onChange={setSupplierState} />
          <View style={{ height: spacing.sm }} />
          <Text style={styles.blockTitle}>{t(lang, 'defaultCustomerState')}</Text>
          <StatePicker label="" value={customerState} onChange={setCustomerState} />
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t(lang, 'defaultGstRate')}</Text>
          <TextField
            label="%"
            value={defaultGstRate}
            onChange={(v) => setDefaultGstRate(sanitizeNumberText(v))}
            keyboardType="numeric"
            placeholder="18"
          />
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t(lang, 'filingFrequency')}</Text>
          <ChipGroup
            value={filingFrequency}
            onChange={(v) => setFilingFrequency(v as 'monthly' | 'quarterly')}
            options={[
              { value: 'monthly', label: t(lang, 'monthly') },
              { value: 'quarterly', label: t(lang, 'quarterly') },
            ]}
          />
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t(lang, 'language')}</Text>
          <ChipGroup<LanguageCode>
            value={language}
            onChange={setLanguage}
            options={[
              { value: 'en', label: t(lang, 'english') },
              { value: 'hi', label: t(lang, 'hindi') },
            ]}
          />
        </View>

        <View style={[styles.rowBetween, styles.block]}>
          <Text style={styles.switchLabel}>{t(lang, 'autoSave')}</Text>
          <Switch value={autoSaveHistory} onValueChange={setAutoSaveHistory} />
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>Legal</Text>
          <Button label={t(lang, 'privacy')} variant="secondary" onPress={() => void Linking.openURL(PRIVACY_POLICY_URL)} />
          <View style={{ height: spacing.sm }} />
          <Button label={t(lang, 'support')} variant="secondary" onPress={() => void Linking.openURL(SUPPORT_URL)} />
        </View>

        <View style={styles.block}>
          <Text style={styles.blockTitle}>{t(lang, 'version')}</Text>
          <Text style={styles.value}>{version}</Text>
        </View>
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
  block: {
    marginTop: spacing.lg,
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  blockTitle: {
    color: colors.textMuted,
    fontWeight: '900',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontSize: 12,
  },
  value: {
    color: colors.text,
    fontWeight: '800',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  switchLabel: {
    flex: 1,
    color: colors.text,
    fontWeight: '800',
  },
})
