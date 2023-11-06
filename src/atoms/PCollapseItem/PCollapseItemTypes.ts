import { type Component } from 'vue'

export interface PCollapseItemTypes {
  pType: 'default' | 'shadow' | 'alert'
  pTitleCollapseItem: string
  pIcon?: Component | string
}
