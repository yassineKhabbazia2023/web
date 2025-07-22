import type { UnreadNotificationCountResponse } from '@app/modules/FeedCenter/types/notification.type'

export interface HeaderProps {
  showFeedCenter: boolean
  unreadNotificationsCount: UnreadNotificationCountResponse['count']
}
