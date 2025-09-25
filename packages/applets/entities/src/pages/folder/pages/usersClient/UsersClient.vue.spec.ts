import type { MockInstance } from 'vitest'
import { mockedEntity } from '@entities/__mocks__/entities.mocks'
import { walletServiceMock } from '@entities/__mocks__/wallet.service.mocks'
import { mockUser } from '@entities/__mocks__/users-client.mocks'
import { nextTick } from 'vue'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { generateContactsMock } from '@entities/__mocks__/contact.mocks'
import FormSearch from '@entities/common/components/FormSearch'
import type { PatchContactPayload } from '@entities/services/contact/contactTypes'
import * as WalletServices from '@entities/services/wallet'
import type { Contact } from '@entities/common/types'
import type { UsersClientProps } from './UsersClientTypes'
import {
  CurrentUserManagerMock,
  getStoreMock,
  getMockedUser,
  getMockedEntitySummary,
} from '@pulse/common/mocks'
import { useUserStore, useSelectedEntityStore } from '@pulse/common/stores'
import { ContactType } from '@pulse/common/enums'

import UsersClient from '.'

vi.mock('@entities/services/contact', () => ({
  getContactById: vi.fn((_: number) => Promise.resolve(mockUser)),
  patchContact: vi.fn((_: number, contact: PatchContactPayload) => Promise.resolve(contact)),
}))

vi.mock('@entities/services/offer', () => ({
  getPrincipalContacts: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: '',
  }),
}))

const selectedEntityStoreMock = getStoreMock(useSelectedEntityStore)
const userStoreMock = getStoreMock(useUserStore)
const userMock = getMockedUser({ id: 2 })

const contactsList = generateContactsMock({
  numberOfContactsToReturn: 15,
  contactsTotalCount: 16,
  numberOfPages: 2,
  currentPage: 1,
}).data

const entitySummaryMock = getMockedEntitySummary(mockedEntity)

vi.mock('@entities/services/wallet', () => walletServiceMock)

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

function createWrapper(entityId?: number) {
  const props: UsersClientProps = {
    entityId,
  }

  return shallowMount(UsersClient, {
    props,
    global: {
      stubs: [
        'RemoveUserDialog',
        'ManageRightsDrawer',
        'DrawerUserDetails',
        'TableData',
      ],
    },
  })
}

let wrapper: VueWrapper<any>

const getPaginationComponent = () => wrapper.findComponent({ name: 'PPagination' })
const getTableDataComponent = () => wrapper.findComponent({ name: 'TableData' })

describe('test UsersClient', () => {
  let mockGatewayGet: MockInstance
  beforeEach(async () => {
    selectedEntityStoreMock.selectedEntity = entitySummaryMock
    userStoreMock.user = userMock
    mockGatewayGet = vi
      .spyOn(WalletServices, 'fetchCustomers')
      .mockResolvedValue(contactsList)
    wrapper = createWrapper()
    await nextTick()
  })

  describe('rendering', () => {
    it('set TableData props properly', async () => {
      await flushPromises()

      const tableData = getTableDataComponent()
      const data = tableData.props('data')
      const isInAnEntityPage = tableData.props('isInAnEntityPage')

      await expect(data).toMatchFileSnapshot('__snap__/UserClient.tableData.snap')
      expect(isInAnEntityPage).toBeFalsy()
    })
  })

  describe('events', () => {
    it('should fetch contacts upon on-page-range-changed event', () => {
      getPaginationComponent().vm.$emit('on-page-range-changed', 2)

      expect(mockGatewayGet).toHaveBeenCalledTimes(1)
    })

    it('should handle the removal of a user', async () => {
      getTableDataComponent().vm.$emit('remove-user', mockUser)
      await nextTick()

      expect(wrapper.vm.state.userToRemove).toStrictEqual(mockUser)
      expect(wrapper.vm.state.isRemoveUserDialogOpened).toBeTruthy()
    })

    it('should select the user and display the Manage Rights drawer', async () => {
      getTableDataComponent().vm.$emit('display-manage-rights', mockUser.id)
      await nextTick()

      expect(wrapper.vm.state.isManageRightsDrawerOpened).toBeTruthy()
      expect(wrapper.vm.state.selectedUserId).toStrictEqual(mockUser.id)
    })

    it('should select the user and display the User Details drawer', async () => {
      getTableDataComponent().vm.$emit('click-view-information', mockUser.id)
      await nextTick()

      expect(wrapper.vm.state.isDrawerViewDetailsOpened).toBeTruthy()
      expect(wrapper.vm.state.selectedUserId).toStrictEqual(mockUser.id)
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
    let fetchAccountContactsSpy: MockInstance
    const mockedItems: Contact[] = [{
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
    const mockedResponse: WalletServices.GenericPageResponse<Contact> = {
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
        Type: ContactType.CUSTOMER,
      })

      expect(fetchAccountContactsSpy).toHaveBeenCalledOnce()
      expect(fetchAccountContactsSpy).toHaveBeenNthCalledWith(1, entityId, urlSearchParams)
    })
  })
})
