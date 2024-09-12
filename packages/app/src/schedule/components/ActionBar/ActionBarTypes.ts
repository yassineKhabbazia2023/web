import type { ViewType } from '@app/schedule/models/commonTypes'

export interface ActionBarProps {
  modelValue: ViewType
  activeDate: Date
  isCollab: boolean
  searchTerm: string
  isSearchState: boolean
  activeFilters: number
}
