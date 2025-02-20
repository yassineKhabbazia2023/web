import type { UserInfo } from '@pulse/common/types'

export interface OnboardingDetails {
  accountNumber: string
  accountLegalName: string
  email: string
  contactFirstName: string
  contactLastMame: string
  signatory: boolean
  collaboratorGuids: string[]
}

export interface EntityCreatorDrawerProps {
  modelValue: boolean
  currentUser: UserInfo
}
