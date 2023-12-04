import type { AutocompleteFetchSuggestions } from "element-plus";

export interface PAutocompleteProps {
  pPlaceholder: string,
  pClearable: boolean,
  pDisabled: boolean,
  pValueKey: string,
  pDebounce: number,
  pPlacement: 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end',
  pFetchSuggestion: AutocompleteFetchSuggestions,
  pTriggerOnFocus: boolean,
  pSelectWhenUnmatched: boolean,
  pName: string,
  pLabel: string,
  pHideLoading: boolean,
  pPopperClass: string,
  pTeleported: boolean,
  pHighlightFirstItem: boolean,
  pFitInputWidth: boolean
}