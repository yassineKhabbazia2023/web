import type { SelectedFolder } from '../DelegationDrawer/DelegationDrawerTypes'

export interface ManageWalletButtonProps {
  selectedFoldersCount: number
  selectedFolders: SelectedFolder[]
}

export interface ManageWalletMenuTranslations {
  delegateWallet: string
  delegateFolders: string
  declareCustomerRelation: string
  removeCustomerRelation: string
  removeFromFolders: string
  viewPermanentDelegations: string
  requestDelegation: string
  pendingDelegations: string
  createTestAccount: string
}
