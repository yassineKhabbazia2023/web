import { RouteName } from '@pulse/common/enums'

export const ENTITY_OVERVIEW_TAB_ROUTE_NAMES = [
  RouteName.USERS,
  RouteName.COLLAB,
  RouteName.OFFERS,
  RouteName.RYDGE_INVOICES,
  RouteName.INFO,
  RouteName.FOLDER_HISTORY,
  RouteName.DELEGATIONS_HISTORY,
] as const

export type TabName = typeof ENTITY_OVERVIEW_TAB_ROUTE_NAMES[number]

export interface Tab {
  name: TabName
  title: string
}
