import type { IconName } from '../../types/IconName.types'
export interface PTextProps {
  pIconName?: IconName
  pContent?: string
  pBold?: boolean
  pType: 'primary' | 'secondary' | 'drag'
  selected?: boolean
  disabled?: boolean
  pIsUnderlinedOnHover?: boolean
}
