import type { PlacementOptions } from '../../constants/placementOptions'

export interface PTooltipProps {
  pContent?: string
  disabled?: boolean
  pPlacement?: PlacementOptions
  pShowAfter?: number // ms
  pHideAfter?: number // ms
}
