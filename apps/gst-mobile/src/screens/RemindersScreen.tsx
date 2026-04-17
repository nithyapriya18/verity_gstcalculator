import { Linking, StyleSheet, Text, View } from 'react-native'
import { useEffect, useState } from 'react'
import { Button } from '@/src/components/ui/Button'
import { appStyles } from '@/src/theme/styles'
import { colors, spacing } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'
import { isNotificationsSupported, requestNotificationPermissions, rescheduleGstReminders } from '@/src/lib/reminders'

const PORTAL = 'https://www.gst.gov.in/'

export function RemindersScreen() {
  const { language, filingFrequency, setFilingFrequency } = useAppSettings()
  const lang = language
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (!isNotificationsSupported) return
    void (async () => {
      const ok = await requestNotificationPermissions()
      setEnabled(ok)
      if (ok) await rescheduleGstReminders(filingFrequency)
    })()
  }, [filingFrequency])

  async function onEnable() {
    if (!isNotificationsSupported) return
    const ok = await requestNotificationPermissions()
    setEnabled(ok)
    if (ok) await rescheduleGstReminders(filingFrequency)
  }

  return (
    <View style={styles.wrap}>
      <View style={appStyles.card}>
        <Text style={appStyles.sectionTitle}>{t(lang, 'remindersTitle')}</Text>
        <Text style={appStyles.helper}>{t(lang, 'remindersBody')}</Text>
        <View style={{ height: spacing.md }} />
        <Button
          label={t(lang, 'enableNotifications')}
          variant="secondary"
          onPress={() => void onEnable()}
          disabled={!isNotificationsSupported}
        />
        <Text style={[appStyles.helper, { marginTop: spacing.sm }]}>
          {!isNotificationsSupported
            ? t(lang, 'remindersExpoGoUnsupported')
            : enabled
              ? t(lang, 'remindersPermissionGranted')
              : t(lang, 'remindersPermissionNeeded')}
        </Text>
        <View style={{ height: spacing.lg }} />
        <Text style={appStyles.label}>{t(lang, 'filingFrequency')}</Text>
        <View style={{ height: spacing.sm }} />
        <Button
          label={t(lang, 'monthly')}
          variant={filingFrequency === 'monthly' ? 'primary' : 'secondary'}
          onPress={() => setFilingFrequency('monthly')}
        />
        <View style={{ height: spacing.sm }} />
        <Button
          label={t(lang, 'quarterly')}
          variant={filingFrequency === 'quarterly' ? 'primary' : 'secondary'}
          onPress={() => setFilingFrequency('quarterly')}
        />
        <View style={{ height: spacing.lg }} />
        <Button label={t(lang, 'openPortal')} onPress={() => void Linking.openURL(PORTAL)} />
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
})
