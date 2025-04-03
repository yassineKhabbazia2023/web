import { commonApi as api } from '@pulse/common'
import type {
  FeedCenterNotification,
  UnreadNotificationCountResponse,
  FetchNotificationsResponse,
} from '@app/modules/FeedCenter/types/notification.type'
import type { Entity } from '@pulse/common/types'

const NOTIFICATION_API_PREFIX = 'feedcenter/api/notifications'
const NOTIFICATION_API_PARAMS = {
  params: {
    deviceType: 'desktop',
  },
}

export async function fetchUnreadNotificationsCount(accountIdsFilter: Entity['accountId'][] = []): Promise<UnreadNotificationCountResponse> {
  const { data } = await api().gateway.get(
    `${NOTIFICATION_API_PREFIX}/currentuser/unread/count`,
    {
      params: {
        ...NOTIFICATION_API_PARAMS.params,
        accountIds: accountIdsFilter,
      },
      paramsSerializer: {
        indexes: null,
      },
    },
  )
  return { count: data }
}

export async function fetchNotifications(accountIdsFilter: Entity['accountId'][] = []): Promise<FetchNotificationsResponse> {
  const { data } = await api().gateway.get(
    `${NOTIFICATION_API_PREFIX}/currentuser`,
    {
      params: {
        ...NOTIFICATION_API_PARAMS.params,
        accountIds: accountIdsFilter,
      },
      paramsSerializer: {
        indexes: null,
      },
    },
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
