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
import * as OfferServices from '@/services/offer'
import * as WalletServices from '@/services/wallet'
import type { IUserFromApi } from '@/pages/folder/pages/usersCollab/types'
import { mockedEntity } from '@/pages/wallet/components/TableData/mockData'
import type { UsersClientProps } from './UsersClientTypes'
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

vi.mock('@/services/wallet', () => ({
  fetchAccountContacts: vi.fn(),
  fetchCustomers: vi.fn(),
}))

vi.mock('@kpmg/common', () => ({
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

function createWrapper(entityId?: number) {
  const props: UsersClientProps = {
    entityId,
  }

  return mount(UsersClient, {
    props,
    global: {
      plugins: [pinia],
      stubs: ['RemoveUserDialog'],
    },
  })
}

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
  let mockGatewayGet: SpyInstance
  beforeEach(async () => {
    getPrincipalContactsSpy = vi
      .spyOn(OfferServices, 'getPrincipalContacts')
    mockGatewayGet = vi
      .spyOn(WalletServices, 'fetchCustomers')
      .mockResolvedValue(contactsList)
    wrapper = createWrapper()
    await nextTick()
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
      const urlSearchParams = new URLSearchParams({
        pageNumber: '1',
        pageSize: '15',
      })

      expect(mockGatewayGet).toHaveBeenCalledOnce()
      expect(mockGatewayGet).toHaveBeenNthCalledWith(1, 2, urlSearchParams)
    })

    it('displays error message when API call fails', async () => {
      mockGatewayGet.mockRejectedValueOnce(
        new Error('Failed to fetch contacts'),
      )

      await wrapper.vm.fetchUsers()

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

  describe('when entityId is set', () => {
    const entityId = 42
    let fetchAccountContactsSpy: SpyInstance
    const mockedItems: IUserFromApi[] = [{
      contactId: 1,
      firstName: 'Goldie',
      lastName: 'Travis',
      email: 'goldietravis@ecolight.com',
      personaName: 'Dirigeant',
      creationDate: '2024-03-07',
      globalContactId: 'global-contact-id',
      type: 'string',
      status: 'status',
    }]
    const mockedResponse: WalletServices.GenericPageResponse<IUserFromApi> = {
      items: mockedItems,
      currentPage: 1,
      totalItems: 3,
      totalPages: 1,
    }

    beforeEach(() => {
      fetchAccountContactsSpy = vi
        .spyOn(WalletServices, 'fetchAccountContacts')
        .mockResolvedValue(mockedResponse)
      createWrapper(entityId)
    })

    it('should call api with the right params', () => {
      const urlSearchParams = new URLSearchParams({
        pageNumber: '1',
        pageSize: '15',
        Type: 'Customer',
      })

      expect(fetchAccountContactsSpy).toHaveBeenCalledOnce()
      expect(fetchAccountContactsSpy).toHaveBeenNthCalledWith(1, entityId, urlSearchParams)
    })
  })
})
