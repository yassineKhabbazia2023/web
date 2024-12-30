import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { IconName } from '../../types/IconName.types'

export interface PMenuItemProps {
  pIndex?: string | undefined
  pRoute?: RouteLocationRaw
  pDisabled?: boolean
  pLeftIcon?: Component | string
  pRightIcon?: Component | string
  pIconLeftName?: IconName
  pIconRightName?: IconName
}
