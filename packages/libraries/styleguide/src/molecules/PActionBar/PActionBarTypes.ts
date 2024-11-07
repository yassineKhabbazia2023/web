import type { PButtonProps } from '@styleguide/atoms/PButton/PButtonTypes'

export interface PButtonActionBarProps {
  pButton: PButtonProps
  pButtonName: string
  pButtonIcon: string
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
