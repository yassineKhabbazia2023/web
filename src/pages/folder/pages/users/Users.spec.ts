import { VueWrapper, mount } from '@vue/test-utils'
import { beforeEach, describe, it, expect, vi } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import Users from './'
import { dataFromApi } from './mockData'
import { commonStore } from '@kpmg/common'

const pinia = createTestingPinia()
vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    getters: {
      isCollab: () => true
    }
  })
}))

const createWrapper = (): VueWrapper<any> =>
  mount(Users, {
    attachTo: document.body,
    global: {
      plugins: [pinia]
    }
  })

describe('tableData', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('displays correctly the table', () => {
    const rows = wrapper.findAll('tr.el-table__row')
    expect(rows).toHaveLength(dataFromApi.data.items.length)
    const {
      firstName,
      lastName,
      email,
      role,
      firstDateAccess
    } = dataFromApi.data.items[0]
    const mockData = [firstName, lastName, email, 'Connected', role, firstDateAccess]
    const firstRowText = rows[0].text()
    mockData.forEach(data => {
      expect(firstRowText).toContain(data)
    })
  })
  it('should not display the pBlockHeader if the user is client', () => {
    const store = commonStore()
    // @ts-expect-error: Getter is read only
    store.isCollab = false
    const blockHeader = wrapper.findComponent('[data-testid=offers-drawer]') as VueWrapper
    expect(blockHeader.exists()).toBeFalsy()
  })
})
