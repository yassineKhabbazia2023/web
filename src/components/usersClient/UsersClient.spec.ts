import type { SpyInstance } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import UsersClient from './'

import { PPagination } from '@kpmg/styleguide'
import { generateContactsMock } from '@/../tests/mocks/contactsDataMock'
import { getInitials } from '@/helper'
import type { IExtendedUser } from './types.ts'
import { noResult } from '@/../tests'
import TableData from './components/TableData'
import FormSearch from '@/components/FormSearch'

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

const checkRowContent = (
  tableHtmlRow: string,
  contactsList: IExtendedUser[],
) => {
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
  let consoleErrorSpy: SpyInstance
  beforeEach(() => {
    wrapper = createWrapper()
    consoleErrorSpy = vi.spyOn(console, 'error')
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

    it('displays error message when API call fails', async () => {
      mockGatewayGet.mockRejectedValueOnce(
        new Error('Failed to fetch contacts'),
      )

      await wrapper.vm.fetch()

      expect(wrapper.vm.state.isLoading).toBeFalsy()

      expect(consoleErrorSpy).toHaveBeenCalledTimes(1)
    })

    it('should fetch contacts upon on-page-range-changed event', () => {
      const pPagination = wrapper.findComponent(PPagination)

      pPagination.vm.$emit('on-page-range-changed', 2)

      expect(mockGatewayGet).toHaveBeenCalledTimes(1)
    })

    it('should fetch contacts upon update:pCurrentPage event', () => {
      const pPagination = wrapper.findComponent(PPagination)

      pPagination.vm.$emit('update:pCurrentPage', 2)

      expect(mockGatewayGet).toHaveBeenCalledTimes(1)
    })

    it('should fetch contacts upon update:pPageSize event', () => {
      const pPagination = wrapper.findComponent(PPagination)

      pPagination.vm.$emit('update:pPageSize', 5)

      expect(mockGatewayGet).toHaveBeenCalledTimes(1)
    })

    it('should set search upon search-value-submitted event', async () => {
      const formSearchWrapper = wrapper.findComponent(FormSearch)

      await formSearchWrapper.vm.$emit('search-value-submitted', 'hello')
      expect(wrapper.vm.state.search).toBe('hello')
    })
  })
})
