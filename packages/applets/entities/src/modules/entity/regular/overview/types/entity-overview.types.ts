import { ENTITY_OVERVIEW_TAB_ROUTE_NAMES } from '../constants/entity-overview.constants'

export type TabName = typeof ENTITY_OVERVIEW_TAB_ROUTE_NAMES[number]

export interface Tab {
  name: TabName
  title: string
}
