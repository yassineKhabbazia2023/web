import type { NotificationAccount } from '@app/modules/FeedCenter/types/notification-account.type'

/* eslint-disable no-unused-vars */
export enum NotificationKindEnum {
  Delegation = 'Delegation-AddDelegation'
  // More notificationKind to come in the future #StayTuned
}
/* eslint-enable no-unused-vars */
export interface FeedCenterNotification {
  id: number
  message: string
  createdAt: string
  notificationType: NotificationKindEnum
  accounts: NotificationAccount[]
  isRead: boolean
}

export interface UnreadNotificationCountResponse {
  count: number
}

export interface FetchNotificationsResponse {
  notifications: FeedCenterNotification[]
}

/* eslint-disable no-unused-vars */
export enum SelectedNotificationEnum {
  ALL = 'all-notifications',
  UNREAD = 'unread-notifications'
}
/* eslint-enable no-unused-vars */

