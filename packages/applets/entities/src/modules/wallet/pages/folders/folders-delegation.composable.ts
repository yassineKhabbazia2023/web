import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type { DelegationTab } from '@entities/modules/wallet/enums'
import type { RegularWalletData } from '@entities/modules/wallet/types'
import { getSelectedFolderFromRow } from './folder-selection.composable'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'

export function useFoldersDelegation(selectedFolders: Ref<SelectedFolder[]>) {
  const isDelegationDrawerOpened = ref(false)
  const delegationInitialTab = ref<DelegationTab>()
  const rowDelegationFolder = ref<SelectedFolder>()

  // A row action targets a single folder, the toolbar actions target the selection.
  const foldersToDelegate = computed<SelectedFolder[]>(() =>
    rowDelegationFolder.value !== undefined ? [rowDelegationFolder.value] : selectedFolders.value,
  )

  function openDelegationDrawerOnTab(tab: DelegationTab) {
    rowDelegationFolder.value = undefined
    delegationInitialTab.value = tab
    isDelegationDrawerOpened.value = true
  }

  function openSelectedFoldersDelegationDrawer() {
    rowDelegationFolder.value = undefined
    delegationInitialTab.value = undefined
    isDelegationDrawerOpened.value = true
  }

  function handleDisplayDelegationDrawer(row: RegularWalletData) {
    rowDelegationFolder.value = getSelectedFolderFromRow(row)
    delegationInitialTab.value = undefined
    isDelegationDrawerOpened.value = true
  }

  return {
    isDelegationDrawerOpened,
    delegationInitialTab,
    foldersToDelegate,
    openDelegationDrawerOnTab,
    openSelectedFoldersDelegationDrawer,
    handleDisplayDelegationDrawer,
  }
}
