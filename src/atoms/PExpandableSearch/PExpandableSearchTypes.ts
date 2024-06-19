import type { PButtonProps } from '@/atoms/PButton/PButtonTypes'

export interface PExpandableSearchProps {
  pType?: PButtonProps['pType']
  pSearchContent?: string
  pPlaceholder?: string
  pIsSearchShrinkable?: boolean
  pIsSearchOpen: boolean
  pFocusOnExpand?: boolean
}
