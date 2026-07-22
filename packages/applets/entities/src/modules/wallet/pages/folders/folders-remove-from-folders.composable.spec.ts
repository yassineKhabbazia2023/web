import { ref } from 'vue'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { checkLastCollaboratorOnAccounts, removeCurrentUserFromAccounts } from '@entities/services/account'
import { getMockedMappedAccount } from '@entities/__mocks__/deploy-utils.mocks'
import { useFoldersRemoveFromFolders } from './folders-remove-from-folders.composable'
import { I18N_KEY } from './folders.consts'

const checkLastCollaboratorOnAccountsMock = vi.mocked(checkLastCollaboratorOnAccounts)
const removeCurrentUserFromAccountsMock = vi.mocked(removeCurrentUserFromAccounts)
const displayNotificationMock = vi.mocked(displayNotification)

const getSucceededAccount = (accountId: number) => ({
  accountId,
  errorCode: null,
  errorMessage: null,
})

const getFailedAccount = (accountId: number) => ({
  accountId,
  errorCode: 'ACC004',
  errorMessage: 'Error',
})

describe('useFoldersRemoveFromFolders', () => {
  beforeEach(() => {
    checkLastCollaboratorOnAccountsMock.mockResolvedValue({
      isLastCollaboratorOnAny: false,
      accountIdsWhereLastCollaborator: [],
    })
    removeCurrentUserFromAccountsMock.mockResolvedValue({ succeeded: [], failed: [] })
  })

  it('does not check anything when nothing is selected', async () => {
    const { isRemoveFromFoldersModalOpened, openRemoveFromFoldersConfirmationModal } =
      useFoldersRemoveFromFolders(ref([]), vi.fn())

    await openRemoveFromFoldersConfirmationModal()

    expect(checkLastCollaboratorOnAccountsMock).not.toHaveBeenCalled()
    expect(isRemoveFromFoldersModalOpened.value).toBe(false)
  })

  it('opens the modal for the selection and exposes the remaining collaborator flag', async () => {
    checkLastCollaboratorOnAccountsMock.mockResolvedValueOnce({
      isLastCollaboratorOnAny: true,
      accountIdsWhereLastCollaborator: [2],
    })
    const {
      foldersToRemoveIds,
      hasRemainingCollaboratorFolder,
      isRemoveFromFoldersModalOpened,
      openRemoveFromFoldersConfirmationModal,
    } = useFoldersRemoveFromFolders(ref([1, 2]), vi.fn())

    await openRemoveFromFoldersConfirmationModal()

    expect(checkLastCollaboratorOnAccountsMock).toHaveBeenCalledExactlyOnceWith([1, 2])
    expect(foldersToRemoveIds.value).toStrictEqual([1, 2])
    expect(hasRemainingCollaboratorFolder.value).toBe(true)
    expect(isRemoveFromFoldersModalOpened.value).toBe(true)
  })

  it('targets only the row folder when the modal is opened from a row', async () => {
    const { foldersToRemoveIds, handleDisplayRemoveCurrentUserFromFolderModal } =
      useFoldersRemoveFromFolders(ref([1, 2]), vi.fn())

    await handleDisplayRemoveCurrentUserFromFolderModal(getMockedMappedAccount({ accountId: 42 }))

    expect(checkLastCollaboratorOnAccountsMock).toHaveBeenCalledExactlyOnceWith([42])
    expect(foldersToRemoveIds.value).toStrictEqual([42])
  })

  it('notifies an error when the check fails', async () => {
    checkLastCollaboratorOnAccountsMock.mockRejectedValueOnce(new Error('boom'))
    const { isRemoveFromFoldersModalOpened, openRemoveFromFoldersConfirmationModal } =
      useFoldersRemoveFromFolders(ref([1]), vi.fn())

    await openRemoveFromFoldersConfirmationModal()

    expect(vi.mocked(logger.error)).toHaveBeenCalledOnce()
    expect(displayNotificationMock).toHaveBeenCalledExactlyOnceWith(
      'error',
      `${I18N_KEY}.removeFromFoldersCheckError`,
    )
    expect(isRemoveFromFoldersModalOpened.value).toBe(false)
  })

  it('removes the selected folders, notifies the success and refreshes the wallet', async () => {
    removeCurrentUserFromAccountsMock.mockResolvedValueOnce({
      succeeded: [getSucceededAccount(1), getSucceededAccount(2)],
      failed: [],
    })
    const refreshWallet = vi.fn().mockResolvedValue(undefined)
    const selectedFolderIds = ref([1, 2])
    const { confirmRemoveFromFolders, isRemoveFromFoldersModalOpened } =
      useFoldersRemoveFromFolders(selectedFolderIds, refreshWallet)

    await confirmRemoveFromFolders()

    expect(removeCurrentUserFromAccountsMock).toHaveBeenCalledExactlyOnceWith({ accountIds: [1, 2] })
    expect(displayNotificationMock).toHaveBeenCalledExactlyOnceWith(
      'success',
      `${I18N_KEY}.removeFromFoldersSuccessMultiple`,
    )
    expect(selectedFolderIds.value).toStrictEqual([])
    expect(isRemoveFromFoldersModalOpened.value).toBe(false)
    expect(refreshWallet).toHaveBeenCalledOnce()
  })

  it('keeps the folders that could not be removed selected and warns about them', async () => {
    removeCurrentUserFromAccountsMock.mockResolvedValueOnce({
      succeeded: [getSucceededAccount(1)],
      failed: [getFailedAccount(2)],
    })
    const selectedFolderIds = ref([1, 2])
    const { confirmRemoveFromFolders } = useFoldersRemoveFromFolders(selectedFolderIds, vi.fn())

    await confirmRemoveFromFolders()

    expect(displayNotificationMock).toHaveBeenCalledExactlyOnceWith(
      'warning',
      `${I18N_KEY}.removeFromFoldersPartialSuccess`,
    )
    expect(selectedFolderIds.value).toStrictEqual([2])
  })

  it('notifies a failure and keeps the selection when nothing could be removed', async () => {
    removeCurrentUserFromAccountsMock.mockResolvedValueOnce({
      succeeded: [],
      failed: [getFailedAccount(1)],
    })
    const refreshWallet = vi.fn()
    const selectedFolderIds = ref([1])
    const { confirmRemoveFromFolders } = useFoldersRemoveFromFolders(selectedFolderIds, refreshWallet)

    await confirmRemoveFromFolders()

    expect(displayNotificationMock).toHaveBeenCalledExactlyOnceWith(
      'error',
      `${I18N_KEY}.removeFromFoldersFailure`,
    )
    expect(selectedFolderIds.value).toStrictEqual([1])
    expect(refreshWallet).not.toHaveBeenCalled()
  })

  it('notifies a failure and stops loading when the removal request throws', async () => {
    removeCurrentUserFromAccountsMock.mockRejectedValueOnce(new Error('boom'))
    const { confirmRemoveFromFolders, isRemoveFromFoldersLoading } =
      useFoldersRemoveFromFolders(ref([1]), vi.fn())

    await confirmRemoveFromFolders()

    expect(vi.mocked(logger.error)).toHaveBeenCalledOnce()
    expect(displayNotificationMock).toHaveBeenCalledExactlyOnceWith(
      'error',
      `${I18N_KEY}.removeFromFoldersFailure`,
    )
    expect(isRemoveFromFoldersLoading.value).toBe(false)
  })
})
