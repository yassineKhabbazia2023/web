import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import type {
  RegularWalletData,
  SearchResult,
} from '@entities/modules/wallet/types'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'

export const getSelectedFolderFromRow = (folder: RegularWalletData): SelectedFolder => ({
  accountNumber: folder.accountNumber,
  id: folder.accountId,
  name: folder.name,
  avatarColor: folder.owner.avatarColor as SelectedFolder['avatarColor'],
  isCustomerRelation: folder.isCustomerRelation === true,
})

export function useFolderSelection(searchResult: Ref<SearchResult<RegularWalletData>>) {
  const selectedFolders = ref<SelectedFolder[]>([])

  const selectedFolderIds = computed<number[]>({
    get: () => selectedFolders.value.map(({ id }) => id),
    set: (newSelectedFolderIds: number[]) => {
      const selectedFoldersById = new Map(
        selectedFolders.value.map((selectedFolder) => [selectedFolder.id, selectedFolder]),
      )
      const currentFoldersById = new Map(
        searchResult.value.items.map((folder) => [folder.accountId, folder]),
      )

      selectedFolders.value = newSelectedFolderIds.reduce<SelectedFolder[]>(
        (selectedFoldersAccumulator, selectedFolderId) => {
          const currentFolder = currentFoldersById.get(selectedFolderId)
          if (currentFolder !== undefined) {
            selectedFoldersAccumulator.push(getSelectedFolderFromRow(currentFolder))
            return selectedFoldersAccumulator
          }

          const alreadySelectedFolder = selectedFoldersById.get(selectedFolderId)
          if (alreadySelectedFolder !== undefined) {
            selectedFoldersAccumulator.push(alreadySelectedFolder)
          }
          return selectedFoldersAccumulator
        },
        [],
      )
    },
  })

  // Only a single selected folder can expose a meaningful customer relation status.
  const selectedFolderCustomerRelationStatus = computed(() =>
    selectedFolders.value.length === 1
      ? selectedFolders.value[0].isCustomerRelation
      : undefined,
  )

  return {
    selectedFolders,
    selectedFolderIds,
    selectedFolderCustomerRelationStatus,
  }
}
