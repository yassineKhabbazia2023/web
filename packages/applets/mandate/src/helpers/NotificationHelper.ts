import { type IconName } from '@pulse/styleguide/types'
import { PNotification } from '@pulse/styleguide'
import type { NotificationMessagesByType, NotificationHandle } from './NotificationHelperTypes'

type NoticationsType = 'loading' | 'success' | 'error' | 'downloading'

const ICONS_BY_TYPE: Record<NoticationsType, IconName> = {
  loading: 'loaderGradient',
  success: 'check',
  error: 'exclamationTriangle',
  downloading: 'loaderGradient',
}

export function showNotification(
  messagesByType: NotificationMessagesByType | undefined,
  type: NoticationsType,
  autoClose: boolean,
  previousNotification?: NotificationHandle,
) {
  previousNotification?.close()

  const duration = autoClose ? undefined : 0

  const notification = PNotification({
    showClose: true,
    customClass: type,
    message: messagesByType?.[type] ?? '',
    iconName: ICONS_BY_TYPE[type],
    position: 'bottom-right',
    duration,
  })

  return notification
}
