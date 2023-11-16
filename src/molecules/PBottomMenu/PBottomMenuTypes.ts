import type { Component } from 'vue'

export interface PItem {
  pName: string
  pPath: string
  pComponent: Component
  pIcon: string
}

export interface PBottomMenuProps {
  pHideOnDesktop?: boolean
  pUseRouter?: boolean
  pItems: PItem[]
}
