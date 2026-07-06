import { getPaginationMock, getMockedUserInfo, getMockedEntities } from '@pulse/common/mocks'
import {
  AmplitudeServiceMock,
  CurrentEntityManagerMock,
  hasPermissionMock,
  CurrentUserManagerMock,
  getStoreMock,
  featureFlagManagerMock,
  isManageWalletMenuActivatedMock,
} from '@pulse/common/mocks/vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { EntityStatus, DelegationTab, ManageWalletAction } from '@entities/modules/wallet/enums'
import { nextTick, reactive } from 'vue'
import { getMockedWalletQueryResult, getMockedSearchCriteria } from '@entities/__mocks__/deploy-utils.mocks'
import { getMockedAccount } from '@entities/__mocks__/account-row.mocks'
import type { ComponentWrapper } from '@pulse/toolbox/utils/test'
import { loggerMock } from '@pulse/toolbox/mocks'
import { registryServiceMock, fetchAccountOperationsMock } from '@entities/__mocks__/vitest'
import type { AccountOperations } from '@entities/services/registry'
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import { TrackingLocalisation } from '@entities/enums'
import type { Entity } from '@pulse/common/types'
import { useUserStore } from '@pulse/common/stores'
import { RouteName, RouteParam } from '@pulse/common/enums'
import AccountFiltersDrawer from './components/AccountFiltersDrawer/AccountFiltersDrawer.vue'
import ManageWalletButton from './components/ManageWalletButton/ManageWalletButton.vue'
import { MISSION_TYPE } from '@entities/constants'
import RemoveFromFoldersConfirmationModal from './components/RemoveFromFoldersConfirmationModal/remove-from-folders-confirmation-modal.vue'
import BulkCustomerRelationDrawer from './components/BulkCustomerRelationDrawer'

import Folders from './Folders.vue'

const userStoreMock = getStoreMock(useUserStore)
const mockedAccount = getMockedAccount()
const totalPagesMock = 5

vi.mock('@pulse/toolbox', () => ({
  logger: loggerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

const displayNotificationMock = vi.hoisted(() => vi.fn())
vi.mock('@pulse/styleguide', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@pulse/styleguide')>()

  return {
    ...actual,
    displayNotification: displayNotificationMock,
  }
})

vi.mock('@entities/services/registry', () => registryServiceMock)

const putFavoriteMock = vi.hoisted(() => vi.fn())
const getFavoritesMock = vi.hoisted(() => vi.fn())
const accountOperationsListMock = getAccountOperationsListMock()

vi.mock('@entities/services/registry', () => registryServiceMock)

const mockedQueryResult = getMockedWalletQueryResult()

const mockedGatewayGet = vi.hoisted(() => vi.fn())
vi.mock('@entities/services/subscription', () => ({
  fetchAccountSubscriptions: vi.fn(() => ([])),
}))

const fetchFavoriteEntitiesMock = vi.hoisted(() => vi.fn())
const fetchAccountContactsMock = vi.hoisted(() => vi.fn(() => ({
  items: [],
})))
const manageFavoriteEntitiesMock = vi.hoisted(() => vi.fn())

vi.mock('@entities/services/wallet', () => ({
  fetchFavoriteEntities: fetchFavoriteEntitiesMock,
  fetchAccountContacts: fetchAccountContactsMock,
  manageFavoriteEntities: manageFavoriteEntitiesMock,
}))

const checkLastCollaboratorOnAccountsMock = vi.hoisted(() => vi.fn())
const removeCurrentUserFromAccountsMock = vi.hoisted(() => vi.fn())

vi.mock('@entities/services/account', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@entities/services/account')>()

  return {
    ...actual,
    checkLastCollaboratorOnAccounts: checkLastCollaboratorOnAccountsMock,
    removeCurrentUserFromAccounts: removeCurrentUserFromAccountsMock,
  }
})

vi.mock('@pulse/common/api', () => ({
  api: ({
    wallet: {
      put: putFavoriteMock,
      get: () => getFavoritesMock(),
    },
    gateway: {
      get: mockedGatewayGet,
    },
  }),
}))

vi.mock('@pulse/common/services/amplitude', () => ({
  AmplitudeService: AmplitudeServiceMock,
}))

const mockRouterPush = vi.fn()
const mockRouterReplace = vi.fn()
const onBeforeRouteUpdateMock = vi.hoisted(() => vi.fn())

interface RouterMockData {
  name: string,
  query: {
    accountNumbers: string | string[] | undefined
  }
}
const routeMockData: RouterMockData = reactive({
  name: RouteName.FOLDERS,
  query: {
    accountNumbers: '',
  },
})

vi.mock('vue-router', async () => {
  return {
    useRouter: () => ({
      push: mockRouterPush,
      replace: mockRouterReplace,
    }),
    useRoute: () => (routeMockData),
    onBeforeRouteUpdate: onBeforeRouteUpdateMock,
  }
})

const mockFetchWalletData = vi.hoisted(() => vi.fn())
vi.mock('./FoldersUtils', async () => ({
  fetchWalletData: mockFetchWalletData,
}))

vi.mock('@pulse/common/managers', () => ({
  CurrentEntityManager: CurrentEntityManagerMock,
  CurrentUserManager: CurrentUserManagerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

const createWrapper = (): ComponentWrapper<InstanceType<typeof Folders>> =>
  shallowMount(Folders, {
    attachTo: document.body,
    global: {
      stubs: {
        PButton: {
          name: 'PButton',
          template: '<div><slot /></div>',
          props: ['pDisabled'],
        },
        PPastille: {
          name: 'PPastille',
          template: '<div><slot /></div>',
        },
        FormSearch: {
          name: 'FormSearch',
          template: '<div><slot /></div>',
          methods: {
            clearSearch: vi.fn(),
          },
        },
        AccountFiltersDrawer: {
          name: 'AccountFiltersDrawer',
          template: '<div />',
          props: ['modelValue', 'hasActiveFilters', 'accountFilters'],
          emits: ['apply-filters', 'reset-filters'],
        },
        OffersDrawer: {
          name: 'OffersDrawer',
          template: '<div><slot /></div>',
          methods: {
            initDrawerForCurrentAccount: vi.fn(),
          },
          props: [
            'modelValue',
          ],
        },
      },
    },
  })

describe('deploy', () => {
  beforeEach(() => {
    const userMock = getMockedUserInfo()
    userStoreMock.user = userMock
    userStoreMock.isCollab = true
    hasPermissionMock.mockReturnValue(false)
    isManageWalletMenuActivatedMock.mockReturnValue(true)
    mockedGatewayGet.mockResolvedValue(mockedAccount)
    checkLastCollaboratorOnAccountsMock.mockResolvedValue({
      isLastCollaboratorOnAny: false,
      accountIdsWhereLastCollaborator: [],
    })
    removeCurrentUserFromAccountsMock.mockResolvedValue({
      succeeded: [],
      failed: [],
    })
    mockFetchWalletData
      .mockResolvedValue(mockedQueryResult)
  })

  it('should call setFavoriteEntities', async () => {
    const mockedEntites = getMockedEntities()
    fetchFavoriteEntitiesMock.mockResolvedValueOnce(mockedEntites)
    const expectedArguements = mockedEntites.map((item: Entity) => ({
      ...item,
      color: 'persian',
    })) as Entity[]

    createWrapper()
    await flushPromises()

    expect(userStoreMock.setFavoriteEntities).toHaveBeenCalledOnce()
    expect(userStoreMock.setFavoriteEntities).toHaveBeenNthCalledWith(1, expectedArguements)
  })

  it('forwards the number of selected folders to the manage wallet button', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const firstFolder = mockedQueryResult.items[0]
    const manageWalletButton = wrapper.findComponent(ManageWalletButton)

    expect(manageWalletButton.props('selectedFoldersCount')).toBe(0)

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', [firstFolder.accountId])
    await nextTick()

    expect(manageWalletButton.props('selectedFoldersCount')).toBe(1)
    expect(manageWalletButton.props('isSelectedFolderCustomerRelation')).toBe(firstFolder.isCustomerRelation)
  })

  it('forwards the customer relation status for a related single folder', async () => {
    const relatedFolder = {
      ...mockedQueryResult.items[0],
      isCustomerRelation: true,
    }
    mockFetchWalletData.mockResolvedValueOnce({
      ...mockedQueryResult,
      items: [relatedFolder],
    })
    const wrapper = createWrapper()
    await flushPromises()

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', [relatedFolder.accountId])
    await nextTick()

    expect(wrapper.findComponent(ManageWalletButton).props('isSelectedFolderCustomerRelation')).toBe(true)
  })

  it.each([
    {
      action: ManageWalletAction.DECLARE_CUSTOMER_RELATION,
      targetCustomerRelationStatus: true,
    },
    {
      action: ManageWalletAction.REMOVE_CUSTOMER_RELATION,
      targetCustomerRelationStatus: false,
    },
  ])(
    'opens the bulk customer relation drawer for $action',
    async ({ action, targetCustomerRelationStatus }) => {
      const wrapper = createWrapper()
      await flushPromises()
      const selectedFolderIds = mockedQueryResult.items.map(({ accountId }) => accountId)

      const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
      tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
      await nextTick()

      wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', action)
      await nextTick()

      const drawer = wrapper.findComponent(BulkCustomerRelationDrawer)
      expect(drawer.exists()).toBe(true)
      expect(drawer.props('targetCustomerRelationStatus')).toBe(targetCustomerRelationStatus)
      expect(drawer.props('selectedFolders')).toHaveLength(2)
    },
  )

  it('refreshes the wallet and selected statuses after a bulk customer relation update', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const selectedFolderIds = mockedQueryResult.items
      .slice(0, 1)
      .map(({ accountId }) => accountId)

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit(
      'action-selected',
      ManageWalletAction.DECLARE_CUSTOMER_RELATION,
    )
    await nextTick()

    wrapper.findComponent(BulkCustomerRelationDrawer).vm.$emit('updated', selectedFolderIds)
    await flushPromises()

    expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
    expect(wrapper.findComponent(BulkCustomerRelationDrawer).exists()).toBe(false)
    expect(wrapper.findComponent(ManageWalletButton).props('isSelectedFolderCustomerRelation')).toBe(true)
  })

  it('updates only folders that succeeded after a partial customer relation update', async () => {
    const [succeededFolder, failedFolder] = mockedQueryResult.items
    const updatedQueryResult = {
      ...mockedQueryResult,
      items: mockedQueryResult.items.map(folder => ({
        ...folder,
        isCustomerRelation: folder.accountId === succeededFolder.accountId,
      })),
    }
    mockFetchWalletData
      .mockResolvedValueOnce(mockedQueryResult)
      .mockResolvedValueOnce(updatedQueryResult)
    const wrapper = createWrapper()
    await flushPromises()

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', [succeededFolder.accountId, failedFolder.accountId])
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit(
      'action-selected',
      ManageWalletAction.DECLARE_CUSTOMER_RELATION,
    )
    await nextTick()

    wrapper.findComponent(BulkCustomerRelationDrawer).vm.$emit('updated', [succeededFolder.accountId])
    await flushPromises()

    tableData.vm.$emit('update:selectedFolderIds', [succeededFolder.accountId])
    await nextTick()
    expect(wrapper.findComponent(ManageWalletButton).props('isSelectedFolderCustomerRelation')).toBe(true)

    tableData.vm.$emit('update:selectedFolderIds', [failedFolder.accountId])
    await nextTick()
    expect(wrapper.findComponent(ManageWalletButton).props('isSelectedFolderCustomerRelation')).toBe(false)
  })

  it.each([
    { action: ManageWalletAction.DELEGATE_WALLET, expectedTab: DelegationTab.DELEGATE_WALLET },
    { action: ManageWalletAction.VIEW_PERMANENT_DELEGATIONS, expectedTab: DelegationTab.PERMANENT_DELEGATIONS },
    { action: ManageWalletAction.REQUEST_DELEGATION, expectedTab: DelegationTab.REQUEST_DELEGATION },
    { action: ManageWalletAction.PENDING_DELEGATIONS, expectedTab: DelegationTab.PENDING_REQUESTS },
  ])('opens the delegation drawer on the $expectedTab tab for the $action action', async ({ action, expectedTab }) => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', action)
    await nextTick()

    const delegationDrawer = wrapper.findComponent({ name: 'DelegationDrawer' })
    expect(delegationDrawer.exists()).toBe(true)
    expect(delegationDrawer.props('initialTab')).toBe(expectedTab)
  })

  it('opens the selected folders delegation drawer for the delegate folders action', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const selectedFolderIds = mockedQueryResult.items
      .slice(0, 2)
      .map(({ accountId }) => accountId)

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', ManageWalletAction.DELEGATE_FOLDERS)
    await nextTick()

    const delegationDrawer = wrapper.findComponent({ name: 'DelegationDrawer' })
    expect(delegationDrawer.exists()).toBe(true)
    expect(delegationDrawer.props('selectedFolders')).toHaveLength(2)
    expect(delegationDrawer.props('initialTab')).toBeUndefined()
  })

  it('opens the delegation drawer for the single targeted folder on the row delegate action', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const targetedFolder = mockedQueryResult.items[0]

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('displayDelegationDrawer', targetedFolder)
    await nextTick()

    const delegationDrawer = wrapper.findComponent({ name: 'DelegationDrawer' })
    expect(delegationDrawer.exists()).toBe(true)
    expect(delegationDrawer.props('selectedFolders')).toStrictEqual([{
      accountNumber: targetedFolder.accountNumber,
      id: targetedFolder.accountId,
      name: targetedFolder.name,
      avatarColor: targetedFolder.owner.avatarColor,
      isCustomerRelation: targetedFolder.isCustomerRelation,
    }])
    expect(delegationDrawer.props('initialTab')).toBeUndefined()
  })

  it('checks remaining collaborator folders and opens the removal confirmation modal', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const selectedFolderIds = mockedQueryResult.items
      .slice(0, 2)
      .map(({ accountId }) => accountId)

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', ManageWalletAction.REMOVE_FROM_FOLDERS)
    await flushPromises()

    const removalModal = wrapper.findComponent(RemoveFromFoldersConfirmationModal)
    expect(checkLastCollaboratorOnAccountsMock).toHaveBeenCalledExactlyOnceWith(selectedFolderIds)
    expect(removalModal.exists()).toBe(true)
    expect(removalModal.props('hasRemainingCollaboratorFolder')).toBe(false)
  })

  it('checks the single targeted folder and removes the current user from it on the row remove action', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const targetedFolder = mockedQueryResult.items[0]
    removeCurrentUserFromAccountsMock.mockResolvedValueOnce({
      succeeded: [{ accountId: targetedFolder.accountId, errorCode: null, errorMessage: null }],
      failed: [],
    })

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('displayRemoveCurrentUserFromFolderModal', targetedFolder)
    await flushPromises()

    const removalModal = wrapper.findComponent(RemoveFromFoldersConfirmationModal)
    expect(checkLastCollaboratorOnAccountsMock).toHaveBeenCalledExactlyOnceWith([targetedFolder.accountId])
    expect(removalModal.exists()).toBe(true)
    expect(removalModal.props('selectedFoldersCount')).toBe(1)

    removalModal.vm.$emit('confirm')
    await flushPromises()

    expect(removeCurrentUserFromAccountsMock).toHaveBeenCalledExactlyOnceWith({
      accountIds: [targetedFolder.accountId],
    })
    expect(displayNotificationMock).toHaveBeenCalledWith('success', 'You removed yourself from the selected folder.')
  })

  it('displays the remaining collaborator modal and sends all selected folders for removal', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const selectedFolderIds = mockedQueryResult.items
      .slice(0, 2)
      .map(({ accountId }) => accountId)
    checkLastCollaboratorOnAccountsMock.mockResolvedValueOnce({
      isLastCollaboratorOnAny: true,
      accountIdsWhereLastCollaborator: [selectedFolderIds[1]],
    })

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', ManageWalletAction.REMOVE_FROM_FOLDERS)
    await flushPromises()

    const removalModal = wrapper.findComponent(RemoveFromFoldersConfirmationModal)
    expect(removalModal.props('hasRemainingCollaboratorFolder')).toBe(true)

    removalModal.vm.$emit('confirm')
    await flushPromises()

    expect(removeCurrentUserFromAccountsMock).toHaveBeenCalledExactlyOnceWith({
      accountIds: selectedFolderIds,
    })
  })

  it('uses the remaining collaborator boolean to display the blocking wording', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const selectedFolderIds = mockedQueryResult.items
      .slice(0, 1)
      .map(({ accountId }) => accountId)
    checkLastCollaboratorOnAccountsMock.mockResolvedValueOnce({
      isLastCollaboratorOnAny: true,
      accountIdsWhereLastCollaborator: [],
    })

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', ManageWalletAction.REMOVE_FROM_FOLDERS)
    await flushPromises()

    const removalModal = wrapper.findComponent(RemoveFromFoldersConfirmationModal)
    expect(removalModal.props('hasRemainingCollaboratorFolder')).toBe(true)
  })

  it('keeps folders selected when the removal confirmation modal is cancelled', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const selectedFolderIds = mockedQueryResult.items
      .slice(0, 2)
      .map(({ accountId }) => accountId)

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', ManageWalletAction.REMOVE_FROM_FOLDERS)
    await flushPromises()

    wrapper.findComponent(RemoveFromFoldersConfirmationModal).vm.$emit('update:modelValue', false)
    await nextTick()

    expect(wrapper.findComponent(ManageWalletButton).props('selectedFoldersCount')).toBe(2)
  })

  it('removes current user from selected folders and displays a success notification', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const selectedFolderIds = mockedQueryResult.items
      .slice(0, 2)
      .map(({ accountId }) => accountId)
    removeCurrentUserFromAccountsMock.mockResolvedValueOnce({
      succeeded: selectedFolderIds.map(accountId => ({
        accountId,
        errorCode: null,
        errorMessage: null,
      })),
      failed: [],
    })

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', ManageWalletAction.REMOVE_FROM_FOLDERS)
    await flushPromises()
    wrapper.findComponent(RemoveFromFoldersConfirmationModal).vm.$emit('confirm')
    await flushPromises()

    expect(removeCurrentUserFromAccountsMock).toHaveBeenCalledExactlyOnceWith({ accountIds: selectedFolderIds })
    expect(displayNotificationMock).toHaveBeenCalledWith('success', 'You removed yourself from the 2 selected folders.')
    expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
    expect(wrapper.findComponent(ManageWalletButton).props('selectedFoldersCount')).toBe(0)
  })

  it('displays a warning notification when multiple folders remain unprocessed', async () => {
    const walletItems = [
      ...mockedQueryResult.items,
      {
        ...mockedQueryResult.items[0],
        accountId: 999,
      },
    ]
    mockFetchWalletData.mockResolvedValueOnce({
      ...mockedQueryResult,
      items: walletItems,
      totalItems: 3,
    })
    const wrapper = createWrapper()
    await flushPromises()
    const selectedFolderIds = walletItems
      .slice(0, 3)
      .map(({ accountId }) => accountId)
    removeCurrentUserFromAccountsMock.mockResolvedValueOnce({
      succeeded: [{
        accountId: selectedFolderIds[0],
        errorCode: null,
        errorMessage: null,
      }],
      failed: selectedFolderIds.slice(1).map(accountId => ({
        accountId,
        errorCode: 'ACC004',
        errorMessage: 'Error',
      })),
    })

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', ManageWalletAction.REMOVE_FROM_FOLDERS)
    await flushPromises()
    wrapper.findComponent(RemoveFromFoldersConfirmationModal).vm.$emit('confirm')
    await flushPromises()

    expect(displayNotificationMock).toHaveBeenCalledWith(
      'warning',
      'You removed yourself from 1 folder out of 3. The remaining folders could not be processed, please try again.',
    )
  })

  it('displays a warning notification when one folder remains unprocessed', async () => {
    const walletItems = [
      ...mockedQueryResult.items,
      {
        ...mockedQueryResult.items[0],
        accountId: 999,
      },
    ]
    mockFetchWalletData.mockResolvedValueOnce({
      ...mockedQueryResult,
      items: walletItems,
      totalItems: 3,
    })
    const wrapper = createWrapper()
    await flushPromises()
    const selectedFolderIds = walletItems
      .slice(0, 3)
      .map(({ accountId }) => accountId)
    removeCurrentUserFromAccountsMock.mockResolvedValueOnce({
      succeeded: selectedFolderIds.slice(0, 2).map(accountId => ({
        accountId,
        errorCode: null,
        errorMessage: null,
      })),
      failed: [{
        accountId: selectedFolderIds[2],
        errorCode: 'ACC004',
        errorMessage: 'Error',
      }],
    })

    const tableData = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    tableData.vm.$emit('update:selectedFolderIds', selectedFolderIds)
    await nextTick()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', ManageWalletAction.REMOVE_FROM_FOLDERS)
    await flushPromises()
    wrapper.findComponent(RemoveFromFoldersConfirmationModal).vm.$emit('confirm')
    await flushPromises()

    expect(displayNotificationMock).toHaveBeenCalledWith(
      'warning',
      'You removed yourself from 2 folders out of 3. The remaining folder could not be processed, please try again.',
    )
  })

  it('opens the entity creator drawer for the create test account action', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    wrapper.findComponent(ManageWalletButton).vm.$emit('action-selected', ManageWalletAction.CREATE_TEST_ACCOUNT)
    await nextTick()

    expect(wrapper.findComponent({ name: 'EntityCreatorDrawer' }).exists()).toBe(true)
  })

  describe('manage wallet menu feature flag', () => {
    it('renders the legacy delegation buttons and hides the dropdown when the flag is off', async () => {
      isManageWalletMenuActivatedMock.mockReturnValue(false)
      hasPermissionMock.mockReturnValue(true)

      const wrapper = createWrapper()
      await flushPromises()

      expect(wrapper.findComponent(ManageWalletButton).exists()).toBe(false)
      expect(wrapper.text()).toContain('My delegations')
      expect(wrapper.text()).toContain('Create a test account')
    })

    it('opens the delegation drawer when the legacy delegation button is clicked', async () => {
      isManageWalletMenuActivatedMock.mockReturnValue(false)

      const wrapper = createWrapper()
      await flushPromises()

      const delegationButton = wrapper
        .findAllComponents({ name: 'PButton' })
        .find((button) => button.text().includes('My delegations'))
      delegationButton?.vm.$emit('click')
      await nextTick()

      const delegationDrawer = wrapper.findComponent({ name: 'DelegationDrawer' })
      expect(delegationDrawer.exists()).toBe(true)
      expect(delegationDrawer.props('initialTab')).toBeUndefined()
    })
  })

  it('should call 2 api for get data', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(mockFetchWalletData).toHaveBeenCalledOnce()
    expect(wrapper.findComponent('[data-testid=folders-table]').exists()).toBeTruthy()
  })

  it("should send a request to manage favorite entities when 'handleAddFavorite' is called", async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleAddFavorite(mockedAccount.accountId, true)
    await flushPromises()

    expect(manageFavoriteEntitiesMock).toHaveBeenCalledExactlyOnceWith(mockedAccount.accountId, true)
  })

  it('should update the current page when it changes', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const pagination = wrapper.findComponent({ name: 'PPagination' })
    pagination.vm.$emit('update:pCurrentPage', 5)
    await nextTick()

    expect(wrapper.vm.searchCriteria.currentPage).toBe(5)
  })

  it('should call api when user search', async () => {
    const wrapper = createWrapper()
    const SEARCH_VALUE = 'customSearchValue'

    const formSearch = wrapper.findComponent({ name: 'FormSearch' })
    formSearch.vm.$emit('search-value-submitted', SEARCH_VALUE)
    await nextTick()

    const expectedSearchCriteria = getMockedSearchCriteria({
      currentPage: 1,
      filterByDeploymentStatus: undefined,
      filterByMissionType: undefined,
      isCustomerRelationFilter: false,
      isFavoriteFilter: false,
      limit: 90,
      search: SEARCH_VALUE,
      sorting: {
        descending: false,
        field: '',
      },
    })

    expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
    expect(mockFetchWalletData).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expectedSearchCriteria,
    )
  })

  it('should not call api when user search with less than 3 characters', async () => {
    const wrapper = createWrapper()
    const formSearch = wrapper.findComponent({ name: 'FormSearch' })

    formSearch.vm.$emit('search-value-submitted', 'az')

    expect(mockFetchWalletData).toHaveBeenCalledOnce()
    expect(mockFetchWalletData).not.toHaveBeenCalledTimes(2)
  })

  it('displays drawer when click on deploy', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const table = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    table.vm.$emit('click-deploy', 1, 'a', 'b')
    await flushPromises()

    const offersDrawer = wrapper.findComponent({ name: 'OffersDrawer' })
    expect(offersDrawer.props('modelValue')).toBe(true)
  })

  it('reload offers and close drawer when it emits offer-saved', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const table = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    table.vm.$emit('click-deploy', 1, 'a', 'b')
    await flushPromises()

    const offersDrawer = wrapper.findComponent({ name: 'OffersDrawer' })
    offersDrawer.vm.$emit('offer-saved')
    await flushPromises()

    expect(mockFetchWalletData).toHaveBeenCalledTimes(2)

    const offersDrawerAfter = wrapper.findComponent({ name: 'OffersDrawer' })
    expect(offersDrawerAfter.props('modelValue')).toBe(false)
  })

  it('removes drawer when it has been closed', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const table = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    table.vm.$emit('click-deploy', 1, 'a', 'b')
    await flushPromises()

    const offersDrawer = wrapper.findComponent({ name: 'OffersDrawer' })
    expect(offersDrawer.props('modelValue')).toBe(true)

    offersDrawer.vm.$emit('update:modelValue', false)
    await nextTick()

    expect(offersDrawer.props('modelValue')).toBe(false)
  })

  it('should redirect when click on access folder', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const table = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    table.vm.$emit('access', '8126f51d-c834-4fda-82ea-00d51ee11983')
    await nextTick()

    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: RouteName.ENTITY_REDIRECT,
      params: { [RouteParam.ENTITY_ID]: '8126f51d-c834-4fda-82ea-00d51ee11983' },
    })
  })

  it("should open the activation email drawer when the 'Resend Activation Mail' button is clicked", async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const table = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    table.vm.$emit('displayResendActivationEmailDrawer', mockedAccount)
    await nextTick()

    expect(wrapper.vm.selectedAccount).toStrictEqual(mockedAccount)
    expect(wrapper.vm.isResendActivationEmailDrawerVisible).toBeTruthy()
  })
  it("should emit the 'update:modelValue' event when the v-model of ResendActivationEmail is updated", async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const table = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    table.vm.$emit('displayResendActivationEmailDrawer', mockedAccount)
    await nextTick()
    const resendActivationEmailDrawer = wrapper.findComponent({ name: 'ResendActivationEmailDrawer' })
    resendActivationEmailDrawer.vm.$emit('update:modelValue', false)
    await nextTick()

    expect(wrapper.vm.isResendActivationEmailDrawerVisible).toBeFalsy()
    expect(resendActivationEmailDrawer.emitted('update:modelValue')).toStrictEqual([[false]])
  })

  it('displays a specific component if no items in response API', async () => {
    const mockedQueryResultNoItems = getMockedWalletQueryResult({
      currentPage: 1,
      totalPage: 1,
      totalItems: 0,
      items: [],
    })
    mockFetchWalletData.mockResolvedValueOnce(mockedQueryResultNoItems)

    const wrapper = createWrapper()
    await flushPromises()

    const noResult = wrapper.findComponent({ name: 'NoResult' })
    expect(noResult.exists()).toBeTruthy()
  })

  it('should call api with the right filter when filterByStatus event is triggered', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const tags = wrapper.findComponent('[data-testid=filters]') as VueWrapper
    tags.vm.$emit('filterByStatus', EntityStatus.TO_DEPLOY)
    await nextTick()
    await flushPromises()

    const expectedSearchCriteria = getMockedSearchCriteria({
      currentPage: 0,
      filterByDeploymentStatus: [EntityStatus.TO_DEPLOY.toString()],
      limit: 30,
    })
    // base call + filter call
    expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
    expect(mockFetchWalletData).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expectedSearchCriteria,
    )
  })

  it('should call api without filter when removeFilter event is triggered', async () => {
    const wrapper = createWrapper()
    await nextTick()

    await flushPromises()

    const tags = wrapper.findComponent('[data-testid="filters"]') as VueWrapper
    tags.vm.$emit('removeFilter')
    await flushPromises()

    const expectedSearchCriteria = getMockedSearchCriteria({
      currentPage: 0,
      limit: 30,
    })

    expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
    expect(mockFetchWalletData).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expectedSearchCriteria,
    )
  })

  it('should not displayed the filters component if the user is client', async () => {
    userStoreMock.isCollab = false
    const wrapper = createWrapper()

    await flushPromises()
    const filters = wrapper.findComponent('[data-testid=filters]') as VueWrapper
    expect(filters.exists()).toBeFalsy()
  })

  it.each([
    {
      accountNumber: ['100'],
      expectedSearchValue: '100',
    },
    {
      accountNumber: ['100', '200'],
      expectedSearchValue: '100',
    },
    {
      accountNumber: '100',
      expectedSearchValue: '100',
    },
  ])('should fetch entities when route has $accountNumber accountNumbers query', async ({ accountNumber, expectedSearchValue }) => {
    routeMockData.query.accountNumbers = accountNumber
    createWrapper()
    await nextTick()
    await flushPromises()

    const expectedSearchCriteria = getMockedSearchCriteria({
      currentPage: 0,
      filterByDeploymentStatus: undefined,
      filterByMissionType: undefined,
      isCustomerRelationFilter: false,
      isFavoriteFilter: false,
      limit: 90,
      search: expectedSearchValue,
      sorting: {
        descending: false,
        field: '',
      },
    })
    expect(mockFetchWalletData).toHaveBeenCalledTimes(1)
    expect(mockFetchWalletData).toHaveBeenNthCalledWith(
      1,
      expect.anything(),
      expectedSearchCriteria,
    )
  })

  it('should NOT fetch entities when route has an unappropriate accountNumbers query', async () => {
    routeMockData.query.accountNumbers = undefined
    createWrapper()
    await flushPromises()

    expect(mockFetchWalletData).toHaveBeenCalledTimes(1)
  })

  describe('manageAccessButton', () => {
    const tests = [{
      hasManageAccessAuthorisation: false,
      expected: false,
      should: 'NOT display',
      description: 'user does NOT have manage access authorisation',
    }, {
      hasManageAccessAuthorisation: true,
      expected: true,
      should: 'NOT display',
      description: 'user has manage access authorisation',
    }]
    it.each(tests)('should $should when $description', async ({
      hasManageAccessAuthorisation,
      expected,
    }) => {
      hasPermissionMock.mockReturnValue(hasManageAccessAuthorisation)

      const wrapper = createWrapper()
      await flushPromises()

      const manageAccessButton = wrapper.find('[data-testid="manage-access-button"]')
      const manageAccessCount = wrapper.find('[data-testid="manage-access-count"]')
      const manageAccessDrawer = wrapper.find('[data-testid="manage-access-drawer-global"]')

      expect(manageAccessButton.exists()).toBe(expected)
      expect(manageAccessDrawer.exists()).toBe(expected)
      expect(manageAccessCount.exists()).toBe(expected)
      if (expected) {
        expect(fetchAccountOperationsMock).toHaveBeenCalledOnce()
      } else {
        expect(fetchAccountOperationsMock).not.toHaveBeenCalled()
      }
    })

    const manageButtonStateTests = [{
      totalItemsMock: undefined,
      expectedDisabled: true,
      descriptions: 'count is undefined',
    }, {
      totalItemsMock: 0,
      expectedDisabled: true,
      descriptions: 'count is zero',
    }, {
      totalItemsMock: 1,
      expectedDisabled: false,
      descriptions: 'count is 1',
    }, {
      totalItemsMock: 13,
      expectedDisabled: false,
      descriptions: 'count is 13',
    }]
    it.each(manageButtonStateTests)('should display manageAccessCount properly when $descriptions', async ({
      totalItemsMock,
      expectedDisabled,
    }) => {
      const accountOperationMock = getPaginationMock<AccountOperations>({
        totalItems: totalItemsMock,
      })
      const expectedManageAccessCount = `${totalItemsMock}`

      hasPermissionMock.mockReturnValue(true)
      fetchAccountOperationsMock.mockResolvedValue(accountOperationMock)

      const wrapper = createWrapper()
      await flushPromises()

      const buttons = wrapper.findAllComponents({ name: 'PButton' })
      const manageAccessButton = buttons[0]
      const manageAccessCount = wrapper.find('[data-testid="manage-access-count"]')
      const expectedAmplitudeEventName = 'Registry Validation Initiated'
      const expectedAmplitudeParams = {
        registry_validation_initialisation_localisation: 'portefeuille',
      }

      manageAccessButton.vm.$emit('click')

      expect(manageAccessButton.props('pDisabled')).toBe(expectedDisabled)
      if (totalItemsMock === undefined) {
        expect(manageAccessCount.exists()).toBe(false)
      } else {
        expect(manageAccessCount.text()).toBe(expectedManageAccessCount)
      }
      if (totalItemsMock === undefined || totalItemsMock === 0) {
        expect(AmplitudeServiceMock.track).not.toHaveBeenCalled()
      } else {
        expect(AmplitudeServiceMock.track).toHaveBeenCalledExactlyOnceWith(expectedAmplitudeEventName, expectedAmplitudeParams)
      }
    })
  })

  describe('AccountFiltersDrawer', () => {
    let wrapper: ReturnType<typeof createWrapper>
    let accountFiltersDrawer: VueWrapper<InstanceType<typeof AccountFiltersDrawer>>

    beforeEach(async () => {
      wrapper = createWrapper()
      await flushPromises()
      accountFiltersDrawer = wrapper.findComponent(AccountFiltersDrawer)
    })

    it('displays the filter count pastille when filters are applied', async () => {
      // Arrange: Apply a single filter via drawer emit
      accountFiltersDrawer.vm.$emit('apply-filters', {
        isFavoriteFilter: false,
        isCustomerRelationFilter: true,
      })
      await nextTick()

      // Act: Get the filter count pastille element
      const filterCountPastille = wrapper.find('[data-testid="account-deploy__filter-count"]')

      // Assert: Should show pastille with count 1
      expect(filterCountPastille.exists()).toBe(true)
      expect(filterCountPastille.text()).toBe('1')
    })

    it('applies mission type and status filters to the account query', async () => {
      accountFiltersDrawer.vm.$emit('apply-filters', {
        isFavoriteFilter: false,
        isCustomerRelationFilter: false,
        missionTypeFilter: [MISSION_TYPE.TENUE],
        deploymentStatusFilter: [EntityStatus.CONNECTED.toString()],
      })
      await nextTick()
      await flushPromises()

      const expectedSearchCriteria = getMockedSearchCriteria({
        currentPage: 0,
        filterByDeploymentStatus: [EntityStatus.CONNECTED.toString()],
        filterByMissionType: [MISSION_TYPE.TENUE],
        isCustomerRelationFilter: false,
        isFavoriteFilter: false,
        limit: 90,
        search: '',
        sorting: {
          descending: false,
          field: '',
        },
      })
      const filterCountPastille = wrapper.find('[data-testid="account-deploy__filter-count"]')

      expect(filterCountPastille.text()).toBe('2')
      expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
      expect(mockFetchWalletData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expectedSearchCriteria,
      )
    })

    it('displays the "Clear all" action when filters are applied', async () => {
      // Arrange: Apply filters
      accountFiltersDrawer.vm.$emit('apply-filters', {
        isFavoriteFilter: false,
        isCustomerRelationFilter: true,
      })
      const expectedSearchCriteria = getMockedSearchCriteria({
        currentPage: 0,
        filterByDeploymentStatus: undefined,
        filterByMissionType: undefined,
        isCustomerRelationFilter: true,
        isFavoriteFilter: false,
        limit: 90,
        search: '',
        sorting: {
          descending: false,
          field: '',
        },
      })
      await nextTick()
      await flushPromises()

      // Act: Click clear button
      const clearAllButton = wrapper.find('[data-testid="account-deploy__clear-filters-button"]')

      // Assert: Button exists and triggers correct fetch
      expect(clearAllButton.exists()).toBe(true)
      expect(clearAllButton.text().trim()).toBe('Clear all')

      // Call count explanation:
      // 1 - onMounted → fetchAccountList()
      // 2 - searchCriteria watcher after applyAccountFilters()
      expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
      expect(mockFetchWalletData).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expectedSearchCriteria,
      )
    })

    it('opens the filter drawer when the filter button is clicked', async () => {
      // Arrange: Get button and confirm initial drawer state
      const filterButton = wrapper.find('[data-testid="account-deploy__filter-button"]')
      expect(accountFiltersDrawer.props('modelValue')).toBe(false)

      // Act: Trigger click
      await filterButton.trigger('click')

      // Assert: Drawer should be open now
      expect(accountFiltersDrawer.props('modelValue')).toBe(true)
    })

    it('emits "clear-filters" when the "Clear All" button is clicked after applying filters', async () => {
      // Arrange: Apply filters to activate "Clear All"
      accountFiltersDrawer.vm.$emit('apply-filters', {
        isFavoriteFilter: false,
        isCustomerRelationFilter: true,
      })
      await nextTick()

      const clearAllButton = wrapper.find('[data-testid="account-deploy__clear-filters-button"]')

      // Act: Click the clear button
      await clearAllButton.trigger('click')

      const expectedSearchCriteria = getMockedSearchCriteria({
        currentPage: 0,
        filterByDeploymentStatus: undefined,
        filterByMissionType: undefined,
        isCustomerRelationFilter: false,
        isFavoriteFilter: false,
        limit: 90,
        search: '',
        sorting: {
          descending: false,
          field: '',
        },
      })

      // Assert: fetchAccountList() called again after clearing
      // Call count explanation:
      // 1 - onMounted → fetchAccountList()
      // 2 - searchCriteria watcher after applyAccountFilters()
      // 3 - searchCriteria watcher after clearAllAccountFilters()
      expect(mockFetchWalletData).toHaveBeenCalledTimes(3)
      expect(mockFetchWalletData).toHaveBeenNthCalledWith(
        3,
        expect.anything(),
        expectedSearchCriteria,
      )
    })
  })

  describe('ManageAccessDrawerGlobal', () => {
    const totalItemsMock = 1
    const accountOperationMock = getPaginationMock<AccountOperations>({
      items: accountOperationsListMock,
      totalItems: totalItemsMock,
      totalPages: totalPagesMock,
    })

    beforeEach(() => {
      hasPermissionMock.mockReturnValue(true)
      fetchAccountOperationsMock.mockResolvedValue(accountOperationMock)
    })

    it('should display ManageAccessDrawerGlobal with proper props', async () => {
      const wrapper = createWrapper()
      await flushPromises()

      const expectedPropsBefore = {
        trackingLocalisation: TrackingLocalisation.WALLET,
        modelValue: false,
      }
      const expectedPropsAfter = {
        ...expectedPropsBefore,
        modelValue: true,
      }
      const manageAccessDrawer = wrapper.findComponent({ name: 'ManageAccessDrawerGlobal' })
      const manageAccessButton = wrapper.find('[data-testid="manage-access-button"]')

      expect(manageAccessDrawer.props()).toStrictEqual(expectedPropsBefore)

      manageAccessButton.trigger('click')
      await flushPromises()
      await nextTick()

      expect(manageAccessDrawer.props()).toStrictEqual(expectedPropsAfter)
    })

    it('should call loadManageAccessCount when user closes ManageAccessDrawerGlobal', async () => {
      const wrapper = createWrapper()

      const manageAccessDrawer = wrapper.findComponent({ name: 'ManageAccessDrawerGlobal' })
      expect(manageAccessDrawer.exists()).toBe(true)

      expect(fetchAccountOperationsMock).toHaveBeenCalledOnce()

      manageAccessDrawer.vm.$emit('update:model-value', true)
      await flushPromises()
      expect(fetchAccountOperationsMock).toHaveBeenCalledOnce()

      manageAccessDrawer.vm.$emit('update:model-value', false)
      await flushPromises()

      expect(fetchAccountOperationsMock).toHaveBeenCalledTimes(2)
    })

    it('should call fetchOperations properly when current page is bigger than page count', async () => {
      const wrapper = createWrapper()
      const newPage = 13

      const manageAccessDrawer = wrapper.findComponent({ name: 'ManageAccessDrawerGlobal' })
      expect(manageAccessDrawer.exists()).toBe(true)

      expect(fetchAccountOperationsMock).toHaveBeenCalledOnce()

      manageAccessDrawer.vm.$emit('update:current-page', newPage)
      manageAccessDrawer.vm.$emit('update-operation-table')
      await flushPromises()

      const expectedPage = 1
      const expectedPageSize = 1
      const expectedParameters = [expectedPage, expectedPageSize]

      expect(fetchAccountOperationsMock).toHaveBeenCalledOnce()
      expect(fetchAccountOperationsMock).toHaveBeenCalledWith(...expectedParameters)
    })
  })
})
