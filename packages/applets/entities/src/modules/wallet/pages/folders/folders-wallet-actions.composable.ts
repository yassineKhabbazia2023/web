import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { CurrentUserManager } from '@pulse/common/managers'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { DelegationTab, ManageWalletAction } from '@entities/modules/wallet/enums'
import { WalletTrackingManager } from '@entities/managers/wallet-tracking/wallet-tracking.manager'
import { useFoldersCustomerRelation } from './folders-customer-relation.composable'
import { useFoldersDelegation } from './folders-delegation.composable'
import { useFoldersRemoveFromFolders } from './folders-remove-from-folders.composable'
import { WALLET_ACTION_TRACKING_MAP } from './folders-wallet-actions.consts'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'

export function useFoldersWalletActions(
  selectedFolders: Ref<SelectedFolder[]>,
  selectedFolderIds: Ref<number[]>,
  refreshWallet: () => Promise<void>,
) {
  const isEntityCreatorDrawerOpen = ref(false)
  const hasEntityCreatorPermission = computed(() =>
    CurrentUserManager.hasPermission(GLOBAL_PERMISSIONS.ENTITY_CREATOR),
  )

  function onEntityCreatorDrawerOpen() {
    isEntityCreatorDrawerOpen.value = true
  }

  const delegation = useFoldersDelegation(selectedFolders)
  const customerRelation = useFoldersCustomerRelation(selectedFolders, refreshWallet)
  const removeFromFolders = useFoldersRemoveFromFolders(selectedFolderIds, refreshWallet)

  const walletActionHandlers: Record<ManageWalletAction, () => void | Promise<void>> = {
    [ManageWalletAction.DELEGATE_WALLET]: () =>
      delegation.openDelegationDrawerOnTab(DelegationTab.DELEGATE_WALLET),
    [ManageWalletAction.DELEGATE_FOLDERS]: () => delegation.openSelectedFoldersDelegationDrawer(),
    [ManageWalletAction.DECLARE_CUSTOMER_RELATION]: () =>
      customerRelation.openBulkCustomerRelationDrawer(true),
    [ManageWalletAction.REMOVE_CUSTOMER_RELATION]: () =>
      customerRelation.openBulkCustomerRelationDrawer(false),
    [ManageWalletAction.REMOVE_FROM_FOLDERS]: () =>
      removeFromFolders.openRemoveFromFoldersConfirmationModal(),
    [ManageWalletAction.VIEW_PERMANENT_DELEGATIONS]: () =>
      delegation.openDelegationDrawerOnTab(DelegationTab.PERMANENT_DELEGATIONS),
    [ManageWalletAction.REQUEST_DELEGATION]: () =>
      delegation.openDelegationDrawerOnTab(DelegationTab.REQUEST_DELEGATION),
    [ManageWalletAction.PENDING_DELEGATIONS]: () =>
      delegation.openDelegationDrawerOnTab(DelegationTab.PENDING_REQUESTS),
    [ManageWalletAction.CREATE_TEST_ACCOUNT]: () => {
      onEntityCreatorDrawerOpen()
    },
  }

  function onWalletAction(action: ManageWalletAction) {
    const tracking = WALLET_ACTION_TRACKING_MAP[action]
    WalletTrackingManager.trackFolderMenuAction(tracking.value, tracking.type)

    return walletActionHandlers[action]()
  }

  return {
    isEntityCreatorDrawerOpen,
    hasEntityCreatorPermission,
    onEntityCreatorDrawerOpen,
    onWalletAction,
    ...delegation,
    ...customerRelation,
    ...removeFromFolders,
  }
}
