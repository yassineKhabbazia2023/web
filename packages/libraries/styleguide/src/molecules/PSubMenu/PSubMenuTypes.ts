import type { Component } from 'vue'
import type { IconName } from '../../types/IconName.types'

export interface PSubMenuProps {
  pIndex: string
  pPopperClass?: string
  pPopperOffset?: number
  pShowTimeout?: number
  pHideTimeout?: number
  pDisabled?: boolean
  pIcon?: Component | string
  pIconName?: IconName
}
