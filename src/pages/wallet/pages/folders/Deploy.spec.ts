import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { commonStore, commonPinia as pinia } from '@kpmg/common'
import NoResult from '@/components/NoResult'
import TableData from '../../components/TableData'
import Deploy from '.'
import { EntityStatus } from '../../components/Filters/types'
import { ElCheckbox } from 'element-plus'

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
            phoneNumber: '',
          },
          deploymentStatus: 2,
          isFavorite: false,
        },
        {
          id: '8126f51d-c834-4fda-82ea-00d51ee11985',
          accountNumber: 'V900000483',
          name: 'Tesla',
          city: 'Paris',
          owner: {
            firstName: null,
            lastName: null,
            email: null,
            phoneNumber: '',
          },
          deploymentStatus: 1,
          isFavorite: false,
        },
      ],
    },
  }),
)
const getFavoritesMock = vi.fn(() =>
  Promise.resolve({
    data: [{
      id: 'customId',
      name: 'customName',
    }],
  }),
)

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    wallet: {
      put: putFavoriteMock,
      get: (arg: string) =>
        arg === 'favorites'
          ? getFavoritesMock()
          : getDisplayMock(arg),
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
}))

const mockRouterPush = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Deploy, {
    attachTo: document.body,
    plugins: [createTestingPinia()],
    global: {
      stubs: ['Filters'],
    },
  })

const findSubscriptionDrawer = (wrapper: VueWrapper) =>
  wrapper.findComponent('[data-testid=offers-drawer]') as VueWrapper

describe('wallet', () => {
  setActivePinia(pinia)

  it('should display correct button by nombre selected ibs', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const button = wrapper.find('.el-button')
    expect(button.text()).toBe('Delegate my wallet')
    const checkbox = wrapper.findAllComponents(ElCheckbox)[0]
    await checkbox.trigger('click')
    expect(button.text()).toBe('Delegate my folder')
    const checkbox1 = wrapper.findAllComponents(ElCheckbox)[1]
    await checkbox1.trigger('click')
    expect(button.text()).toBe('Delegate my folders')
  })

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
      `display?page=1&limit=15&search=${SEARCH_VALUE}`,
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
    await table.vm.$emit('click-deploy', 1, 'a', 'b')

    const subscriptionDrawer = findSubscriptionDrawer(wrapper)
    expect(subscriptionDrawer.exists()).toBeTruthy()
  })

  it('removes drawer when it has been closed', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const table = wrapper.findComponent('[data-testid=table]') as VueWrapper
    await table.vm.$emit('click-deploy', 1, 'a', 'b')

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
    await table.vm.$emit('access', '8126f51d-c834-4fda-82ea-00d51ee11983')

    expect(mockRouterPush).toHaveBeenCalledTimes(1)
    expect(mockRouterPush).toHaveBeenCalledWith({
      name: 'folder',
      params: { id: '8126f51d-c834-4fda-82ea-00d51ee11983' },
    })
  })

  it('displays a specific component if no items in response API', async () => {
    getDisplayMock.mockResolvedValueOnce({
      data: {
        currentPage: 1,
        totalPage: 1,
        totalItems: 0,
        items: [],
      },
    })

    const wrapper = createWrapper()
    await flushPromises()
    expect(wrapper.findComponent(NoResult).exists()).toBeTruthy()
  })
  it('should call api with the right filter when filterByStatus event is triggered', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const tags = wrapper.findComponent('[data-testid=filters]') as VueWrapper
    await tags.vm.$emit('filterByStatus', EntityStatus.TO_DEPLOY)

    expect(getDisplayMock).toHaveBeenCalledTimes(2)
    expect(getDisplayMock).toHaveBeenNthCalledWith(1, 'display?page=1&limit=15')
    expect(getDisplayMock).toHaveBeenNthCalledWith(
      2,
      `display?page=1&limit=15&deploymentStatus=${EntityStatus.TO_DEPLOY}`,
    )
  })

  it('should call api without filter when removeFilter  event is triggered', async () => {
    const wrapper = createWrapper()
    await flushPromises()
    const tags = wrapper.findComponent('[data-testid=filters]') as VueWrapper
    await tags.vm.$emit('removeFilter')

    expect(getDisplayMock).toHaveBeenCalledTimes(1)
    expect(getDisplayMock).toHaveBeenNthCalledWith(1, 'display?page=1&limit=15')
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
})
