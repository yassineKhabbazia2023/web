import {
  PICheck,
  PIExclamationTriangle,
  PIDownload,
  PNotification,
} from '@pulse/styleguide'
import type { NotificationType, NotificationHandle } from './notificationTypes'

const ICONS_BY_TYPE = {
  success: PICheck,
  error: PIExclamationTriangle,
  downloading: PIDownload,
}

export function showNotification(
  messagesByType: Record<NotificationType, string>,
  type: NotificationType,
  notificationInstance?: NotificationHandle,
) {
  notificationInstance?.close()

  const duration = type === 'downloading' ? 0 : undefined

  const notification = PNotification({
    showClose: true,
    customClass: type,
    message: messagesByType?.[type] ?? '',
    icon: ICONS_BY_TYPE[type],
    position: 'bottom-right',
    duration,
  })

  return notification
}
