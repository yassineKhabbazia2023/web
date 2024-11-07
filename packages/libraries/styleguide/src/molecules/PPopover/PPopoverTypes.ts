import type { PlacementOptions } from '@styleguide/constants/placementOptions'
import type { TriggerOptionsType } from '@styleguide/constants/triggerOptions'

export interface PPopoverProps {
  pPlacement?: PlacementOptions
  pDisabled?: boolean
  pShowArrow?: boolean
  pTrigger: TriggerOptionsType
  pTitle: string
}
