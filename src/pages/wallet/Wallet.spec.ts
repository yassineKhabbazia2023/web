import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { defineStore, createPinia, setActivePinia } from 'pinia'
import { commonPinia as pinia } from '@kpmg/common'
import TableData from './components/TableData'
import NoResult from './components/NoResult'
import Wallet from './'

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
        token: 'token'
      }
    }),
    getters: {
      isAuthenticated: () => true
    }
  })
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Wallet, {
    plugins: [createTestingPinia()],
    global: {
      stubs: ['Tags']
    }
  })

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
