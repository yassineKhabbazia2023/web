import { nextTick } from 'vue'
import type { SelectedFolder } from '../DelegationDrawer/DelegationDrawerTypes'
import { useBulkCustomerRelationDrawer } from './bulk-customer-relation-drawer.composable'

const selectedFolders: SelectedFolder[] = [
  {
    id: 1,
    accountNumber: 'A1',
    name: 'Already targeted',
    avatarColor: 'persian',
    isCustomerRelation: true,
  },
  {
    id: 2,
    accountNumber: 'A2',
    name: 'Actionable',
    avatarColor: 'persian',
    isCustomerRelation: false,
  },
]

const setupComposable = () => useBulkCustomerRelationDrawer({
  selectedFolders,
  targetCustomerRelationStatus: true,
})

describe('useBulkCustomerRelationDrawer', () => {
  it('selects only actionable folders by default', () => {
    const { selectedActionableFolderIds } = setupComposable()

    expect(selectedActionableFolderIds.value).toStrictEqual([2])
  })

  it('identifies folders already in the target status', () => {
    const { isAlreadyInTargetStatus } = setupComposable()

    expect(isAlreadyInTargetStatus(selectedFolders[0])).toBe(true)
    expect(isAlreadyInTargetStatus(selectedFolders[1])).toBe(false)
  })

  it('returns the expected cell background for each folder status', () => {
    const { getFolderCellStyle } = setupComposable()

    expect(getFolderCellStyle({ row: { ...selectedFolders[0] } })).toStrictEqual({
      backgroundColor: 'var(--p-gray-50)',
    })
    expect(getFolderCellStyle({ row: { ...selectedFolders[1] } })).toStrictEqual({
      backgroundColor: 'var(--p-jungle-75)',
    })
  })

  it('deselects and reselects an actionable folder', async () => {
    const {
      handleFolderSelection,
      selectedActionableFolderIds,
      selectedActionableFolderIdSet,
    } = setupComposable()

    handleFolderSelection(2, false)
    await nextTick()
    expect(selectedActionableFolderIds.value).toStrictEqual([])
    expect(selectedActionableFolderIdSet.value.has(2)).toBe(false)

    handleFolderSelection(2, true)
    await nextTick()
    expect(selectedActionableFolderIds.value).toStrictEqual([2])
    expect(selectedActionableFolderIdSet.value.has(2)).toBe(true)
  })

  it('does not duplicate an already selected folder', () => {
    const { handleFolderSelection, selectedActionableFolderIds } = setupComposable()

    handleFolderSelection(2, true)

    expect(selectedActionableFolderIds.value).toStrictEqual([2])
  })
})
