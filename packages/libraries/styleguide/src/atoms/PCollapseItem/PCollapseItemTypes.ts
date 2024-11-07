import { type Component } from 'vue'

export interface PCollapseItemTypes {
  pType?: 'default' | 'shadow' | 'alert' | 'gray'
  pTitleCollapseItem: string
  pIcon?: Component | string
  pFullBody?: boolean
}
