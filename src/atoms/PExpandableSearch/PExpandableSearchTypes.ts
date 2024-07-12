import type { PButtonProps } from '@/atoms/PButton/PButtonTypes'

export interface PExpandableSearchProps {
  pFocusOnExpand?: boolean
  pIsSearchOpen: boolean
  pIsSearchShrinkable?: boolean
  pMaxLength?: string | number
  pPlaceholder?: string
  pSearchContent?: string
  pType?: PButtonProps['pType']
}
