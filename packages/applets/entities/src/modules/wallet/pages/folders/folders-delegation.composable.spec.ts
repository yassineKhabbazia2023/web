import { ref } from 'vue'
import { getMockedMappedAccount } from '@entities/__mocks__/deploy-utils.mocks'
import { DelegationTab } from '@entities/modules/wallet/enums'
import { useFoldersDelegation } from './folders-delegation.composable'
import { getSelectedFolderFromRow } from './folder-selection.composable'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'

const getSelectedFolders = (): SelectedFolder[] => [
  getSelectedFolderFromRow(getMockedMappedAccount({ accountId: 1, accountNumber: '1' })),
  getSelectedFolderFromRow(getMockedMappedAccount({ accountId: 2, accountNumber: '2' })),
]

describe('useFoldersDelegation', () => {
  it('starts with a closed drawer and no forced tab', () => {
    const { isDelegationDrawerOpened, delegationInitialTab } =
      useFoldersDelegation(ref(getSelectedFolders()))

    expect(isDelegationDrawerOpened.value).toBe(false)
    expect(delegationInitialTab.value).toBeUndefined()
  })

  it('opens the drawer on the requested tab with the selected folders', () => {
    const selectedFolders = ref(getSelectedFolders())
    const { isDelegationDrawerOpened, delegationInitialTab, foldersToDelegate, openDelegationDrawerOnTab } =
      useFoldersDelegation(selectedFolders)

    openDelegationDrawerOnTab(DelegationTab.PERMANENT_DELEGATIONS)

    expect(isDelegationDrawerOpened.value).toBe(true)
    expect(delegationInitialTab.value).toBe(DelegationTab.PERMANENT_DELEGATIONS)
    expect(foldersToDelegate.value).toStrictEqual(selectedFolders.value)
  })

  it('opens the drawer without a forced tab for the selected folders', () => {
    const selectedFolders = ref(getSelectedFolders())
    const {
      delegationInitialTab,
      foldersToDelegate,
      isDelegationDrawerOpened,
      openSelectedFoldersDelegationDrawer,
    } = useFoldersDelegation(selectedFolders)

    openSelectedFoldersDelegationDrawer()

    expect(isDelegationDrawerOpened.value).toBe(true)
    expect(delegationInitialTab.value).toBeUndefined()
    expect(foldersToDelegate.value).toStrictEqual(selectedFolders.value)
  })

  it('targets only the row folder when the drawer is opened from a row', () => {
    const row = getMockedMappedAccount({ accountId: 42, accountNumber: '42' })
    const { foldersToDelegate, handleDisplayDelegationDrawer, isDelegationDrawerOpened } =
      useFoldersDelegation(ref(getSelectedFolders()))

    handleDisplayDelegationDrawer(row)

    expect(isDelegationDrawerOpened.value).toBe(true)
    expect(foldersToDelegate.value).toStrictEqual([getSelectedFolderFromRow(row)])
  })

  it('falls back to the selection when a toolbar action follows a row action', () => {
    const selectedFolders = ref(getSelectedFolders())
    const { foldersToDelegate, handleDisplayDelegationDrawer, openSelectedFoldersDelegationDrawer } =
      useFoldersDelegation(selectedFolders)

    handleDisplayDelegationDrawer(getMockedMappedAccount({ accountId: 42, accountNumber: '42' }))
    openSelectedFoldersDelegationDrawer()

    expect(foldersToDelegate.value).toStrictEqual(selectedFolders.value)
  })
})
