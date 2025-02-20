import { commonApi as api } from '@pulse/common'
import type {
  FeedCenterNotification,
  UnreadNotificationCountResponse,
  FetchNotificationsResponse,
} from '@app/modules/FeedCenter/types/notification.type'

const NOTIFICATION_API_PREFIX = 'feedcenter/api/notifications'
const NOTIFICATION_API_PARAMS = {
  params: {
    deviceType: 'desktop',
  },
}

export async function fetchUnreadNotificationsCount(): Promise<UnreadNotificationCountResponse> {
  const { data } = await api().gateway.get(
    `${NOTIFICATION_API_PREFIX}/currentuser/unread/count`,
    NOTIFICATION_API_PARAMS,
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
export async function patchAllNotificationsReadStatus(userId: number) {
  const requestBody = {
    notificationReceiverId: userId,
    deviceType: 'desktop',
  }
  await api().gateway.put(`${NOTIFICATION_API_PREFIX}/read/currentUser`, requestBody)
}
