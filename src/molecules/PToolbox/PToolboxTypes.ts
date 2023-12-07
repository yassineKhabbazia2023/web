import type { PToolboxItemProps } from '@/atoms/PToolboxItem/PToolboxItemTypes'

export interface PToolboxProps {
  pElements: Array<PToolboxItemProps>
  pPlacement?: 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
}
