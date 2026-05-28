import type { IconName } from '@pulse/styleguide/types'
import type { RouteLocationRaw } from 'vue-router'

export interface MobileUserMenuItemProps {
  label: string
  to?: RouteLocationRaw
  href?: string
  isAction?: boolean
  iconName?: IconName
}
