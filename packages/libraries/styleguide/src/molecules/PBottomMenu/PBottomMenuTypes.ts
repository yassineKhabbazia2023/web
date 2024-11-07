export interface PItem {
  pName: string
  pPath: string
  pIcon: string
}

export interface PBottomMenuProps {
  pHideOnDesktop?: boolean
  pUseRouter?: boolean
  pItems: PItem[]
}
