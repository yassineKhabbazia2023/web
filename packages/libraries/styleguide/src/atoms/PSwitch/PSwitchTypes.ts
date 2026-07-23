import type { Component } from 'vue'

export type PSwitchValue = boolean | string | number

export interface PSwitchProps {
  pDisabled?: boolean
  pLoading?: boolean
  pSize?: '' | 'large' | 'default' | 'small'
  pWidth?: number | string
  pInlinePrompt?: boolean
  pActiveIcon?: string | Component
  pInactiveIcon?: string | Component
  pActiveActionIcon?: string | Component
  pInactiveActionIcon?: string | Component
  pActiveText?: string
  pInactiveText?: string
  pActiveValue?: PSwitchValue
  pInactiveValue?: PSwitchValue
  pActiveColor?: string
  pInactiveColor?: string
  pBorderColor?: string
  pName?: string
  pValidateEvent?: boolean
  pBeforeChange?: () => Promise<boolean> | boolean
  pId?: string
  pTabIndex?: string | number
  pLabel?: string
  pTestId?: string
}
