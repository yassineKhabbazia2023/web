import type { NotificationAccount } from '@app/modules/FeedCenter/types/notification-account.type'


export enum NotificationKindEnum {
  Delegation = 'Delegation-AddDelegation'
  // More notificationKind to come in the future #StayTuned
}

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


export enum SelectedNotificationEnum {
  ALL = 'all-notifications',
  UNREAD = 'unread-notifications'
}


