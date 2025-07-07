import { commonApi as api } from '@pulse/common'
import type {
  FeedCenterNotification,
  UnreadNotificationCountResponse,
  FetchNotificationsResponse,
  NotificationSettingsConfiguration,
  NotificationSettingsSavePayload,
} from '@app/modules/FeedCenter/types/notification.type'

const NOTIFICATION_API_PREFIX = 'feedcenter/api/notifications'
const SETTINGS_API_PREFIX = 'feedcenter/api/settings'
const NOTIFICATION_API_PARAMS = {
  params: {
    deviceType: 'desktop',
  },
}

export async function fetchUnreadNotificationsCount(): Promise<UnreadNotificationCountResponse> {
  const { data } = await api().gateway.get(
    `${NOTIFICATION_API_PREFIX}/currentuser/unread/count`,
    {
      params: {
        ...NOTIFICATION_API_PARAMS.params,
      },
    },
  )
  return { count: data }
}

export async function fetchNotifications(): Promise<FetchNotificationsResponse> {
  const { data } = await api().gateway.get(
    `${NOTIFICATION_API_PREFIX}/currentuser`,
    NOTIFICATION_API_PARAMS,
  )
  return { notifications: data }
}

export async function patchNotificationReadStatus(notificationId: FeedCenterNotification['id']) {
  const requestBody = {
    notificationId,
  }
  await api().gateway.put(`${NOTIFICATION_API_PREFIX}/read/currentUser`, requestBody)
}

export function patchAllNotificationsReadStatus(userId: number) {
  const requestBody = {
    notificationReceiverId: userId,
    deviceType: 'desktop',
  }
  return api().gateway.put(`${NOTIFICATION_API_PREFIX}/read/currentUser`, requestBody)
}

export async function getNotificationSettings() {
  const { data } = await api().gateway.get<NotificationSettingsConfiguration>(
    `${SETTINGS_API_PREFIX}/currentUser`,
    {
      ...NOTIFICATION_API_PARAMS,
    },
  )

  return data
}

export async function saveNotificationSettings(settingsToSave: NotificationSettingsSavePayload) {
  await api().gateway.post(
    `${SETTINGS_API_PREFIX}/currentUser`,
    settingsToSave,
  )
}
