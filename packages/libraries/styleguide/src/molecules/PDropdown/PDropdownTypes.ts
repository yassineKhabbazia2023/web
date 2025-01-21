import type { PlacementOptions } from '../../constants/placementOptions'

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
  pEffect?: 'dark' | 'light'
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
  pPopperClass?: string
  pReserveKeyword?: boolean
  pDefaultFirstOption?: boolean
  pTeleported?: boolean
  pPersistent?: boolean
  pAutomaticDropdown?: boolean
  pFitInputWidth?: boolean
  pSuffixTransition?: boolean
  pTagType?: '' | 'success' | 'info' | 'warning' | 'danger'
  pValidateEvent?: boolean
  pPlacement?: PlacementOptions
  pMaxCollapseTags?: number
  pPopperOptions?: object
  pAriaLabel?: string
}

export interface POptionProps {
  pValue: string | number | boolean | Record<string, any>
  pLabel?: string | number
  pDisabled?: boolean
}

export interface PDropdownOption extends POptionProps {
  pGroupLabel?: string
}

export interface PDropdownProps extends PSelectProps {
  modelValue?: any // temporarly
  pOptions: PDropdownOption[]
  pCheckAllLabel?: string
}

export interface DropdownGroup {
  label: string
  options: PDropdownOption[]
}
