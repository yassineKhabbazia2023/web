import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { commonStore } from '@kpmg/common'
import UsersClient from './'

import { PPagination } from '@kpmg/styleguide'
import { generateContactsMock } from '@/tests/mocks/contactsDataMock'
import { getInitials } from '@/helper'
import type { IExtendedUser } from './types.ts'
import { noResult } from '@/tests'
import TableData from './components/TableData'

const contactsList = generateContactsMock({
  numberOfContactsToReturn: 15,
  contactsTotalCount: 16,
  numberOfPages: 2,
  currentPage: 1,
}).data

const mockGatewayGet = vi.fn(() => {
  return Promise.resolve({
    data: contactsList,
  })
})

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockGatewayGet,
    },
  }),
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        id: 2,
      },
    }),
  }),
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper<any> =>
  mount(UsersClient, {
    global: {
      plugins: [pinia],
    },
  })

const data = contactsList

const items = data.items
const totalPages = data.totalPages

let wrapper: VueWrapper<any>

const checkRowContent = (tableHtmlRow: string, contactsList: IExtendedUser[]) => {
  contactsList.forEach((contact) => {
    const date = new Date(contact.createdAt)

    const yyyy = date.getFullYear()
    const mm = date.getMonth() + 1
    const dd = date.getDate()

    expect(tableHtmlRow).toContain(
      getInitials(contact.firstName, contact.lastName),
    )

    expect(tableHtmlRow).toContain(`${mm}/${dd}/${yyyy}`)
  })
}

const getTableBody = () => wrapper.find('table tbody')

describe('usersClient', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  describe('rendering', () => {
    it('displays formatted data correctly in the table', async () => {
      await flushPromises()
      expect(getTableBody().findAll('tr')).toHaveLength(items.length)

      const row = getTableBody().find('tr').html()

      checkRowContent(row, items)
    })

    it('should display no result page when there is no returned contacts', () => {
      const wrapperWithNoContacts = createWrapper()
      wrapperWithNoContacts.vm.state.data = []
      const tableWrapper = wrapperWithNoContacts.findComponent(TableData)
      noResult(wrapperWithNoContacts)
      expect(tableWrapper.exists()).toBeFalsy()
    })

    it('displays "you" when it s the logged user', async () => {
      const store = commonStore(pinia)
      store.$patch({
        user: {
          id: items[0].id.toString(),
        },
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

  describe('events', () => {
    it('should call api with the right params', () => {
      expect(mockGatewayGet).toHaveBeenCalledTimes(1)

      expect(mockGatewayGet).toHaveBeenCalledWith(
        'customer-wallet/api/contacts?pageNumber=1&pageSize=15&type=Customer',
      )
    })

    it('should fetch contacts upon on-page-range-changed event', () => {
      const pPagination = wrapper.findComponent(PPagination)

      pPagination.vm.$emit('on-page-range-changed', 2)

      expect(mockGatewayGet).toHaveBeenCalledTimes(1)
    })
  })
})
