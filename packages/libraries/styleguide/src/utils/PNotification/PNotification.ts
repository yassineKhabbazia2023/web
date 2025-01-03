import { ElNotification } from 'element-plus'
import { PNotificationProps } from './PNotificationTypes'
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
  })
}
