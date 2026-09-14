import type { MockInstance } from 'vitest'
import { ManageWalletMenuManager } from './manage-wallet-menu.manager'
import { ManageWalletAction } from '@entities/modules/wallet/enums'
import { FeatureFlagManager } from '@pulse/common/managers'
import { armCurrentUserPermissions } from '@pulse/common/mocks/vitest/current-user.permissions.helper'
import type { ManageWalletMenuTranslations } from './manage-wallet-button.types'
import type { SelectedFolder } from '../DelegationDrawer/DelegationDrawerTypes'

let hasPermissionMock: MockInstance
const isDelegationRequestTabsActivatedMock = vi.fn(() => false)

beforeEach(() => {
  hasPermissionMock = armCurrentUserPermissions(false)
  vi.spyOn(FeatureFlagManager, 'isDelegationRequestTabsActivated').mockImplementation(isDelegationRequestTabsActivatedMock)
})

const translations: ManageWalletMenuTranslations = {
  delegateWallet: 'Delegate',
  delegateFolders: 'Delegate folders',
  declareCustomerRelation: 'Declare customer relation',
  removeCustomerRelation: 'Remove customer relation',
  removeFromFolders: 'Remove from folders',
  viewPermanentDelegations: 'Permanent',
  requestDelegation: 'Request',
  pendingDelegations: 'Pending',
  createTestAccount: 'Create',
}

const buildSelectedFolder = (isCustomerRelation: boolean): SelectedFolder => ({
  accountNumber: 'A1',
  id: 1,
  name: 'Folder',
  avatarColor: 'persian',
  isCustomerRelation,
})

const getActions = (selectedFoldersCount: number, selectedFolders: SelectedFolder[] = []) =>
  ManageWalletMenuManager
    .getMenuElements(selectedFoldersCount, translations, selectedFolders)
    .map((item) => item.pActionName)

describe('ManageWalletMenuManager', () => {
  beforeEach(() => {
    hasPermissionMock.mockReturnValue(false)
    isDelegationRequestTabsActivatedMock.mockReturnValue(false)
  })

  it('exposes wallet and permanent delegation actions by default', () => {
    expect(getActions(0)).toEqual([
      ManageWalletAction.DELEGATE_WALLET,
      ManageWalletAction.VIEW_PERMANENT_DELEGATIONS,
    ])
  })

  it('adds request and pending actions when the delegation request flag is on', () => {
    isDelegationRequestTabsActivatedMock.mockReturnValue(true)

    expect(getActions(0)).toEqual([
      ManageWalletAction.PENDING_DELEGATIONS,
      ManageWalletAction.REQUEST_DELEGATION,
      ManageWalletAction.DELEGATE_WALLET,
      ManageWalletAction.VIEW_PERMANENT_DELEGATIONS,
    ])
  })

  it('adds the create test account action when the user has the permission', () => {
    hasPermissionMock.mockReturnValue(true)

    expect(getActions(0)).toContain(ManageWalletAction.CREATE_TEST_ACCOUNT)
  })

  it('returns the declare action for a single folder without a customer relation', () => {
    hasPermissionMock.mockReturnValue(true)
    isDelegationRequestTabsActivatedMock.mockReturnValue(true)

    expect(getActions(1, [buildSelectedFolder(false)])).toEqual([
      ManageWalletAction.DECLARE_CUSTOMER_RELATION,
      ManageWalletAction.DELEGATE_FOLDERS,
      ManageWalletAction.REMOVE_FROM_FOLDERS,
    ])
  })

  it('returns the remove relation action for a single folder with a customer relation', () => {
    expect(getActions(1, [buildSelectedFolder(true)])).toEqual([
      ManageWalletAction.REMOVE_CUSTOMER_RELATION,
      ManageWalletAction.DELEGATE_FOLDERS,
      ManageWalletAction.REMOVE_FROM_FOLDERS,
    ])
  })

  it('returns only the declare action when every selected folder lacks a customer relation', () => {
    const selectedFolders = [buildSelectedFolder(false), buildSelectedFolder(false), buildSelectedFolder(false)]

    expect(getActions(3, selectedFolders)).toEqual([
      ManageWalletAction.DECLARE_CUSTOMER_RELATION,
      ManageWalletAction.DELEGATE_FOLDERS,
      ManageWalletAction.REMOVE_FROM_FOLDERS,
    ])
  })

  it('returns only the remove action when every selected folder has a customer relation', () => {
    const selectedFolders = [buildSelectedFolder(true), buildSelectedFolder(true), buildSelectedFolder(true)]

    expect(getActions(3, selectedFolders)).toEqual([
      ManageWalletAction.REMOVE_CUSTOMER_RELATION,
      ManageWalletAction.DELEGATE_FOLDERS,
      ManageWalletAction.REMOVE_FROM_FOLDERS,
    ])
  })

  it('returns both customer relation actions when the selection is mixed', () => {
    const selectedFolders = [buildSelectedFolder(true), buildSelectedFolder(false), buildSelectedFolder(true)]

    expect(getActions(3, selectedFolders)).toEqual([
      ManageWalletAction.DECLARE_CUSTOMER_RELATION,
      ManageWalletAction.REMOVE_CUSTOMER_RELATION,
      ManageWalletAction.DELEGATE_FOLDERS,
      ManageWalletAction.REMOVE_FROM_FOLDERS,
    ])
  })

  it('hides both customer relation actions when no selected folder relation data is available', () => {
    expect(getActions(2)).toEqual([
      ManageWalletAction.DELEGATE_FOLDERS,
      ManageWalletAction.REMOVE_FROM_FOLDERS,
    ])
  })

  it('uses the expected icons for selected folders actions', () => {
    const selectedFolders = [buildSelectedFolder(true), buildSelectedFolder(false)]
    const [declareRelationAction, removeRelationAction, delegateFoldersAction, removeFromFoldersAction] =
      ManageWalletMenuManager.getMenuElements(2, translations, selectedFolders)

    expect(declareRelationAction.pIconName).toBe('personCheck')
    expect(removeRelationAction.pIconName).toBe('personSlash')
    expect(delegateFoldersAction.pIconName).toBe('folderSymlink')
    expect(removeFromFoldersAction.pIconName).toBe('personRemove')
  })
})
