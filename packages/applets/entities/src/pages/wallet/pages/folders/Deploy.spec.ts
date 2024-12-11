import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { type MockInstance, describe, expect, it, vi, beforeEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { commonStore, commonPinia as pinia } from '@pulse/common'
import TableData from '../../components/TableData'
import Deploy from '.'
import { EntityStatus } from '@entities/pages/wallet/components/Filters/FiltersTypes'
import * as DeployUtils from './DeployUtils'
import { nextTick } from 'vue'
import {
  getMockedWalletQueryResult,
  getMockedSearchCriteria,
} from './DeployUtilsMock'
import { getMockedAccount } from '@entities/services/account/accountMock'
import * as walletServices from '@entities/services/wallet'
import type { ComponentWrapper } from '@entities/common/types'

const mockedAccount = getMockedAccount()

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

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    wallet: {
      put: putFavoriteMock,
      get: () => getFavoritesMock(),
    },
    gateway: {
      get: vi.fn().mockImplementation((url) => {
        if (url.includes('account/api/accounts/')) {
          return Promise.resolve({
            data: mockedAccount,
          })
        }
        return Promise.reject(new Error(`unmnanaged url '${url}'`))
      }),
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
  userPermissions: () => ({
    hasPermission: vi.fn(),
  }),
}))

const mockRouterPush = vi.fn()
let queryAccountNumbers: string | string[] | undefined = ''
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...(actual as object),
    useRouter: () => ({
      push: mockRouterPush,
    }),
    useRoute: () => ({
      query: {
        accountNumbers: queryAccountNumbers,
      },
    }),
  }
})

vi.mock('./DeployUtils', async () => {
  return await vi.importActual('./DeployUtils')
})

const createWrapper = (): ComponentWrapper<InstanceType<typeof Deploy>> =>
  mount(Deploy, {
    attachTo: document.body,
    plugins: [createTestingPinia()],
    global: {
      stubs: ['Filters'],
    },
  })

const findSubscriptionDrawer = (wrapper: VueWrapper) =>
  wrapper.findComponent('[data-testid=offers-drawer]') as VueWrapper

setActivePinia(pinia)

describe('deploy', () => {
  let mockFetchWalletData: MockInstance
  beforeEach(() => {
    mockFetchWalletData = vi
      .spyOn(DeployUtils, 'fetchWalletData')
      .mockResolvedValue(mockedQueryResult)
  })

  it('should display correct button by number of selected ibs', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const button = wrapper.find('.el-button')
    expect(button.text()).toBe('Delegate my wallet')
    const checkbox = wrapper.findAllComponents({ name: 'ElCheckbox' })[0]
    await checkbox.trigger('click')
    expect(button.text()).toBe('Delegate my folder')
    const checkbox1 = wrapper.findAllComponents({ name: 'ElCheckbox' })[1]
    await checkbox1.trigger('click')
    expect(button.text()).toBe('Delegate my folders')
  })

  it('should call 2 api for get data', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(mockFetchWalletData).toHaveBeenCalledOnce()
    expect(wrapper.findComponent(TableData).exists()).toBeTruthy()
  })

  it("should send a request to manage favorite entities when 'handleAddFavorite' is called", async () => {
    const spyManageFavoriteEntities = vi.spyOn(
      walletServices,
      'manageFavoriteEntities',
    )
    const wrapper = createWrapper()
    wrapper.vm.handleAddFavorite(mockedAccount.accountId, true)
    await flushPromises()

    expect(spyManageFavoriteEntities).toHaveBeenCalledOnce()
    expect(spyManageFavoriteEntities).toHaveBeenCalledWith(
      mockedAccount.accountId,
      true,
    )
  })

  it('should update the current page when it changes', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const pagination = wrapper.findComponent({ name: 'PPagination' })
    pagination.vm.$emit('update:p-current-page', 5)
    await nextTick()

    expect(wrapper.vm.searchCriteria.currentPage).toBe(5)
  })

  it('should call api when user search', async () => {
    const wrapper = createWrapper()
    const SEARCH_VALUE = 'customSearchValue'

    await wrapper.find('input[type="search"]').setValue(SEARCH_VALUE)
    await wrapper.find('input[type="search"]').trigger('keyup')
    await flushPromises()

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

  // FIXME : skipped while integrating SG in monorepo
  it('should not call api when user search with less than 3 characters', async () => {
    const wrapper = createWrapper()

    await wrapper.find('input[type="search"]').setValue('az')
    await wrapper.find('input[type="search"]').trigger('keyup')
    await flushPromises()

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

    const expectedSearchCriteria = getMockedSearchCriteria({
      currentPage: 0,
      filterByDeploymentStatus: '1',
      limit: 15,
    })

    expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
    expect(mockFetchWalletData).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expectedSearchCriteria,
    )
  })

  it('should call api without filter when removeFilter event is triggered', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const tags = wrapper.findComponent('[data-testid=filters]') as VueWrapper
    tags.vm.$emit('removeFilter')
    await nextTick()

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
  ])('should fetch entities when route has accountNumbers query', async ({ accountNumber, expectedSearchValue }) => {
    queryAccountNumbers = accountNumber
    createWrapper()
    await flushPromises()

    const expectedSearchCriteria = getMockedSearchCriteria({
      currentPage: 0,
      filterByDeploymentStatus: '',
      limit: 15,
      search: expectedSearchValue,
    })

    expect(mockFetchWalletData).toHaveBeenCalledTimes(2)
    expect(mockFetchWalletData).toHaveBeenNthCalledWith(
      2,
      expect.anything(),
      expectedSearchCriteria,
    )
  })

  it('should NOT fetch entities when route has an unappropriate accountNumbers query', async () => {
    queryAccountNumbers = undefined
    createWrapper()
    await flushPromises()

    expect(mockFetchWalletData).toHaveBeenCalledTimes(1)
  })
})
