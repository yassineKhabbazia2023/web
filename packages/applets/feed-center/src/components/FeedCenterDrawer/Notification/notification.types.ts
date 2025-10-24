import type { FeedCenterNotification } from '../../../types/notification.type'

export interface NotificationProps {
  accountsNames: string[]
  elapsedTime: string
  id: number
  isRead: boolean
  message: string
  notificationType: FeedCenterNotification['notificationType']
}
