import type { Router } from 'vue-router'
// eslint-disable-next-line import/extensions
import type { FeedCenterNotification, SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'

export interface NotificationsWrapperProps {
  wrapperType: SelectedNotificationEnum
  notifications: FeedCenterNotification[]
  isLoading: boolean
}

export interface HandleNotificationActionParams {
  notification: FeedCenterNotification
  router: Router
}

export interface GetTimeSinceCreationParams {
  creationDate: string
  minuteSuffix: string
  hourSuffix: string
  daySuffix: string
  weekSuffix: string
}
