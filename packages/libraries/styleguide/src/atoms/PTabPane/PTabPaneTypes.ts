import type { Component } from 'vue'
import type { PTooltipProps } from '../../atoms/PTooltip/PTooltipTypes'
import type { IconName } from '../../types/IconName.types'

export interface PTabPaneProps {
  pLabel?: string
  pDisabled?: boolean
  pName?: string | number
  pClosable?: boolean
  pLazy?: boolean
  pTabIcon?: Component | string // don't use this deprecated props
  pIconName?: IconName
  pTooltip?: PTooltipProps
}
