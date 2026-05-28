import type { ApplyFiltersPayload, ThemeWithCategories } from '../../types/history.types'

export interface HistoryFiltersDrawerProps {
  themes: ThemeWithCategories[]
  selectedCategoryIds: number[]
  dateRange: [Date, Date] | null
}

export interface HistoryFiltersDrawerEmits {
  (event: 'apply', payload: ApplyFiltersPayload): void
  (event: 'reset'): void
}
