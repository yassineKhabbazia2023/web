import type { PButtonProps } from '../../atoms/PButton/PButtonTypes'
import type { PToolboxItemProps } from '../../atoms/PToolboxItem/PToolboxItemTypes'
import type { PToolboxProps } from '../PToolbox/PToolboxTypes'

export interface PToolboxButtonProps extends PButtonProps {
  pElements?: PToolboxItemProps[]
  pTrigger?: 'click' | 'hover'
  pPlacement?: PToolboxProps['pPlacement']
  pElementsTestId?: string
}
