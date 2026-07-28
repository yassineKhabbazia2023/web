import type { IconName } from '@pulse/styleguide/types'
import type { AccountRow } from '@pulse/common/types'
import type { ProspectProgressStatus } from '@entities/modules/wallet/enums'
import { AccountType } from '@pulse/common/enums'

export interface DeploymentStatus {
  text: string
  color: string
  iconName: IconName
}

export interface WalletOwner {
  contactId: number
  firstName: string
  lastName: string
  email: string | null
  initials: string | undefined
  avatarColor?: string
}

interface WalletDataBase {
  owner: WalletOwner
  accountId: number
  accountNumber: string
  name: string
  isFavorite: boolean
}

export interface RegularWalletData extends WalletDataBase {
  city: string
  hub: string
  deploymentStatus: DeploymentStatus
  id: string
  isCustomerRelation: boolean
  lastActivityDate: string | null
}

export interface ProspectWalletData extends WalletDataBase {
  prospectId: number
  progressStatus: ProspectProgressStatus | null
  cacFolder: boolean
}

export type WalletData = RegularWalletData | ProspectWalletData

export type ProspectAccountRow = Pick<AccountRow, 'accountId' | 'accountNumber' | 'legalName' | 'signatory'> & {
  prospectId: number
  accountType: AccountType
  nextActionCode: ProspectProgressStatus | null
  dossierCAC: boolean
}
