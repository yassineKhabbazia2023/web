import { amplitudeService } from '@pulse/common'
import { NotificationKindEnum, SelectedNotificationEnum } from '../../types/notification.type'
import {
  NotificationTrackingType,
  NotificationTrackingReadType,
  NotificationTrackingTab,
} from './tracking.types'

const mappingNotificationTrackingType: Record<NotificationKindEnum, NotificationTrackingType> = {
  [NotificationKindEnum.GED]: NotificationTrackingType.GED,
  [NotificationKindEnum.Delegation]: NotificationTrackingType.DELEGATION,
  [NotificationKindEnum.Mandate]: NotificationTrackingType.MANDATE,
  [NotificationKindEnum.ReportCustomerCreated]: NotificationTrackingType.REPORTING,
  [NotificationKindEnum.ReportCustomerUpdated]: NotificationTrackingType.REPORTING,
  [NotificationKindEnum.ReportCollabCreated]: NotificationTrackingType.REPORTING,
  [NotificationKindEnum.ReportCollabUpdated]: NotificationTrackingType.REPORTING,
}
const mappingNotificationTrackingTabs : Record<SelectedNotificationEnum, NotificationTrackingTab> = {
  [SelectedNotificationEnum.ALL]: NotificationTrackingTab.ALL,
  [SelectedNotificationEnum.UNREAD]: NotificationTrackingTab.UNREAD,
}

export function trackFeedcenterOpened() {
  amplitudeService.track('Feedcenter opened')
}
export function trackNotificationsConsulted(notificationKind : NotificationKindEnum){
  const notifType = mappingNotificationTrackingType[notificationKind]
  amplitudeService.track('Feedcenter notifications consulted', {
    notification_type_consultation: notifType,
  })
}

export function trackNotificationMarkAsRead(readType : NotificationTrackingReadType){
  amplitudeService.track('Feedcenter notifications marked as read', {
    Marked_as_read_origin: readType,
  })
}

export function trackFeedCenterTabConsultation(selectedNotification : SelectedNotificationEnum){
  const notificationTab = mappingNotificationTrackingTabs[selectedNotification]
  amplitudeService.track('Feedcenter tabs selected', {
    feedcenter_tabs_consultation: notificationTab,
  })
}
