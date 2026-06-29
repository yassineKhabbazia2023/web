import { ManageWalletMenuManager } from './manage-wallet-menu.manager'
import { ManageWalletAction } from '@entities/modules/wallet/enums'
import type { ManageWalletMenuTranslations } from './manage-wallet-button.types'

const hasPermissionMock = vi.fn(() => false)
const isDelegationRequestTabsActivatedMock = vi.fn(() => false)

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: {
    hasPermission: (...args: unknown[]) => hasPermissionMock(...(args as [])),
  },
  FeatureFlagManager: {
    isDelegationRequestTabsActivated: () => isDelegationRequestTabsActivatedMock(),
  },
}))

const translations: ManageWalletMenuTranslations = {
  delegateWallet: 'Delegate',
  delegateFolders: 'Delegate folders',
  removeFromFolders: 'Remove from folders',
  viewPermanentDelegations: 'Permanent',
  requestDelegation: 'Request',
  pendingDelegations: 'Pending',
  createTestAccount: 'Create',
}

const getActions = (selectedFoldersCount: number) =>
  ManageWalletMenuManager.getMenuElements(selectedFoldersCount, translations).map((item) => item.pActionName)

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
      ManageWalletAction.DELEGATE_WALLET,
      ManageWalletAction.VIEW_PERMANENT_DELEGATIONS,
      ManageWalletAction.REQUEST_DELEGATION,
      ManageWalletAction.PENDING_DELEGATIONS,
    ])
  })

  it('adds the create test account action when the user has the permission', () => {
    hasPermissionMock.mockReturnValue(true)

    expect(getActions(0)).toContain(ManageWalletAction.CREATE_TEST_ACCOUNT)
  })

  it('returns selected folders actions when at least one folder is selected', () => {
    hasPermissionMock.mockReturnValue(true)
    isDelegationRequestTabsActivatedMock.mockReturnValue(true)

    expect(getActions(1)).toEqual([
      ManageWalletAction.DELEGATE_FOLDERS,
      ManageWalletAction.REMOVE_FROM_FOLDERS,
    ])
    expect(getActions(3)).toEqual([
      ManageWalletAction.DELEGATE_FOLDERS,
      ManageWalletAction.REMOVE_FROM_FOLDERS,
    ])
  })

  it('uses the expected icons for selected folders actions', () => {
    const [delegateFoldersAction, removeFromFoldersAction] = ManageWalletMenuManager.getMenuElements(2, translations)

    expect(delegateFoldersAction.pIconName).toBe('folderSymlink')
    expect(removeFromFoldersAction.pIconName).toBe('personRemove')
  })
})
