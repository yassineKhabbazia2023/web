import type { PToolboxItemProps } from '../../atoms/PToolboxItem/PToolboxItemTypes'

export interface PToolboxProps {
  pElements: Array<PToolboxItemProps>
  pPlacement?: 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
  pElementsTestId?: string
  pPopperClass?: string
  pCoordinates?: Coordinates
}

export interface Coordinates {
  x: number
  y: number
}