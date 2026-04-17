import type { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { useNavigation } from '@react-navigation/native'
import { StyleSheet, Text, View } from 'react-native'
import { Button } from '@/src/components/ui/Button'
import type { MoreStackParamList } from '@/src/navigation/types'
import { appStyles } from '@/src/theme/styles'
import { colors, spacing } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'

type Nav = NativeStackNavigationProp<MoreStackParamList, 'MoreMenu'>

export function MoreMenuScreen() {
  const navigation = useNavigation<Nav>()
  const { language } = useAppSettings()
  const lang = language

  return (
    <View style={styles.wrap}>
      <View style={appStyles.card}>
        <Text style={appStyles.sectionTitle}>{t(lang, 'tabMore')}</Text>
        <Text style={appStyles.helper}>{t(lang, 'disclaimerShort')}</Text>
        <View style={{ height: spacing.md }} />
        <Button label={t(lang, 'moreHistory')} onPress={() => navigation.navigate('History')} />
        <View style={{ height: spacing.sm }} />
        <Button label={t(lang, 'moreReminders')} variant="secondary" onPress={() => navigation.navigate('Reminders')} />
        <View style={{ height: spacing.sm }} />
        <Button label={t(lang, 'moreSettings')} variant="secondary" onPress={() => navigation.navigate('Settings')} />
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
