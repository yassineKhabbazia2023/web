import { ElNotification } from 'element-plus'
import type { NotificationPosition, PNotificationProps } from './PNotificationTypes'
import type { IconName } from '../../types/IconName.types'
import { getIconComponent } from '../../utils/iconHelper'

export function PNotification(props: PNotificationProps) {
  const {
    title,
    message,
    iconName,
    showClose,
    customClass,
    position,
    duration,
    onClose,
    onClick,
  } = props

  const iconComponent = iconName
    ? getIconComponent(iconName)
    : undefined

  return ElNotification({
    title,
    message,
    icon: iconComponent,
    showClose,
    customClass,
    position,
    duration,
    onClose,
    onClick,
  })
}

/**
 * Function that simplifies the display of success, error and warning notifications
 */
export const displayNotification = (
  type: 'success' | 'error' | 'warning',
  message: string,
  position: NotificationPosition = 'bottom-right',
  duration: number = 3000,
) => {
  let iconName: IconName

  switch (type) {
    case 'success':
      iconName = 'check'
      break
    case 'warning':
      iconName = 'exclamationTriangle'
      break
    case 'error':
    default:
      iconName = 'exclamationTriangle'
      break
  }

  PNotification({
    message,
    iconName,
    showClose: true,
    customClass: type,
    position,
    duration,
  })
}
