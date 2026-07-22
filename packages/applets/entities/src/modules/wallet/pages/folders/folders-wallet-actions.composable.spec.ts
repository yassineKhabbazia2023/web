import { ref } from 'vue'
import { CurrentUserManager } from '@pulse/common/managers'
import { GLOBAL_PERMISSIONS } from '@pulse/common/constants'
import { checkLastCollaboratorOnAccounts } from '@entities/services/account'
import { DelegationTab, ManageWalletAction } from '@entities/modules/wallet/enums'
import { useFoldersWalletActions } from './folders-wallet-actions.composable'
import type { SelectedFolder } from './components/DelegationDrawer/DelegationDrawerTypes'

const createWalletActions = () => useFoldersWalletActions(
  ref<SelectedFolder[]>([]),
  ref([1]),
  vi.fn().mockResolvedValue(undefined),
)

describe('useFoldersWalletActions', () => {
  beforeEach(() => {
    vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(false)
    vi.mocked(checkLastCollaboratorOnAccounts).mockResolvedValue({
      isLastCollaboratorOnAny: false,
      accountIdsWhereLastCollaborator: [],
    })
  })

  it('exposes the entity creator permission', () => {
    vi.spyOn(CurrentUserManager, 'hasPermission').mockReturnValue(true)

    const { hasEntityCreatorPermission } = createWalletActions()

    expect(hasEntityCreatorPermission.value).toBe(true)
    expect(vi.mocked(CurrentUserManager.hasPermission)).toHaveBeenCalledWith(GLOBAL_PERMISSIONS.ENTITY_CREATOR)
  })

  it.each([
    { action: ManageWalletAction.DELEGATE_WALLET, expectedTab: DelegationTab.DELEGATE_WALLET },
    { action: ManageWalletAction.VIEW_PERMANENT_DELEGATIONS, expectedTab: DelegationTab.PERMANENT_DELEGATIONS },
    { action: ManageWalletAction.REQUEST_DELEGATION, expectedTab: DelegationTab.REQUEST_DELEGATION },
    { action: ManageWalletAction.PENDING_DELEGATIONS, expectedTab: DelegationTab.PENDING_REQUESTS },
  ])('opens the delegation drawer on $expectedTab for $action', ({ action, expectedTab }) => {
    const { delegationInitialTab, isDelegationDrawerOpened, onWalletAction } = createWalletActions()

    onWalletAction(action)

    expect(isDelegationDrawerOpened.value).toBe(true)
    expect(delegationInitialTab.value).toBe(expectedTab)
  })

  it('opens the delegation drawer without a forced tab for the folders delegation', () => {
    const { delegationInitialTab, isDelegationDrawerOpened, onWalletAction } = createWalletActions()

    onWalletAction(ManageWalletAction.DELEGATE_FOLDERS)

    expect(isDelegationDrawerOpened.value).toBe(true)
    expect(delegationInitialTab.value).toBeUndefined()
  })

  it.each([
    { action: ManageWalletAction.DECLARE_CUSTOMER_RELATION, expectedStatus: true },
    { action: ManageWalletAction.REMOVE_CUSTOMER_RELATION, expectedStatus: false },
  ])('opens the customer relation drawer targeting $expectedStatus for $action', ({ action, expectedStatus }) => {
    const { isBulkCustomerRelationDrawerOpened, onWalletAction, targetCustomerRelationStatus } =
      createWalletActions()

    onWalletAction(action)

    expect(isBulkCustomerRelationDrawerOpened.value).toBe(true)
    expect(targetCustomerRelationStatus.value).toBe(expectedStatus)
  })

  it('opens the removal confirmation modal for the selected folders', async () => {
    const { isRemoveFromFoldersModalOpened, onWalletAction } = createWalletActions()

    await onWalletAction(ManageWalletAction.REMOVE_FROM_FOLDERS)

    expect(vi.mocked(checkLastCollaboratorOnAccounts)).toHaveBeenCalledExactlyOnceWith([1])
    expect(isRemoveFromFoldersModalOpened.value).toBe(true)
  })

  it('opens the entity creator drawer', () => {
    const { isEntityCreatorDrawerOpen, onWalletAction } = createWalletActions()

    onWalletAction(ManageWalletAction.CREATE_TEST_ACCOUNT)

    expect(isEntityCreatorDrawerOpen.value).toBe(true)
  })
})
