import type { RouteLocationRaw } from 'vue-router'
import { IconName } from '../../types/IconName.types'

export interface PMenuItemProps {
  pIndex?: string
  pRoute?: RouteLocationRaw
  pDisabled?: boolean
  pIconLeftName?: IconName
  pIconRightName?: IconName
}
