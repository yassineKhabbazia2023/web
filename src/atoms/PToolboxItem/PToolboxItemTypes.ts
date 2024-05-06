import type { Component } from 'vue'

export interface PToolboxItemProps {
  pValue: string
  pIconName?: Component | string
  disabled?: boolean
  pActionName?: string
  pState?: 'default' | 'danger'
}
