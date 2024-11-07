import type { Component } from 'vue'
import type { PTooltipProps } from '@/atoms/PTooltip/PTooltipTypes'

export interface PTabPaneProps {
  pLabel?: string
  pDisabled?: boolean
  pName?: string | number
  pClosable?: boolean
  pLazy?: boolean
  pTabIcon?: Component | string
  pTooltip?: PTooltipProps
}
