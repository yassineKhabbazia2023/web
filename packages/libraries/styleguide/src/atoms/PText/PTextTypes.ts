import { type Component } from 'vue'
import type { IconName } from '../../types/IconName.types'
export interface PTextProps {
  pIcon?: Component | string
  pIconName?: IconName
  pContent?: string
  pBold?: boolean
  pType: 'primary' | 'secondary' | 'drag'
  selected?: boolean
  disabled?: boolean
}
