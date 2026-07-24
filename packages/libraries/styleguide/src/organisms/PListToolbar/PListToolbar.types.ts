export interface PListToolbarProps {
  pFilterLabel: string
  pFilterCount?: number
  pResetLabel: string
  pDeselectLabel: string
  pSelectedCount?: number
  pHasResultsBar?: boolean
  pTestId?: string
}

export interface PListToolbarEmits {
  (event: 'open-filters'): void
  (event: 'clear-filters'): void
  (event: 'clear-selection'): void
}
