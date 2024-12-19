import { type Component } from 'vue'
import type { IconName } from '../../types/IconName.types'

export interface PCollapseItemTypes {
  pType?: 'default' | 'shadow' | 'alert' | 'gray'
  pTitleCollapseItem: string
  pIcon?: Component | string
  pIconName?: IconName
  pFullBody?: boolean
}
