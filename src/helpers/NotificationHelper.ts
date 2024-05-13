import {
  PICheck,
  PILoader,
  PIExclamationTriangle,
  PNotification,
} from '@kpmg/styleguide'
import type { NotificationMessagesByType, NotificationHandle } from './NotificationHelperTypes'

const ICONS_BY_TYPE = {
  loading: PILoader,
  success: PICheck,
  error: PIExclamationTriangle,
  downloading: PILoader,
}

export function showNotification(
  messagesByType: NotificationMessagesByType | undefined,
  type: 'loading' | 'success' | 'error' | 'downloading',
  previousNotification?: NotificationHandle,
) {
  previousNotification?.close()

  const duration = type === 'loading' ? 0 : undefined

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
