import { getPaginationMock, amplitudeServiceMock, amplitudeServiceTrackMock } from '@pulse/common/mocks'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { commonStore, commonPinia as pinia } from '@pulse/common'
import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'
import { nextTick, reactive } from 'vue'
import { getMockedWalletQueryResult, getMockedSearchCriteria } from './DeployUtilsMock'
import { getMockedAccount } from '@entities/__mocks__/account-row.mocks'
import type { ComponentWrapper } from '@entities/common/types'
import { isAccessManagementGlobalActivatedMock, featureFlagManagerMock, loggerMock } from '@pulse/core/mocks'
import { contactServiceMock, fetchOperationsByAccountMock } from '@entities/__mocks__/contact.service.mocks'
import { AccountOperations } from '@entities/services/contact/contactTypes'
import { getAccountOperationsListMock } from '@entities/__mocks__/operations.mocks'
import { TrackingLocalisation } from '@entities/pages/folder/enums/tracking.enums'

import Deploy from '.'

const mockedAccount = getMockedAccount()

const accountOperationsListMock = getAccountOperationsListMock()

vi.mock('@pulse/core', () => ({
  logger: loggerMock,
  FeatureFlagManager: featureFlagManagerMock,
}))

vi.mock('@entities/services/contact', () => contactServiceMock)

const putFavoriteMock = vi.fn()
const mockedQueryResult = getMockedWalletQueryResult()

const getFavoritesMock = vi.fn(() =>
  Promise.resolve({
    data: [
      {
        id: 'customId',
        name: 'customName',
      },
    ],
  }),
)
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

const hasPermissionMock = vi.hoisted(() => vi.fn())
const userPermissionsMock = vi.hoisted(() => vi.fn(() => ({
  hasPermission: hasPermissionMock,
})))

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
  commonPinia: () => createPinia(),
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        token: 'token',
        entities: {
          default: {
            name: 'Tesla',
          },
        },
      },
    }),
    getters: {
      isAuthenticated: () => true,
      isCollab: () => true,
    },
  }),
  userPermissions: userPermissionsMock,
  amplitudeService: amplitudeServiceMock,
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

const createWrapper = (): ComponentWrapper<InstanceType<typeof Deploy>> =>
  shallowMount(Deploy, {
    attachTo: document.body,
    plugins: [createTestingPinia()],
    global: {
      stubs: {
        Filters: true,
        DelegationDrawer: true,
        PLoader: true,
        NoResult: true,
        PPagination: true,
        ResendActivationEmailDrawer: true,
        OffersDrawer: true,
        ManageAccessDrawer: {
          name: 'ManageAccessDrawer',
          template: '<div />',
          props: {
            currentPage: [Number],
            modelValue: [Boolean],
            accountOperationsList: [Array],
            pageCount: [Number],
            pageSize: [Number],
            showAccountName: [Boolean],
            showPagination: [Boolean],
            trackingLocalisation: [TrackingLocalisation],
          },
          methods: {
            resetOpenedAccordions: () => {},
          },
        },
        TableData: true,
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
      },
    },
  })

const findSubscriptionDrawer = (wrapper: VueWrapper) =>
  wrapper.findComponent('[data-testid=offers-drawer]') as VueWrapper

setActivePinia(pinia)

describe('deploy', () => {
  beforeEach(() => {
    mockedGatewayGet.mockResolvedValue(mockedAccount)
    mockFetchWalletData
      .mockResolvedValue(mockedQueryResult)
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
    await nextTick()

    const subscriptionDrawer = findSubscriptionDrawer(wrapper)
    expect(subscriptionDrawer.exists()).toBeTruthy()
  })

  it('removes drawer when it has been closed', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const table = wrapper.findComponent('[data-testid=folders-table]') as VueWrapper
    table.vm.$emit('click-deploy', 1, 'a', 'b')
    await nextTick()

    const subscriptionDrawer = findSubscriptionDrawer(wrapper)
    expect(subscriptionDrawer.exists()).toBeTruthy()
    subscriptionDrawer.vm.$emit('update:modelValue', false)
    await nextTick()

    const subscriptionDrawerAfter = findSubscriptionDrawer(wrapper)
    expect(subscriptionDrawerAfter.exists()).toBeFalsy()
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
      params: { id: '8126f51d-c834-4fda-82ea-00d51ee11983' },
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
    const tags = wrapper.findComponent('[data-testid=filters]') as VueWrapper
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
    const wrapper = createWrapper()
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
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

      expect(manageAccessButton.exists()).toBe(expected)
      expect(manageAccessCount.exists()).toBe(expected)
      if (expected) {
        expect(fetchOperationsByAccountMock).toHaveBeenCalledOnce()
      } else {
        expect(fetchOperationsByAccountMock).not.toHaveBeenCalled()
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
      fetchOperationsByAccountMock.mockResolvedValue(accountOperationMock)

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
        expect(amplitudeServiceTrackMock).not.toHaveBeenCalled()
      } else {
        expect(amplitudeServiceTrackMock).toHaveBeenCalledOnce()
        expect(amplitudeServiceTrackMock).toHaveBeenCalledWith(expectedAmplitudeEventName, expectedAmplitudeParams)
      }
    })
  })

  describe('ManageAccessDrawer', () => {
    const totalItemsMock = 1
    const accountOperationMock = getPaginationMock<AccountOperations>({
      items: accountOperationsListMock,
      totalItems: totalItemsMock,
    })

    beforeEach(() => {
      hasPermissionMock.mockReturnValue(true)
      isAccessManagementGlobalActivatedMock.mockReturnValue(true)
      fetchOperationsByAccountMock.mockResolvedValue(accountOperationMock)
    })

    it('should display ManageAccessDrawer with proper props', async () => {
      const wrapper = createWrapper()
      await flushPromises()

      const expectedPropsBefore = {
        currentPage: 1,
        trackingLocalisation: TrackingLocalisation.WALLET,
        modelValue: false,
        accountOperationsList: [],
        pageCount: 1,
        pageSize: 5,
        showAccountName: true,
        showPagination: false,
      }
      const expectedPropsAfter = {
        ...expectedPropsBefore,
        modelValue: true,
        accountOperationsList: accountOperationsListMock,
      }
      const manageAccessDrawer = wrapper.findComponent({ name: 'ManageAccessDrawer' })
      const manageAccessButton = wrapper.find('[data-testid="manage-access-button"]')
      const expectedPage = 1
      const expectedPageSize = 5
      const expectedParameters = [expectedPage, expectedPageSize]

      expect(manageAccessDrawer.props()).toStrictEqual(expectedPropsBefore)

      manageAccessButton.trigger('click')
      await flushPromises()
      await nextTick()

      expect(fetchOperationsByAccountMock).toHaveBeenCalledTimes(2)
      expect(fetchOperationsByAccountMock).toHaveBeenNthCalledWith(2, ...expectedParameters)
      expect(manageAccessDrawer.props()).toStrictEqual(expectedPropsAfter)
    })

    it('should call loadManageAccessCount when user closes ManageAccessDrawer', async () => {
      const wrapper = createWrapper()

      const manageAccessDrawer = wrapper.findComponent({ name: 'ManageAccessDrawer' })
      expect(manageAccessDrawer.exists()).toBe(true)

      expect(fetchOperationsByAccountMock).toHaveBeenCalledOnce()

      manageAccessDrawer.vm.$emit('update:model-value', true)
      await flushPromises()
      expect(fetchOperationsByAccountMock).toHaveBeenCalledOnce()

      manageAccessDrawer.vm.$emit('update:model-value', false)
      await flushPromises()

      expect(fetchOperationsByAccountMock).toHaveBeenCalledTimes(2)
    })


    it('should call loadManageAccessCount when ManageAccessDrawer emits update-operation-table', async () => {
      const wrapper = createWrapper()

      const manageAccessDrawer = wrapper.findComponent({ name: 'ManageAccessDrawer' })
      expect(manageAccessDrawer.exists()).toBe(true)

      expect(fetchOperationsByAccountMock).toHaveBeenCalledOnce()

      manageAccessDrawer.vm.$emit('update-operation-table')
      await flushPromises()

      expect(fetchOperationsByAccountMock).toHaveBeenCalledTimes(2)
    })

    it('ManageAccessDrawer pagination', async () => {
      const totalItemsMock = 15
      const accountOperationMock = getPaginationMock<AccountOperations>({
        items: accountOperationsListMock,
        totalItems: totalItemsMock,
      })
      const newPage = 13
      const expectedPage = newPage
      const expectedPageSize = 5

      hasPermissionMock.mockReturnValue(true)
      isAccessManagementGlobalActivatedMock.mockReturnValue(true)
      fetchOperationsByAccountMock.mockResolvedValue(accountOperationMock)

      const wrapper = createWrapper()
      await flushPromises()

      const manageAccessDrawer = wrapper.findComponent({ name: 'ManageAccessDrawer' })
      manageAccessDrawer.vm.$emit('update:current-page', newPage)

      expect(fetchOperationsByAccountMock).toHaveBeenCalledTimes(2)
      expect(fetchOperationsByAccountMock).toHaveBeenNthCalledWith(2, expectedPage, expectedPageSize)
    })
  })
})
