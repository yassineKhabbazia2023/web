import type { IconName } from '../../types/IconName.types'

export interface PCollapseItemTypes {
  pType?: 'default' | 'shadow' | 'alert' | 'gray'
  pTitleCollapseItem: string
  pIconName?: IconName
  pFullBody?: boolean
}
