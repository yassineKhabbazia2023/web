import { computed, ref } from 'vue'
import type { Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { checkLastCollaboratorOnAccounts, removeCurrentUserFromAccounts } from '@entities/services/account'
import type { RegularWalletData } from '@entities/modules/wallet/types'
import { RemoveFromFoldersManager } from './components/RemoveFromFoldersConfirmationModal/remove-from-folders.manager'
import { FoldersManager } from './folders.manager'
import { I18N_KEY } from './folders.consts'

export function useFoldersRemoveFromFolders(
  selectedFolderIds: Ref<number[]>,
  refreshWallet: () => Promise<void>,
) {
  const { t } = useI18n()

  const isRemoveFromFoldersModalOpened = ref(false)
  const isRemoveFromFoldersLoading = ref(false)
  const hasRemainingCollaboratorFolder = ref(false)
  const rowRemoveCurrentUserFolderId = ref<number>()

  // A row action targets a single folder, the toolbar action targets the selection.
  const foldersToRemoveIds = computed<number[]>(() =>
    rowRemoveCurrentUserFolderId.value !== undefined
      ? [rowRemoveCurrentUserFolderId.value]
      : selectedFolderIds.value,
  )

  async function checkLastCollaboratorAndOpenRemovalModal() {
    if (foldersToRemoveIds.value.length === 0) {
      return
    }

    try {
      const remainingCollaboratorCheck = await checkLastCollaboratorOnAccounts(foldersToRemoveIds.value)

      hasRemainingCollaboratorFolder.value = remainingCollaboratorCheck.isLastCollaboratorOnAny
      isRemoveFromFoldersModalOpened.value = true
    } catch (error) {
      logger.error('Unable to check remaining collaborator accounts', error)
      displayNotification('error', t(`${I18N_KEY}.removeFromFoldersCheckError`))
    }
  }

  async function openRemoveFromFoldersConfirmationModal() {
    rowRemoveCurrentUserFolderId.value = undefined
    await checkLastCollaboratorAndOpenRemovalModal()
  }

  async function handleDisplayRemoveCurrentUserFromFolderModal(row: RegularWalletData) {
    rowRemoveCurrentUserFolderId.value = row.accountId
    await checkLastCollaboratorAndOpenRemovalModal()
  }

  async function confirmRemoveFromFolders() {
    if (foldersToRemoveIds.value.length === 0) {
      return
    }

    isRemoveFromFoldersLoading.value = true
    try {
      const response = await removeCurrentUserFromAccounts({ accountIds: foldersToRemoveIds.value })
      const succeededCount = response.succeeded.length
      const selectedCount = response.succeeded.length + response.failed.length
      const failedCount = selectedCount - succeededCount
      const messageKeys = FoldersManager.getRemovalMessageKeys(selectedCount, failedCount)
      const notification = RemoveFromFoldersManager.getNotification(response, selectedCount, {
        success: t(`${I18N_KEY}.${messageKeys.success}`, { count: selectedCount }),
        partialSuccess: t(`${I18N_KEY}.removeFromFoldersPartialSuccess`, {
          succeededCount,
          selectedCount,
          succeededFolderLabel: t(`${I18N_KEY}.removeFromFoldersSucceededFolderLabel`, succeededCount),
          remainingFoldersFailureMessage: t(`${I18N_KEY}.${messageKeys.remainingFailure}`),
        }),
        failure: t(`${I18N_KEY}.removeFromFoldersFailure`),
      })

      displayNotification(notification.type, notification.message)
      isRemoveFromFoldersModalOpened.value = false

      if (succeededCount > 0) {
        const succeededAccountIds = new Set(response.succeeded.map(({ accountId }) => accountId))
        selectedFolderIds.value = selectedFolderIds.value
          .filter(accountId => succeededAccountIds.has(accountId) === false)
        await refreshWallet()
      }
    } catch (error) {
      logger.error('Unable to remove current user from selected folders', error)
      displayNotification('error', t(`${I18N_KEY}.removeFromFoldersFailure`))
    } finally {
      isRemoveFromFoldersLoading.value = false
    }
  }

  return {
    isRemoveFromFoldersModalOpened,
    isRemoveFromFoldersLoading,
    hasRemainingCollaboratorFolder,
    foldersToRemoveIds,
    openRemoveFromFoldersConfirmationModal,
    handleDisplayRemoveCurrentUserFromFolderModal,
    confirmRemoveFromFolders,
  }
}
