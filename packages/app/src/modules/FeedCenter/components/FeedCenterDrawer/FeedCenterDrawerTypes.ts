/* eslint-disable import/extensions */
import type { UnreadNotificationCountResponse } from '@app/modules/FeedCenter/types/notification.type'

export interface FeedCenterDrawerProps {
  modelValue: boolean
  unreadNotificationsCount: UnreadNotificationCountResponse['count']
}
