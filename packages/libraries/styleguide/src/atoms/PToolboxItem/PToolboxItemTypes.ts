import type { Component } from 'vue'
import type { PlacementOptions } from '../../constants/placementOptions'

export interface PToolboxItemProps {
  pValue: string
  pIconName?: Component | string
  disabled?: boolean
  pActionName?: string
  pState?: 'default' | 'danger'
  pContentTooltip?: string
  pPlacementTooltip?: PlacementOptions
}
