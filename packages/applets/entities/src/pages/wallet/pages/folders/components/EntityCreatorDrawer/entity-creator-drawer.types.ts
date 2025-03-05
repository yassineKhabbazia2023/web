import type { UserInfo } from '@pulse/common/types'

export interface OnboardingDetails {
  accountNumber: string
  accountLegalName: string
  email: string
  siret: string
  contactFirstName: string
  contactLastName: string
  signatory: boolean
  collaboratorGuids: string[]
}

export interface EntityCreatorDrawerProps {
  modelValue: boolean
  currentUser: UserInfo
}
