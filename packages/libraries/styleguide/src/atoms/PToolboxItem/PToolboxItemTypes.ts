import type { PlacementOptions } from '../../constants/placementOptions'
import type { IconName } from '../../types/IconName.types'

export interface PToolboxItemProps<ACTION_NAME = string> {
  pValue: string
  pIconName?: IconName
  disabled?: boolean
  pActionName?: ACTION_NAME
  pState?: 'default' | 'danger'
  pContentTooltip?: string
  pPlacementTooltip?: PlacementOptions
}
