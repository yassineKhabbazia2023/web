import type { ContactType } from '@pulse/common/enums'
import type { AuthorizationState } from '../../ManageRightsTypes'
import type { Permission } from '@pulse/common/types'
import type { PDropdownOption } from '@pulse/styleguide/types'

interface Category {
  code: string
  label: string
}

export interface Action {
  actionId: number
  code: Permission
  name: string
  label: string
  enabled: boolean
}

// Model used to display rights in the drawer (includes category name)
export interface AuthorizationConfigMapped {
  category: Category
  actions: Action[]
}

// Model returned by the API
export interface AuthorizationConfig {
  category: string
  actions: Action[]
}

export interface RightsListProps {
  modelValue: Record<string, AuthorizationState>
  contactId?: number
  accountId?: number
  isAccountRights?: boolean
  contactType?: ContactType
  additionalOptionByActionCode?: Record<string, string>
  accountNumber?: string;
}

export interface ActionAdditionalInfo {
  actionCode: string
  content: string
}

export interface RightsListDropdown {
  isVisible: boolean
  placeholder: string
  options: PDropdownOption[]
}
