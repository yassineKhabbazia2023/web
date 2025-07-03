import type { NotificationAccount } from '@app/modules/FeedCenter/types/notification-account.type'


export enum NotificationKindEnum {
  Delegation = 'Delegation-AddDelegation',
  Mandate = 'Mandate-MandateStatusChanged',
  ReportCustomerCreated = 'Reporting-ReportCreatedCustomer',
  ReportCustomerUpdated = 'Reporting-ReportUpdatedCustomer',
  ReportCollabCreated = 'Reporting-ReportCreatedCollab',
  ReportCollabUpdated = 'Reporting-ReportUpdatedCollab',
  AccountingDocumentUploaded = 'Ged-AccountingDocumentUploaded',
  GSDocumentUploaded = 'Ged-GSDocumentUploaded',
}

export interface FeedCenterNotification {
  id: number
  message: string
  createdAt: string
  notificationType: NotificationKindEnum
  accounts: NotificationAccount[]
  isRead: boolean
  redirectLink?: string
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

interface PreferenceSettings {
  hasOnlyFavouritesDisplayed: boolean
}
export interface NotificationSetting {
  id: number
  label: string
  feedcenterValue: boolean | null
  emailValue: boolean | null
}

export interface NotificationDomainSettings {
  domain: string
  settings: NotificationSetting[]
}

export interface NotificationSettingsConfiguration {
  domainSettings: NotificationDomainSettings[]
  preferenceSettings: PreferenceSettings
}

export interface NotificationSettingSavePayload {
  notificationDefinitionId: number,
  feedCenterValue: boolean | null
}
