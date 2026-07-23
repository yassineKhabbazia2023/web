export interface PAutocompleteProps {
  pPlaceholder?: string
  pClearable?: boolean
  pDisabled?: boolean
  pValueKey?: string
  pDebounce?: number
  pMinLength?: number
  pPlacement?: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end'
  pFetchSuggestions?: (
    _queryString: string,
    _callback: (_data: Record<string, any>[]) => void,
  ) => void
  pTriggerOnFocus?: boolean
  pSelectWhenUnmatched?: boolean
  pName?: string
  pLabel?: string
  pHideLoading?: boolean
  pPopperClass?: string
  pTeleported?: boolean
  pHighlightFirstItem?: boolean
  pFitInputWidth?: boolean
  pTestId?: string
}
