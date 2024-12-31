import type { IconName } from '../../types/IconName.types'

export interface PItem {
  pName: string
  pPath: string
  pIconName: IconName
}

export interface PBottomMenuProps {
  pHideOnDesktop?: boolean
  pUseRouter?: boolean
  pItems: PItem[]
}
