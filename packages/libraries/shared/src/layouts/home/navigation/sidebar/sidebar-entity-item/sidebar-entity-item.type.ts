import type { RouteLocationRaw } from 'vue-router'
export interface SidebarEntityItemProps {
  tooltipContent: string
  tooltipDisabled: boolean
  route?: RouteLocationRaw
}
