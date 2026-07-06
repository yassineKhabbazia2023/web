import { computed, ref } from 'vue'
import type { CSSProperties } from 'vue'
import type { SelectedFolder } from '../DelegationDrawer/DelegationDrawerTypes'
import type { BulkCustomerRelationDrawerProps } from './bulk-customer-relation-drawer.types'
import { BulkCustomerRelationManager } from './bulk-customer-relation.manager'

export function useBulkCustomerRelationDrawer(props: BulkCustomerRelationDrawerProps) {
  const isFolderListExpanded = ref(true)
  const selectedActionableFolderIds = ref(BulkCustomerRelationManager.getActionableFolderIds(
    props.selectedFolders,
    props.targetCustomerRelationStatus,
  ))
  const selectedActionableFolderIdSet = computed(() => new Set(selectedActionableFolderIds.value))

  function isAlreadyInTargetStatus(folder: SelectedFolder): boolean {
    return BulkCustomerRelationManager.isAlreadyInTargetStatus(folder, props.targetCustomerRelationStatus)
  }

  function getFolderCellStyle({ row }: { row: Record<string, unknown> }): CSSProperties {
    if (isAlreadyInTargetStatus(row as unknown as SelectedFolder)) {
      return {
        backgroundColor: 'var(--p-gray-50)',
      }
    }

    return {
      backgroundColor: 'var(--p-jungle-75)',
    }
  }

  function handleFolderSelection(folderId: number, isSelected: boolean) {
    if (isSelected === true) {
      if (selectedActionableFolderIdSet.value.has(folderId) === false) {
        selectedActionableFolderIds.value = [...selectedActionableFolderIds.value, folderId]
      }
      return
    }

    selectedActionableFolderIds.value = selectedActionableFolderIds.value
      .filter(selectedFolderId => selectedFolderId !== folderId)
  }

  return {
    getFolderCellStyle,
    handleFolderSelection,
    isAlreadyInTargetStatus,
    isFolderListExpanded,
    selectedActionableFolderIds,
    selectedActionableFolderIdSet,
  }
}
