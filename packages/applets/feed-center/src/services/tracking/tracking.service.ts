import { AmplitudeService } from '@pulse/common/services/amplitude'
import { SelectedNotificationEnum } from '../../types/notification.type'
import { NotificationKindEnum } from '@pulse/common/enums'
import {
  NotificationTrackingType,
  NotificationTrackingReadType,
  NotificationTrackingTab,
} from './tracking.types'

const mappingNotificationTrackingType: Record<NotificationKindEnum, NotificationTrackingType> = {
  [NotificationKindEnum.AccountingDocumentUploaded]: NotificationTrackingType.AccountingDocumentUploaded,
  [NotificationKindEnum.GSDocumentUploaded]: NotificationTrackingType.GSDocumentUploaded,
  [NotificationKindEnum.Delegation]: NotificationTrackingType.DELEGATION,
  [NotificationKindEnum.DelegationRequested]: NotificationTrackingType.DELEGATION,
  [NotificationKindEnum.DelegationRequestAccepted]: NotificationTrackingType.DELEGATION,
  [NotificationKindEnum.DelegationRequestRefused]: NotificationTrackingType.DELEGATION,
  [NotificationKindEnum.Mandate]: NotificationTrackingType.MANDATE,
  [NotificationKindEnum.ReportCustomerCreated]: NotificationTrackingType.REPORTING,
  [NotificationKindEnum.ReportCustomerUpdated]: NotificationTrackingType.REPORTING,
  [NotificationKindEnum.ReportCollabCreated]: NotificationTrackingType.REPORTING,
  [NotificationKindEnum.ReportCollabUpdated]: NotificationTrackingType.REPORTING,
  [NotificationKindEnum.PennylaneDocumentSyncCompleted]: NotificationTrackingType.PennylaneDocumentSyncCompleted,
}
const mappingNotificationTrackingTabs : Record<SelectedNotificationEnum, NotificationTrackingTab> = {
  [SelectedNotificationEnum.ALL]: NotificationTrackingTab.ALL,
  [SelectedNotificationEnum.UNREAD]: NotificationTrackingTab.UNREAD,
}

export function trackFeedcenterOpened() {
  AmplitudeService.track('Feedcenter opened')
}
export function trackNotificationsConsulted(notificationKind : NotificationKindEnum) {
  const notifType = mappingNotificationTrackingType[notificationKind]
  AmplitudeService.track('Feedcenter notifications consulted', {
    notification_type_consultation: notifType,
  })
}

export function trackNotificationMarkAsRead(readType : NotificationTrackingReadType) {
  AmplitudeService.track('Feedcenter notifications marked as read', {
    Marked_as_read_origin: readType,
  })
}

export function trackFeedCenterTabConsultation(selectedNotification : SelectedNotificationEnum) {
  const notificationTab = mappingNotificationTrackingTabs[selectedNotification]
  AmplitudeService.track('Feedcenter tabs selected', {
    feedcenter_tabs_consultation: notificationTab,
  })
}
