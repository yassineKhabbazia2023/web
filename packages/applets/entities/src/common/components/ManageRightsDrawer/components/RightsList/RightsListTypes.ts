import type { ContactType } from '@/services/contact/contactTypes'
import type { AuthorizationState } from '../../ManageRightsTypes'

interface Category {
  code: string
  label: string
}

export interface Action {
  actionId: number
  code: string
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
  contactId?: number
  accountId?: number
  modelValue: Record<string, AuthorizationState>
  isAccountRights?: boolean
  contactType?: ContactType
}
