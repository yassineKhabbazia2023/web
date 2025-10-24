import type { UnreadNotificationCountResponse } from '../../types/notification.type'

export interface FeedCenterDrawerProps {
  modelValue: boolean
  unreadNotificationsCount: UnreadNotificationCountResponse['count']
}
