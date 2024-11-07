import type { Component } from 'vue'

export interface PTimelineItemProps {
  pTimestamp?: string
  pHideTimestamp?: boolean
  pCenter?: boolean
  pPlacement?: 'top' | 'bottom'
  pType?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  pColor?: 'hsl' | 'hsv' | 'hex' | 'rgb'
  pSize?: 'normal' | 'large'
  pIcon?: Component | string
  pHollow?: boolean
}
