import { ElNotification } from 'element-plus'
import type { NotificationPosition, PNotificationProps } from './PNotificationTypes'
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
 * Function that simplifies the display of success and error notifications
 */
export const displayNotification = (
  type: 'success' | 'error',
  message: string,
  position: NotificationPosition = 'bottom-right',
  duration: number = 3000,
) => {
  PNotification({
    message,
    iconName: type === 'success' ? 'check' : 'x',
    showClose: true,
    customClass: type,
    position,
    duration,
  })
}
