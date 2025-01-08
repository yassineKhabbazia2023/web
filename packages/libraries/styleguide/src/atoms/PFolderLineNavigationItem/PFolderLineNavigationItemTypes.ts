import { type IconName } from '../../types/IconName.types'

export interface PFolderLineNavigationItemProps {
  pSelected?: boolean
  pDisabled?: boolean
  pFolderName?: string
  pFolderId: number
  pHasArrow?: boolean
  pIconLeftName?: IconName
  pTooltipContent?: string
}
