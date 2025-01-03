import type { Component } from 'vue'
import type { IconName } from '../../types/IconName.types'

export interface PNotificationProps {
  title?: string
  message?: string
  iconName?: IconName
  showClose?: boolean
  customClass?: string
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
  duration?: number
  onClose?: () => void
  onClick?: () => void
}
