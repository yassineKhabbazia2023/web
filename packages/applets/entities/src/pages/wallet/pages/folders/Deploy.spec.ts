import {
  AmplitudeServiceMock,
  getPaginationMock,
  getMockedUserInfo,
  getMockedEntities,
  SelectedEntityManagerMock,
  hasPermissionMock,
  CurrentUserManagerMock,
  getStoreMock,
} from '@pulse/common/mocks'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'
import { nextTick, reactive } from 'vue'
import { getMockedWalletQueryResult, getMockedSearchCriteria } from './DeployUtilsMock'
import { getMockedAccount } from '@entities/__mocks__/account-row.mocks'
import type { ComponentWrapper } from '@entities/common/types'
import { isAccessManagementGlobalActivatedMock, featureFlagManagerMock, loggerMock } from '@pulse/core/mocks'
import { contactServiceMock, fetchAccountOperationsMock } from '@entities/__mocks__/contact.service.mocks'
import type { AccountOperations } from '@entities/services/contact/contactTypes'
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'
import type { Entity } from '@pulse/common/types'
import { useUserStore } from '@pulse/common/stores'
import { RouteParam } from '@pulse/common/enums'
import AccountFiltersDrawer from './components/AccountFiltersDrawer/AccountFiltersDrawer.vue'

import Deploy from '.'

const userStoreMock = getStoreMock(useUserStore)
const mockedAccount = getMockedAccount()
const totalPagesMock = 5

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

vi.mock('@entities/services/contact', () => contactServiceMock)

const putFavoriteMock = vi.fn()
const getFavoritesMock = vi.fn()
const accountOperationsListMock = getAccountOperationsListMock()

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

vi.mock('@entities/services/contact', () => contactServiceMock)

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

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
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
  name: 'folders',
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
vi.mock('./DeployUtils', async () => ({
  fetchWalletData: mockFetchWalletData,
}))

vi.mock('@pulse/common/managers', () => ({
  SelectedEntityManager: SelectedEntityManagerMock,
  CurrentUserManager: CurrentUserManagerMock,
}))

const createWrapper = (): ComponentWrapper<InstanceType<typeof Deploy>> =>
  shallowMount(Deploy, {
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
    mockedGatewayGet.mockResolvedValue(mockedAccount)
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

  it('should display correct button by number of selected ibs', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const button = wrapper.findComponent({ name: 'PButton' })
    const tableData = wrapper.findComponent({ name: 'tableData' })

    expect(button.text()).toBe('Delegate my wallet')

    tableData.vm.$emit('selected-folder', mockedQueryResult.items.at(0))
    await nextTick()

    expect(button.text()).toBe('Delegate my folder')

    tableData.vm.$emit('selected-folder', mockedQueryResult.items.at(1))
    await nextTick()

    expect(button.text()).toBe('Delegate my folders')
  })

  it('should call 2 api for get data', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(mockFetchWalletData).toHaveBeenCalledOnce()
    expect(wrapper.findComponent({ name: 'TableData' }).exists()).toBeTruthy()
  })

  it("should send a request to manage favorite entities when 'handleAddFavorite' is called", async () => {
    const wrapper = createWrapper()
    wrapper.vm.handleAddFavorite(mockedAccount.accountId, true)
    await flushPromises()

    expect(manageFavoriteEntitiesMock).toHaveBeenCalledOnce()
    expect(manageFavoriteEntitiesMock).toHaveBeenCalledWith(
      mockedAccount.accountId,
      true,
    )
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
      filterByDeploymentStatus: '',
      isCustomerRelationFilter: false,
      isFavoriteFilter: false,
      limit: 15,
      search: SEARCH_VALUE,
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

    const table = wrapper.findComponent({ name: 'TableData' })
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
      name: 'folder',
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
      filterByDeploymentStatus: '1',
      limit: 15,
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
      limit: 15,
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
      filterByDeploymentStatus: '',
      isCustomerRelationFilter: false,
      isFavoriteFilter: false,
      limit: 15,
      search: expectedSearchValue,
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
      isAccessManagementGlobalActivated: false,
      hasManageAccessAuthorisation: false,
      expected: false,
      should: 'NOT display',
      description: 'feature flag is NOT activated and user does NOT have manage access authorisation',
    }, {
      isAccessManagementGlobalActivated: true,
      hasManageAccessAuthorisation: false,
      expected: false,
      should: 'NOT display',
      description: 'feature flag is activated but user does NOT have manage access authorisation',
    }, {
      isAccessManagementGlobalActivated: false,
      hasManageAccessAuthorisation: true,
      expected: false,
      should: 'NOT display',
      description: 'user has manage access authorisation but feature flag is NOT activated',
    }, {
      isAccessManagementGlobalActivated: true,
      hasManageAccessAuthorisation: true,
      expected: true,
      should: 'display',
      description: 'feature flag is activated and user has manage access authorisation',
    }]
    it.each(tests)('should $should when $description', async ({
      isAccessManagementGlobalActivated,
      hasManageAccessAuthorisation,
      expected,
    }) => {
      hasPermissionMock
        .mockReturnValueOnce(true)
        .mockReturnValueOnce(hasManageAccessAuthorisation)
      isAccessManagementGlobalActivatedMock.mockReturnValue(isAccessManagementGlobalActivated)
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
      isAccessManagementGlobalActivatedMock.mockReturnValue(true)
      fetchAccountOperationsMock.mockResolvedValue(accountOperationMock)

      const wrapper = createWrapper()
      await flushPromises()

      const buttons = wrapper.findAllComponents({ name: 'PButton' })
      const manageAccessButton = buttons[2]
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
        expect(AmplitudeServiceMock.track).toHaveBeenCalledOnce()
        expect(AmplitudeServiceMock.track).toHaveBeenCalledWith(expectedAmplitudeEventName, expectedAmplitudeParams)
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

    it('displays the "Clear all" action when filters are applied', async () => {
      // Arrange: Apply filters
      accountFiltersDrawer.vm.$emit('apply-filters', {
        isFavoriteFilter: false,
        isCustomerRelationFilter: true,
      })
      const expectedSearchCriteria = getMockedSearchCriteria({
        currentPage: 0,
        filterByDeploymentStatus: '',
        isCustomerRelationFilter: true,
        isFavoriteFilter: false,
        limit: 15,
        search: '',
      })
      await nextTick()

      // Act: Click clear button
      const clearAllButton = wrapper.find('[data-testid="account-deploy__clear-filters-button"]')

      // Assert: Button exists and triggers correct fetch
      expect(clearAllButton.exists()).toBe(true)
      expect(clearAllButton.text().trim()).toBe('Clear all')

      // Call count explanation:
      // 1 - onMounted → fetchAccountList()
      // 2 - fetchTableDataAndFavorites() → fetchFavoriteEntities()
      // 3 - applyAccountFilters() → fetchAccountList()
      expect(mockFetchWalletData).toHaveBeenCalledTimes(3)
      expect(mockFetchWalletData).toHaveBeenNthCalledWith(
        3,
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
        filterByDeploymentStatus: '',
        isCustomerRelationFilter: false,
        isFavoriteFilter: false,
        limit: 15,
        search: '',
      })

      // Assert: fetchAccountList() called again after clearing
      // Call count explanation:
      // 1 - onMounted → fetchAccountList()
      // 2 - fetchTableDataAndFavorites() → fetchFavoriteEntities()
      // 3 - applyAccountFilters() → fetchAccountList()
      // 4 - clearAllAccountFilters() → fetchAccountList()
      // 5 - searchCriteria watcher triggers fetchAccountList()
      expect(mockFetchWalletData).toHaveBeenCalledTimes(5)
      expect(mockFetchWalletData).toHaveBeenNthCalledWith(
        5,
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
      isAccessManagementGlobalActivatedMock.mockReturnValue(true)
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
