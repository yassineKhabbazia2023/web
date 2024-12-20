import type { IconName } from '../../types/IconName.types'
export interface PTimelineItemProps {
  pTimestamp?: string
  pHideTimestamp?: boolean
  pCenter?: boolean
  pPlacement?: 'top' | 'bottom'
  pType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  pColor?: 'hsl' | 'hsv' | 'hex' | 'rgb'
  pSize?: 'normal' | 'large'
  pIconName?: IconName
  pHollow?: boolean
}
