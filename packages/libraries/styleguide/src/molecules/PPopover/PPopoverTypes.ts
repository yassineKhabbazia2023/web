import type { PlacementOptions } from '../../constants/placementOptions'
import type { TriggerOptionsType } from '../../constants/triggerOptions'

export interface PPopoverProps {
  pPlacement?: PlacementOptions
  pDisabled?: boolean
  pShowArrow?: boolean
  pTrigger: TriggerOptionsType
  pTitle: string
  /** Width of the panel, in pixels as a number or as any CSS length */
  pWidth?: string | number
  pTestId?: string
}
