import type { PButtonProps } from '../../atoms/PButton/PButtonTypes'
import type { IconName } from '../../types/IconName.types'

export interface PButtonActionBarProps {
  pButton: PButtonProps
  pButtonName: string
  pButtonIcon?: string
  pButtonIconName?: IconName
  pButtonActionName: string
}

type ComponentType = 'UPLOAD' | 'SEARCH'

export interface ComponentDefinitionProps extends PButtonActionBarProps {
  pComponentType?: ComponentType
  pMultiple?: boolean
  pIsSearchShrinkable?: boolean
  pIsSearchOpen?: boolean
}

export interface PActionBarProps {
  pRightSideButtons: ComponentDefinitionProps[]
  pLeftSideButtons: ComponentDefinitionProps[]
  pSearchMaxLength?: number
}
