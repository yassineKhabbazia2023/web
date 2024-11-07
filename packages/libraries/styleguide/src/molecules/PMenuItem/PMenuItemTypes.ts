import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export interface PMenuItemProps {
  pIndex?: string | undefined
  pRoute?: RouteLocationRaw
  pDisabled?: boolean
  pLeftIcon?: Component | string
  pRightIcon?: Component | string
}
