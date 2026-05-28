import type { UserInfo } from '@pulse/common/types'

export interface OnboardingDetails {
  accountNumber: string
  accountLegalName: string
  email: string
  siret: string
  contactFirstName: string
  contactLastName: string
  isSignatory: boolean
  existingContactGuid?: string
  collaboratorGuids: string[]
  accountLeadGuid?: string
  masterGuid?: string
}

export interface EntityCreatorDrawerProps {
  modelValue: boolean
  currentUser: UserInfo
}
