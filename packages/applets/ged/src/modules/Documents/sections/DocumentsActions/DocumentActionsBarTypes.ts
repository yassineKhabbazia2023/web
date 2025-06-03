export interface DocumentActionsBarProps {
  permissions: string[]
  isAnyDocumentSelected: boolean
  isCurrentServiceReadOnly: boolean
  isTransmitDocumentsLoading?: boolean
  isSearchShrinkable?: boolean
  isSearchOpen?: boolean
  hasFiltersEnabled: boolean
}
