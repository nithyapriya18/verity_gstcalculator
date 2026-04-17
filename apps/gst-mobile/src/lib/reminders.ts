import { isRunningInExpoGo } from 'expo'
import { Platform } from 'react-native'
import type { FilingFrequency } from '@/src/context/AppSettingsContext'

export const isNotificationsSupported = !isRunningInExpoGo()
type NotificationsModule = typeof import('expo-notifications')
let notificationsModulePromise: Promise<NotificationsModule> | null = null
let notificationsInitialized = false

async function getNotificationsModule() {
  if (!isNotificationsSupported) return null
  if (!notificationsModulePromise) notificationsModulePromise = import('expo-notifications')
  return notificationsModulePromise
}

async function initNotifications() {
  const Notifications = await getNotificationsModule()
  if (!Notifications) return null
  if (!notificationsInitialized) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    })
    notificationsInitialized = true
  }
  return Notifications
}

const CHANNEL = 'gst-reminders'

async function ensureAndroidChannel() {
  if (!isNotificationsSupported) return
  const Notifications = await initNotifications()
  if (!Notifications) return
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'GST filing reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }
}

export async function requestNotificationPermissions(): Promise<boolean> {
  if (!isNotificationsSupported) return false
  const Notifications = await initNotifications()
  if (!Notifications) return false
  await ensureAndroidChannel()
  const { status: existing } = await Notifications.getPermissionsAsync()
  if (existing === 'granted') return true
  const { status } = await Notifications.requestPermissionsAsync()
  return status === 'granted'
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(9, 0, 0, 0)
  return x
}

/** Next monthly GSTR-1 due (11th). */
export function nextGstr1Due(from = new Date()): Date {
  const y = from.getFullYear()
  const m = from.getMonth()
  const d = from.getDate()
  if (d < 11) return startOfDay(new Date(y, m, 11))
  return startOfDay(new Date(y, m + 1, 11))
}

/** Next monthly GSTR-3B due (20th). */
export function nextGstr3bDue(from = new Date()): Date {
  const y = from.getFullYear()
  const m = from.getMonth()
  const d = from.getDate()
  if (d < 20) return startOfDay(new Date(y, m, 20))
  return startOfDay(new Date(y, m + 1, 20))
}

function followingDue(prev: Date, kind: 'gstr1' | 'gstr3b'): Date {
  const day = kind === 'gstr1' ? 11 : 20
  const next = new Date(prev.getFullYear(), prev.getMonth(), day + 1)
  return kind === 'gstr1' ? nextGstr1Due(next) : nextGstr3bDue(next)
}

function upcomingDues(kind: 'gstr1' | 'gstr3b', count: number): Date[] {
  const fn = kind === 'gstr1' ? nextGstr1Due : nextGstr3bDue
  const out: Date[] = []
  let cursor = new Date()
  let due = fn(cursor)
  out.push(due)
  for (let i = 1; i < count; i++) {
    due = followingDue(due, kind)
    out.push(due)
  }
  return out
}

function addDays(d: Date, days: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + days)
  return x
}

export async function rescheduleGstReminders(freq: FilingFrequency) {
  if (!isNotificationsSupported) return
  const Notifications = await initNotifications()
  if (!Notifications) return
  await ensureAndroidChannel()
  await Notifications.cancelAllScheduledNotificationsAsync()

  const suffix = freq === 'quarterly' ? ' (verify quarterly dates on portal)' : ''
  const dates1 = upcomingDues('gstr1', 6)
  const dates3 = upcomingDues('gstr3b', 6)

  let id = 0
  const schedule = async (when: Date, title: string, body: string) => {
    if (when.getTime() <= Date.now()) return
    id += 1
    await Notifications.scheduleNotificationAsync({
      identifier: `gst-${id}`,
      content: {
        title,
        body: body + suffix,
        data: { url: 'https://www.gst.gov.in/' },
        ...(Platform.OS === 'android' ? { channelId: CHANNEL } : {}),
      },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: when },
    })
  }

  for (const due of dates1) {
    await schedule(addDays(due, -3), 'GSTR-1 due soon', `Due on ${due.toDateString()}. Open the GST portal to file.`)
    await schedule(due, 'GSTR-1 due today', 'Check GSTR-1 filing on the GST portal.')
  }
  for (const due of dates3) {
    await schedule(addDays(due, -3), 'GSTR-3B due soon', `Due on ${due.toDateString()}. Open the GST portal to file.`)
    await schedule(due, 'GSTR-3B due today', 'Check GSTR-3B filing on the GST portal.')
  }
}
