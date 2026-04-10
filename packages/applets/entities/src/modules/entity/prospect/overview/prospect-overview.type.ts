import type { PROSPECT_OVERVIEW_TAB_ROUTE_NAMES } from './prospect-overview.const'

export type ProspectTabName = typeof PROSPECT_OVERVIEW_TAB_ROUTE_NAMES[number]

export interface ProspectTab {
  name: ProspectTabName
  title: string
}
