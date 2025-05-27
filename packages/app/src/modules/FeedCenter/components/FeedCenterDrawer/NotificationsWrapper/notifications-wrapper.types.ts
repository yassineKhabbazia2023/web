import type { Router } from 'vue-router'
import type { FeedCenterNotification, SelectedNotificationEnum } from '@app/modules/FeedCenter/types/notification.type'
import type { NotificationAccount } from '@app/modules/FeedCenter/types/notification-account.type'


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

export interface NotificationActionsMappingParams {
  accountIds: NotificationAccount['id'][],
  accountNumbers: NotificationAccount['accountNumber'][],
  router: Router,
  notification: FeedCenterNotification,
}
