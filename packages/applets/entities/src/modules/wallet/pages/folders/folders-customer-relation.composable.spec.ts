import { ref } from 'vue'
import { getMockedMappedAccount } from '@entities/__mocks__/deploy-utils.mocks'
import { useFoldersCustomerRelation } from './folders-customer-relation.composable'
import { getSelectedFolderFromRow } from './folder-selection.composable'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'

const getSelectedFolders = (): SelectedFolder[] => [
  getSelectedFolderFromRow(getMockedMappedAccount({ accountId: 1, accountNumber: '1' })),
  getSelectedFolderFromRow(getMockedMappedAccount({ accountId: 2, accountNumber: '2' })),
]

describe('useFoldersCustomerRelation', () => {
  it('opens the drawer for the selection with the targeted status', () => {
    const selectedFolders = ref(getSelectedFolders())
    const {
      customerRelationDrawerFolders,
      isBulkCustomerRelationDrawerOpened,
      openBulkCustomerRelationDrawer,
      targetCustomerRelationStatus,
    } = useFoldersCustomerRelation(selectedFolders, vi.fn())

    openBulkCustomerRelationDrawer(true)

    expect(isBulkCustomerRelationDrawerOpened.value).toBe(true)
    expect(targetCustomerRelationStatus.value).toBe(true)
    expect(customerRelationDrawerFolders.value).toStrictEqual(selectedFolders.value)
  })

  it('targets only the row folder when the drawer is opened from a row', () => {
    const row = getMockedMappedAccount({ accountId: 42, accountNumber: '42' })
    const {
      customerRelationDrawerFolders,
      handleDisplayCustomerRelationDrawer,
      targetCustomerRelationStatus,
    } = useFoldersCustomerRelation(ref(getSelectedFolders()), vi.fn())

    handleDisplayCustomerRelationDrawer(row, false)

    expect(targetCustomerRelationStatus.value).toBe(false)
    expect(customerRelationDrawerFolders.value).toStrictEqual([getSelectedFolderFromRow(row)])
  })

  it('updates only the succeeded folders and refreshes the wallet', async () => {
    const refreshWallet = vi.fn().mockResolvedValue(undefined)
    const selectedFolders = ref(getSelectedFolders())
    const {
      handleBulkCustomerRelationUpdated,
      isBulkCustomerRelationDrawerOpened,
      openBulkCustomerRelationDrawer,
    } = useFoldersCustomerRelation(selectedFolders, refreshWallet)

    openBulkCustomerRelationDrawer(true)
    await handleBulkCustomerRelationUpdated([1])

    expect(selectedFolders.value[0].isCustomerRelation).toBe(true)
    expect(selectedFolders.value[1].isCustomerRelation).toBe(false)
    expect(isBulkCustomerRelationDrawerOpened.value).toBe(false)
    expect(refreshWallet).toHaveBeenCalledOnce()
  })

  it('forgets the row folder once the drawer is closed', () => {
    const selectedFolders = ref(getSelectedFolders())
    const {
      customerRelationDrawerFolders,
      handleBulkCustomerRelationDrawerVisibilityUpdate,
      handleDisplayCustomerRelationDrawer,
    } = useFoldersCustomerRelation(selectedFolders, vi.fn())

    handleDisplayCustomerRelationDrawer(getMockedMappedAccount({ accountId: 42, accountNumber: '42' }), true)
    handleBulkCustomerRelationDrawerVisibilityUpdate(false)

    expect(customerRelationDrawerFolders.value).toStrictEqual(selectedFolders.value)
  })

  it('keeps the row folder while the drawer stays open', () => {
    const row = getMockedMappedAccount({ accountId: 42, accountNumber: '42' })
    const {
      customerRelationDrawerFolders,
      handleBulkCustomerRelationDrawerVisibilityUpdate,
      handleDisplayCustomerRelationDrawer,
    } = useFoldersCustomerRelation(ref(getSelectedFolders()), vi.fn())

    handleDisplayCustomerRelationDrawer(row, true)
    handleBulkCustomerRelationDrawerVisibilityUpdate(true)

    expect(customerRelationDrawerFolders.value).toStrictEqual([getSelectedFolderFromRow(row)])
  })
})
