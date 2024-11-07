import type { PlacementOptions } from '@/constants/placementOptions'
import type { TriggerOptionsType } from '@/constants/triggerOptions'

export interface PPopoverProps {
  pPlacement?: PlacementOptions
  pDisabled?: boolean
  pShowArrow?: boolean
  pTrigger: TriggerOptionsType
  pTitle: string
}
