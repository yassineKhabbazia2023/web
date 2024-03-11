import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { flushPromises, mount, VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { commonStore } from '@kpmg/common'
import mock from './mock.json'
import AllUsers from './'

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {}
    })
  })
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper<any> =>
  mount(AllUsers, {
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
  itemValues.forEach(value => {
    expect(rowContent).toContain(value)
  })
}

describe('allUsers', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays data in a table', () => {
    expect(getTableBody().findAll('tr')).toHaveLength(items.length)

    checkRowContent(0)
    checkRowContent(items.length - 1)
  })

  it('can display "you" when it s the logged user', async () => {
    const store = commonStore(pinia)
    store.$patch({
      user: {
        id: mock.data.items[0].id
      }
    })
    await flushPromises()

    const firstRow = getTableBody().find('tr')
    expect(firstRow.text()).toContain('You')
  })

  it('has a pagination', () => {
    const pages = wrapper.findAll('.el-pager li')
    expect(pages).toHaveLength(totalPages)
  })
})
