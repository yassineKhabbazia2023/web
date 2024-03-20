import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { commonStore } from '@kpmg/common'
import mock from './mock.json'
import UsersClient from './'

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {}
    })
  })
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper<any> =>
  mount(UsersClient, {
    global: {
      plugins: [pinia]
    }
  })

const { items, totalPages } = mock.data
let wrapper: VueWrapper<any>

const getTableBody = () => wrapper.find('table tbody')

const checkRowContent = (rowIndex: number) => {
  const row = getTableBody().findAll('tr')[rowIndex]
  const rowContent = row.text()
  const [, ...rest] = Object.values(items[rowIndex])
  const itemValues = rest

  const INDEX_WITH_DATE = 4
  itemValues.forEach((value, index) => {
    expect(rowContent).toContain(
      index === INDEX_WITH_DATE
        ? '3/7/2024'
        : value
    )
  })
}

describe('allUsers', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays an error if the user search with less than 3 letters', async () => {
    const getFormItemIsError = () => wrapper.find('.el-form-item.is-error')
    const inputSearch = wrapper.find('input[type="search"]')

    expect(getFormItemIsError().exists()).toBeFalsy()

    await inputSearch.setValue('az')
    await inputSearch.trigger('keyup')

    expect(getFormItemIsError().exists()).toBeTruthy()
  })

  it('can display a no results message', async () => {
    const getNoResultComponent = () => wrapper.findComponent({ name: 'NoResult' })

    expect(getNoResultComponent().exists()).toBeFalsy()

    wrapper.vm.state.data = []
    await nextTick()

    expect(getNoResultComponent().exists()).toBeTruthy()
  })

  it('displays data in a table', () => {
    expect(getTableBody().findAll('tr')).toHaveLength(items.length)

    checkRowContent(0)
    checkRowContent(items.length - 1)
  })

  it('displays "you" when it s the logged user', async () => {
    const expectedValue = 'You'
    const getFirstRow = () => getTableBody().find('tr')
    expect(getFirstRow().text()).not.toContain(expectedValue)

    const store = commonStore(pinia)
    store.$patch({
      user: {
        id: mock.data.items[0].id
      }
    })
    await flushPromises()

    expect(getFirstRow().text()).toContain(expectedValue)
  })

  it('has a pagination', () => {
    const pages = wrapper.findAll('.el-pager li')
    expect(pages).toHaveLength(totalPages)
  })
})
