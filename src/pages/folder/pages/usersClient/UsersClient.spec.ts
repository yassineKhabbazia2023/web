import type { SpyInstance } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { generateContactsMock } from '@/../tests/mocks/contactsDataMock'
import { getInitials } from '@/helper'
import type { IExtendedUser } from './types.ts'
import { noResult } from '@/../tests'
import FormSearch from '@/common/components/FormSearch'
import type { PatchContactPayload } from '@/services/contact/contactTypes'
import { mockUser } from './components/DrawerUserDetails/mockData.ts'
import { API_PREFIXES } from '@/common/config/services'
import * as OfferServices from '@/services/offer'
import { mockedEntity } from '@/pages/wallet/components/TableData/mockData'
import UsersClient from './'

vi.mock('@/services/contact', () => ({
  getContactById: vi.fn((_: number) => Promise.resolve(mockUser)),
  patchContact: vi.fn((_: number, contact: PatchContactPayload) => Promise.resolve(contact)),
}))

vi.mock('@/services/offer', () => ({
  getPrincipalContacts: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: '',
  }),
}))

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
    getters: {
      defaultEntity: () => mockedEntity,
    },
  }),
  userPermissions: () => ({
    hasPermission: () => vi.fn(),
  }),
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper<any> =>
  mount(UsersClient, {
    global: {
      plugins: [pinia],
      stubs: ['RemoveUserDialog'],
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
    const date = new Date(contact.creationDate)

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
const getPaginationComponent = () => wrapper.findComponent({ name: 'PPagination' })
const getTableDataComponent = () => wrapper.findComponent({ name: 'TableData' })

describe('usersClient', () => {
  let consoleErrorSpy: SpyInstance
  let getPrincipalContactsSpy: SpyInstance
  beforeEach(() => {
    getPrincipalContactsSpy = vi
      .spyOn(OfferServices, 'getPrincipalContacts')
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

    it('should call getPrincipalContacts on mounted', async () => {
      await flushPromises()

      expect(getPrincipalContactsSpy).toHaveBeenCalledOnce()
    })

    it('should display no result page when there is no returned contacts', async () => {
      wrapper.vm.state.data = []
      await nextTick()
      noResult(wrapper)
      expect(getTableDataComponent().exists()).toBeFalsy()
    })

    it('has a pagination', () => {
      const pages = wrapper.findAll('.el-pager li')
      expect(pages).toHaveLength(totalPages)
    })

    it('should not hide pagination when total pages is less than page selected size', () => {
      getPaginationComponent().vm.$emit('on-page-range-changed', 100)
      expect(getPaginationComponent().exists()).toBeTruthy()
    })
  })

  describe('events', () => {
    it('should call api with the right params', () => {
      expect(mockGatewayGet).toHaveBeenCalledTimes(1)

      expect(mockGatewayGet).toHaveBeenCalledWith(
        `${API_PREFIXES.CUSTOMER_WALLET}/customers/2?pageNumber=1&pageSize=15`,
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
      getPaginationComponent().vm.$emit('on-page-range-changed', 2)

      expect(mockGatewayGet).toHaveBeenCalledTimes(1)
    })

    it('should fetch contacts upon update:pCurrentPage event', () => {
      getPaginationComponent().vm.$emit('update:pCurrentPage', 2)

      expect(mockGatewayGet).toHaveBeenCalledTimes(1)
    })

    it('should fetch contacts upon update:pPageSize event', () => {
      getPaginationComponent().vm.$emit('update:pPageSize', 5)

      expect(mockGatewayGet).toHaveBeenCalledTimes(1)
    })

    it('should set search upon search-value-submitted event', async () => {
      const formSearchWrapper = wrapper.findComponent(FormSearch)

      await formSearchWrapper.vm.$emit('search-value-submitted', 'hello')
      expect(wrapper.vm.state.search).toBe('hello')
    })

    it('should fetch documents upon sort change', async () => {
      await getTableDataComponent().vm.$emit('on-sort-change', '+email')

      expect(mockGatewayGet).toHaveBeenCalledTimes(2)
    })

    it('should refresh when the event contact-patched is triggered', async () => {
      await wrapper.vm.$emit('contact-patched', mockUser)
      expect(mockGatewayGet).toHaveBeenCalledTimes(1)
    })

    it('reload the list of clients when a client is removed', async () => {
      expect(mockGatewayGet).toHaveBeenCalledTimes(1)

      wrapper.vm.state.isRemoveUserDialogOpened = true
      wrapper.vm.state.userToRemove = {}
      await nextTick()

      const removeUserDialogComponent = wrapper.findComponent({ name: 'RemoveUserDialog' })
      await removeUserDialogComponent.vm.$emit('user-removed')

      expect(mockGatewayGet).toHaveBeenCalledTimes(2)
    })
  })
})
