import type { UnreadNotificationCountResponse } from '../FeedCenter/types/notification.type'

export interface HeaderProps {
  showFeedCenter: boolean
  unreadNotificationsCount: UnreadNotificationCountResponse['count']
}
