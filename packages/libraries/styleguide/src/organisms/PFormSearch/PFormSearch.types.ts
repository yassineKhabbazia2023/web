export interface PFormSearchProps {
  pSearchInvalidMessage: string
  pMinLength?: number
  pSearch?: string
  pPlaceholder?: string
  pAutofocus?: boolean
  pDebounceDelay?: number
  pClearable?: boolean
  pDisabled?: boolean
  pSize?: 'large' | 'default' | 'small'
}
