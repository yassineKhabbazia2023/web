import type { UnreadNotificationCountResponse } from '@app/modules/FeedCenter/types/notification.type'

export interface HeaderProps {
  showCalendar: boolean
  showFeedCenter: boolean
  unreadNotificationsCount: UnreadNotificationCountResponse['count']
}
