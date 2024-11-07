import type { PlacementOptions } from '@/constants/placementOptions'
import type { Placement } from 'element-plus'

export interface PPopperContentProps {
  pBoundariesPadding?: number
  pFallbackPlacements?: Placement[]
  pGpuAcceleration?: boolean
  pOffset?: number
  pPlacement?: PlacementOptions
  pPopperOptions?: {}
  pStrategy?: 'fixed' | 'absolute'
}
