import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { commonPinia as pinia } from '@kpmg/common'
import TableData from '../../components/TableData'
import NoResult from '../../components/NoResult'
import Deploy from './'

const putFavoriteMock = vi.fn()
const getDisplayMock = vi.fn((_arg) =>
  Promise.resolve({
    data: {
      currentPage: 1,
      totalPage: 1,
      totalItems: 2,
      items: [
        {
          id: '8126f51d-c834-4fda-82ea-00d51ee11983',
          accountNumber: 'V900000489',
          name: 'Tesla',
          city: 'Paris',
          owner: {
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: ''
          },
          deploymentStatus: 2,
          isFavorite: false
        }
      ]
    }
  })
)
const getFavoritesMock = vi.fn(() =>
  Promise.resolve({
    data: [{
      id: 'customId',
      name: 'customName'
    }]
  })
)

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    wallet: {
      put: putFavoriteMock,
      get: (arg: string) =>
        arg === 'favorites'
          ? getFavoritesMock()
          : getDisplayMock(arg)
    }
  }),
  commonPinia: () => createPinia(),
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        token: 'token',
        entities: {
          default: {
            name: 'Tesla'
          }
        }
      }
    }),
    getters: {
      isAuthenticated: () => true
    }
  })
}))

const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush
  })
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Deploy, {
    plugins: [createTestingPinia()],
    global: {
      stubs: ['Tags']
    }
  })

const findSubscriptionDrawer = (wrapper: VueWrapper) =>
  wrapper.findComponent('[data-testid=offers-drawer]') as VueWrapper

describe('wallet', () => {
  setActivePinia(pinia)

  it('should call 2 api for get data', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    expect(getDisplayMock).toHaveBeenCalledTimes(1)
    expect(wrapper.findComponent(TableData).exists()).toBeTruthy()
  })

  it('should call api when user search', async () => {
    const wrapper = createWrapper()
    const SEARCH_VALUE = 'customSearchValue'

    await wrapper.find('input[type="search"]').setValue(SEARCH_VALUE)
    await wrapper.find('input[type="search"]').trigger('keyup')
    await flushPromises()

    expect(getDisplayMock).toHaveBeenCalledTimes(2)
    expect(getDisplayMock).toHaveBeenNthCalledWith(1, 'display?page=1&limit=15')
    expect(getDisplayMock).toHaveBeenNthCalledWith(
      2,
      `display?page=1&limit=15&search=${SEARCH_VALUE}`
    )
  })

  it('should not call api when user search with less than 3 characters', async () => {
    const wrapper = createWrapper()
    expect(getDisplayMock).toHaveBeenCalledTimes(1)

    await wrapper.find('input[type="search"]').setValue('az')
    await wrapper.find('input[type="search"]').trigger('keyup')
    await flushPromises()

    expect(getDisplayMock).not.toHaveBeenCalledTimes(2)
  })

  it('displays drawer when click on deploy', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const table = wrapper.findComponent('[data-testid=table]') as VueWrapper
    await table.vm.$emit('click-deploy')

    const subscriptionDrawer = findSubscriptionDrawer(wrapper)
    expect(subscriptionDrawer.exists()).toBeTruthy()
  })

  it('removes drawer when it has been closed', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const table = wrapper.findComponent('[data-testid=table]') as VueWrapper
    await table.vm.$emit('click-deploy')

    const subscriptionDrawer = findSubscriptionDrawer(wrapper)
    expect(subscriptionDrawer.exists()).toBeTruthy()
    await (subscriptionDrawer as VueWrapper).vm.$emit('update:modelValue', false)

    const subscriptionDrawerAfter = findSubscriptionDrawer(wrapper)
    expect(subscriptionDrawerAfter.exists()).toBeFalsy()
  })

  it('should redirect when click on access folder', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const table = wrapper.findComponent('[data-testid=table]') as VueWrapper
    await table.vm.$emit('access', 'Tesla')

    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'folder',
      params: { name: 'Tesla' }
    })
  })

  it('displays a specific component if no items in response API', async () => {
    getDisplayMock.mockResolvedValueOnce({
      data: {
        currentPage: 1,
        totalPage: 1,
        totalItems: 0,
        items: []
      }
    })

    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.findComponent(NoResult).exists()).toBeTruthy()
  })
})
