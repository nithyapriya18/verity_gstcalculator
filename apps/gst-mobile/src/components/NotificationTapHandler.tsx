import { useEffect, useRef } from 'react'
import { Alert, Linking } from 'react-native'
import { isNotificationsSupported } from '@/src/lib/reminders'
import { t } from '@/src/i18n/translations'
import { useAppSettings } from '@/src/context/AppSettingsContext'

const PORTAL = 'https://www.gst.gov.in/'

/**
 * PRD: tapping a filing reminder shows due info and a portal link.
 */
export function NotificationTapHandler() {
  if (!isNotificationsSupported) return null

  const { language } = useAppSettings()
  const lang = language
  const handled = useRef(new Set<string>())

  function present(response: any) {
    const id = response.notification.request.identifier
    if (handled.current.has(id)) return
    handled.current.add(id)
    const raw = response.notification.request.content.data as { url?: string } | undefined
    const url = typeof raw?.url === 'string' ? raw.url : PORTAL
    const title = response.notification.request.content.title ?? t(lang, 'remindersTitle')
    const body = response.notification.request.content.body ?? ''
    Alert.alert(title, body, [
      { text: t(lang, 'done'), style: 'cancel' },
      { text: t(lang, 'openPortal'), onPress: () => void Linking.openURL(url) },
    ])
  }

  useEffect(() => {
    let cancelled = false
    let sub: { remove: () => void } | null = null

    void (async () => {
      const Notifications = await import('expo-notifications')
      if (cancelled) return
      sub = Notifications.addNotificationResponseReceivedListener((response) => {
        present(response)
      })
      const r = await Notifications.getLastNotificationResponseAsync()
      if (!cancelled && r) present(r)
    })()

    return () => {
      cancelled = true
      sub?.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- present uses latest lang via closure when effect re-runs
  }, [lang])

  return null
}
