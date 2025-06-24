import type { FeedCenterNotification } from '@app/modules/FeedCenter/types/notification.type'

export interface NotificationProps {
  accountsNames: string[]
  elapsedTime: string
  id: number
  isRead: boolean
  message: string
  notificationType: FeedCenterNotification['notificationType']
}
