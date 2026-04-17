import { StatusBar } from 'expo-status-bar'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { NotificationTapHandler } from '@/src/components/NotificationTapHandler'
import { HistoryProvider } from '@/src/context/HistoryContext'
import { RootNavigator } from '@/src/navigation/RootNavigator'
import { appStyles } from '@/src/theme/styles'
import { colors, spacing } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { AppSettingsProvider, useAppSettings } from '@/src/context/AppSettingsContext'

function Header() {
  const { language } = useAppSettings()
  const lang = language
  return (
    <View style={styles.header}>
      <Text style={appStyles.title}>{t(lang, 'appTitle')}</Text>
      <Text style={appStyles.subtitle}>{t(lang, 'appSubtitle')}</Text>
    </View>
  )
}

function AppInner() {
  return (
    <SafeAreaView style={appStyles.screen}>
      <StatusBar style="dark" />
      <NotificationTapHandler />
      <Header />
      <RootNavigator />
    </SafeAreaView>
  )
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppSettingsProvider>
        <HistoryProvider>
          <AppInner />
        </HistoryProvider>
      </AppSettingsProvider>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bg,
  },
})
