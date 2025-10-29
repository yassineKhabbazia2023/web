import type { IconName } from '@pulse/styleguide/types'

export interface DeploymentStatus {
  text: string
  color: string
  iconName: IconName
}

export interface WalletData {
  owner: {
    contactId: number
    firstName: string
    lastName: string
    email: string | null
    initials: string | undefined
    avatarColor: string
  }
  city: string
  hub: string
  deploymentStatus: DeploymentStatus
  id: string
  accountId: number
  accountNumber: string
  name: string
  isFavorite: boolean
  isCustomerRelation: boolean
}
