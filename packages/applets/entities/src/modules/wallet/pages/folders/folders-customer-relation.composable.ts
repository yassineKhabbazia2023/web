import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { RegularWalletData } from '@entities/modules/wallet/types'
import { getSelectedFolderFromRow } from './folder-selection.composable'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'

export function useFoldersCustomerRelation(
  selectedFolders: Ref<SelectedFolder[]>,
  refreshWallet: () => Promise<void>,
) {
  const isBulkCustomerRelationDrawerOpened = ref(false)
  const targetCustomerRelationStatus = ref(false)
  const rowCustomerRelationFolder = ref<SelectedFolder>()

  // A row action targets a single folder, the toolbar actions target the selection.
  const customerRelationDrawerFolders = computed<SelectedFolder[]>(() =>
    rowCustomerRelationFolder.value !== undefined
      ? [rowCustomerRelationFolder.value]
      : selectedFolders.value,
  )

  function openBulkCustomerRelationDrawer(targetStatus: boolean) {
    targetCustomerRelationStatus.value = targetStatus
    isBulkCustomerRelationDrawerOpened.value = true
  }

  function handleDisplayCustomerRelationDrawer(row: RegularWalletData, targetStatus: boolean) {
    rowCustomerRelationFolder.value = getSelectedFolderFromRow(row)
    openBulkCustomerRelationDrawer(targetStatus)
  }

  async function handleBulkCustomerRelationUpdated(succeededAccountIds: number[]) {
    const succeededAccountIdSet = new Set(succeededAccountIds)
    selectedFolders.value = selectedFolders.value.map(folder => ({
      ...folder,
      isCustomerRelation: succeededAccountIdSet.has(folder.id)
        ? targetCustomerRelationStatus.value
        : folder.isCustomerRelation,
    }))
    isBulkCustomerRelationDrawerOpened.value = false
    rowCustomerRelationFolder.value = undefined
    await refreshWallet()
  }

  function handleBulkCustomerRelationDrawerVisibilityUpdate(isOpened: boolean) {
    if (isOpened === false) {
      rowCustomerRelationFolder.value = undefined
    }
  }

  return {
    isBulkCustomerRelationDrawerOpened,
    targetCustomerRelationStatus,
    customerRelationDrawerFolders,
    openBulkCustomerRelationDrawer,
    handleDisplayCustomerRelationDrawer,
    handleBulkCustomerRelationUpdated,
    handleBulkCustomerRelationDrawerVisibilityUpdate,
  }
}
