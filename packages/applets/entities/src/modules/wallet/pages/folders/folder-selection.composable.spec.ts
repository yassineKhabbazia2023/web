import { ref } from 'vue'
import { getMockedMappedAccount, getMockedWalletQueryResult } from '@entities/__mocks__/deploy-utils.mocks'
import { useFolderSelection } from './folder-selection.composable'

describe('useFolderSelection', () => {
  it('should expose empty selected folders by default', () => {
    const searchResult = ref(getMockedWalletQueryResult())

    const { selectedFolders, selectedFolderIds } = useFolderSelection(searchResult)

    expect(selectedFolders.value).toStrictEqual([])
    expect(selectedFolderIds.value).toStrictEqual([])
  })

  it('should select folders from current search result by ids', () => {
    const firstFolder = getMockedMappedAccount({
      accountId: 10,
      accountNumber: 'A10',
      name: 'First folder',
      owner: {
        contactId: 1,
        avatarColor: 'persian',
        email: 'first@test.fr',
        firstName: 'First',
        initials: 'FT',
        lastName: 'Test',
      },
    })
    const secondFolder = getMockedMappedAccount({
      accountId: 20,
      accountNumber: 'A20',
      name: 'Second folder',
    })
    const searchResult = ref(getMockedWalletQueryResult({
      items: [firstFolder, secondFolder],
    }))

    const { selectedFolders, selectedFolderIds } = useFolderSelection(searchResult)
    selectedFolderIds.value = [firstFolder.accountId]

    expect(selectedFolders.value).toStrictEqual([{
      accountNumber: firstFolder.accountNumber,
      avatarColor: firstFolder.owner.avatarColor,
      id: firstFolder.accountId,
      name: firstFolder.name,
    }])
    expect(selectedFolderIds.value).toStrictEqual([firstFolder.accountId])
  })

  it('should keep already selected folders that are no longer on current page', () => {
    const firstFolder = getMockedMappedAccount({
      accountId: 10,
      accountNumber: 'A10',
      name: 'First folder',
    })
    const secondFolder = getMockedMappedAccount({
      accountId: 20,
      accountNumber: 'A20',
      name: 'Second folder',
    })
    const searchResult = ref(getMockedWalletQueryResult({
      items: [firstFolder],
    }))
    const { selectedFolders, selectedFolderIds } = useFolderSelection(searchResult)

    selectedFolderIds.value = [firstFolder.accountId]
    searchResult.value = getMockedWalletQueryResult({
      items: [secondFolder],
    })
    selectedFolderIds.value = [firstFolder.accountId, secondFolder.accountId]

    expect(selectedFolders.value.map(({ id }) => id)).toStrictEqual([
      firstFolder.accountId,
      secondFolder.accountId,
    ])
  })

  it('should remove folders that are not in the new selected ids', () => {
    const firstFolder = getMockedMappedAccount({ accountId: 10 })
    const secondFolder = getMockedMappedAccount({ accountId: 20 })
    const searchResult = ref(getMockedWalletQueryResult({
      items: [firstFolder, secondFolder],
    }))
    const { selectedFolders, selectedFolderIds } = useFolderSelection(searchResult)

    selectedFolderIds.value = [firstFolder.accountId, secondFolder.accountId]
    selectedFolderIds.value = [secondFolder.accountId]

    expect(selectedFolders.value.map(({ id }) => id)).toStrictEqual([secondFolder.accountId])
  })

  it('should ignore unknown selected ids', () => {
    const folder = getMockedMappedAccount({ accountId: 10 })
    const searchResult = ref(getMockedWalletQueryResult({
      items: [folder],
    }))
    const { selectedFolders, selectedFolderIds } = useFolderSelection(searchResult)

    selectedFolderIds.value = [folder.accountId, 999]

    expect(selectedFolders.value.map(({ id }) => id)).toStrictEqual([folder.accountId])
    expect(selectedFolderIds.value).toStrictEqual([folder.accountId])
  })
})
