import type { PlacementOptions } from '../../constants/placementOptions'
import type { IconName } from '../../types/IconName.types'

export interface PToolboxItemProps {
  pValue: string
  pIconName?: IconName
  disabled?: boolean
  pActionName?: string
  pState?: 'default' | 'danger'
  pContentTooltip?: string
  pPlacementTooltip?: PlacementOptions
}
