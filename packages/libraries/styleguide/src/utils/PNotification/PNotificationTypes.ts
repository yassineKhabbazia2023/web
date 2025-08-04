import type { IconName } from '../../types/IconName.types'

export type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'

export interface PNotificationProps {
  title?: string
  message?: string
  iconName?: IconName
  showClose?: boolean
  customClass?: string
  position?: NotificationPosition,
  duration?: number
  onClose?: () => void
  onClick?: () => void
}
