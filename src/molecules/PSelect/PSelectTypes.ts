import type { PlacementOptions } from '@/constants/placementOptions'
import type { Component } from 'vue'

export interface PSelectProps {
  pMultiple?: boolean
  pDisabled?: boolean
  pValueKey?: string
  pSize?: '' | 'large' | 'default' | 'small'
  pClearable?: boolean
  pCollapseTags?: boolean
  pCollapseTagsTooltip?: boolean
  pMultipleLimit?: number
  pName?: string
  pEffect?: string | 'dark' | 'light'
  pAutocomplete?: string
  pPlaceholder?: string
  pFilterable?: boolean
  pAllowCreate?: boolean
  pFilterMethod?: () => void
  pRemote?: boolean
  pRemoteMethod?: () => void
  pRemoteShowSuffix?: boolean
  pLoading?: boolean
  pLoadingText?: string
  pNoMatchText?: string
  pNoDataText?: string
  pPoppperClass?: string
  pReserveKeyword?: boolean
  pDefaultFirstOption?: boolean
  pTeleported?: boolean
  pPersistent?: boolean
  pAutomaticDropdown?: boolean
  pClearIcon?: string | Component
  pFitInputWidth?: boolean
  pSuffixIcon?: string | Component
  pSuffixTransition?: boolean
  pTagType?: '' | 'success' | 'info' | 'warning' | 'danger'
  pValidateEvent?: boolean
  pPlacement?: PlacementOptions
  pMaxCollapseTags?: number
  pPopperOptions?: {}
  pAriaLabel?: string
}
