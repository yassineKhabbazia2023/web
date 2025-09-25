import type { NotificationAccount } from '@app/modules/FeedCenter/types/notification-account.type'
import { NotificationKindEnum } from '@pulse/common/enums'

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
  UNREAD = 'unread-notifications',
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

interface NotificationDomainSettingSave {
  notificationDefinitionId: number,
  feedcenterValue: boolean | null
  emailValue: boolean | null
}

export interface NotificationSettingsSavePayload {
  preferenceSettings: PreferenceSettings,
  domainSettings: NotificationDomainSettingSave[],
}
