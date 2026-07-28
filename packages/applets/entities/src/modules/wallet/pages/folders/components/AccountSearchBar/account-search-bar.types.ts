export interface AccountSearchBarProps {
  searchValue?: string
  searchPlaceholder: string
  accountFiltersCount: number
  // With the wallet V2 the filter button lives in the results bar instead.
  hasFilterButton?: boolean
}
