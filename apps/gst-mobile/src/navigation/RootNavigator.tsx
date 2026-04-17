import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { useEffect } from 'react'
import { CalculatorScreen } from '@/src/screens/CalculatorScreen'
import { HistoryScreen } from '@/src/screens/HistoryScreen'
import { InvoiceScreen } from '@/src/screens/InvoiceScreen'
import { MoreMenuScreen } from '@/src/screens/MoreMenuScreen'
import { RemindersScreen } from '@/src/screens/RemindersScreen'
import { SettingsScreen } from '@/src/screens/SettingsScreen'
import type { MainTabParamList, MoreStackParamList } from '@/src/navigation/types'
import { colors } from '@/src/theme/tokens'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'
import { useHistory } from '@/src/context/HistoryContext'
import { exportHtmlAsPdf } from '@/src/lib/pdf'
import { isNotificationsSupported, rescheduleGstReminders } from '@/src/lib/reminders'

const Tab = createBottomTabNavigator<MainTabParamList>()
const MoreStack = createNativeStackNavigator<MoreStackParamList>()

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
  },
}

function HistoryRoute() {
  const { entries, clear } = useHistory()
  return <HistoryScreen entries={entries} onClear={clear} />
}

function MoreNavigator() {
  const { language } = useAppSettings()
  const lang = language
  return (
    <MoreStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '900' as const },
      }}
    >
      <MoreStack.Screen name="MoreMenu" component={MoreMenuScreen} options={{ headerShown: false }} />
      <MoreStack.Screen name="History" component={HistoryRoute} options={{ title: t(lang, 'historyTitle') }} />
      <MoreStack.Screen name="Reminders" component={RemindersScreen} options={{ title: t(lang, 'remindersTitle') }} />
      <MoreStack.Screen name="Settings" component={SettingsScreen} options={{ title: t(lang, 'settingsTitle') }} />
    </MoreStack.Navigator>
  )
}

function InvoiceRoute() {
  return <InvoiceScreen onExportPdf={exportHtmlAsPdf} />
}

export function RootNavigator() {
  const { language, filingFrequency, hydrated } = useAppSettings()
  const lang = language

  useEffect(() => {
    if (!hydrated || !isNotificationsSupported) return
    void rescheduleGstReminders(filingFrequency)
  }, [filingFrequency, hydrated])

  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
        }}
      >
        <Tab.Screen
          name="Calculate"
          component={CalculatorScreen}
          options={{ tabBarLabel: t(lang, 'tabCalculate'), tabBarIcon: () => null }}
        />
        <Tab.Screen
          name="Invoice"
          component={InvoiceRoute}
          options={{ tabBarLabel: t(lang, 'tabInvoice'), tabBarIcon: () => null }}
        />
        <Tab.Screen
          name="More"
          component={MoreNavigator}
          options={{ tabBarLabel: t(lang, 'tabMore'), tabBarIcon: () => null }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
