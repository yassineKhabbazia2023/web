import type { Component } from 'vue'

export interface PSubMenuProps {
  pIndex: string
  pPopperClass?: string
  pPopperOffset?: number
  pShowTimeout?: number
  pHideTimeout?: number
  pDisabled?: boolean
  pIcon?: Component | string
}
