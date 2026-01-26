import type { MockInstance } from 'vitest'
import { mockUser } from '@entities/__mocks__/users-client.mocks'
import { nextTick } from 'vue'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { generateContactsMock } from '@entities/__mocks__/contact.mocks'
import FormSearch from '@entities/components/FormSearch'
import type { PatchContactPayload } from '@entities/services/contact/contactTypes'
import * as WalletServices from '@entities/services/wallet'
import type { Contact } from '@entities/types'
import type { UsersClientProps } from './UsersClientTypes'
import { getMockedUser, getMockedEntitySummary, getMockedEntity } from '@pulse/common/mocks'
import { getStoreMock } from '@pulse/common/mocks/vitest'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { ContactType } from '@pulse/common/enums'

import UsersClient from './UsersClient.vue'

vi.mock('@entities/services/contact', () => ({
  getContactById: vi.fn((_: number) => Promise.resolve(mockUser)),
  patchContact: vi.fn((_id: number, _accountId: number, contact: PatchContactPayload) => Promise.resolve(contact)),
}))

vi.mock('@entities/services/offer', () => ({
  getPrincipalContacts: vi.fn(),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    name: '',
  }),
}))

const currentEntityStoreMock = getStoreMock(useCurrentEntityStore)
const userStoreMock = getStoreMock(useUserStore)
const userMock = getMockedUser({ id: 2 })

const contactsList = generateContactsMock({
  numberOfContactsToReturn: 15,
  contactsTotalCount: 16,
  numberOfPages: 2,
  currentPage: 1,
}).data

const mockedEntity = getMockedEntity()
const entitySummaryMock = getMockedEntitySummary(mockedEntity)

vi.mock('@entities/services/wallet')
vi.mock('@pulse/common/managers')
function createWrapper(entityId?: number) {
  const props: UsersClientProps = {
    entityId,
  }

  return shallowMount(UsersClient, {
    props,
    global: {
      stubs: {
        'RemoveUserDialog': true,
        'ManageRightsDrawer': true,
        'DrawerUserDetails': {
          template: '<div></div>',
          props: ['modelValue', 'userId', 'entityId', 'hasDrawerOpened', 'editMode'],
        },
        'UsersList': true,
      },
    },
  })
}

let wrapper: VueWrapper<any>

const getPaginationComponent = () => wrapper.findComponent({ name: 'PPagination' })
const getUsersListComponent = () => wrapper.findComponent({ name: 'UsersList' })

describe('test UsersClient', () => {
  let mockGatewayGet: MockInstance
  beforeEach(async () => {
    currentEntityStoreMock.currentEntity = entitySummaryMock
    userStoreMock.user = userMock
    mockGatewayGet = vi
      .spyOn(WalletServices, 'fetchCustomers')
      .mockResolvedValue(contactsList)
    wrapper = createWrapper()
    await nextTick()
  })

  describe('rendering', () => {
    it('set UsersList props properly', async () => {
      await flushPromises()

      const usersList = getUsersListComponent()
      const data = usersList.props('data')
      const isInAnEntityPage = usersList.props('isInAnEntityPage')

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
      getUsersListComponent().vm.$emit('remove-user', mockUser)
      await nextTick()

      expect(wrapper.vm.state.userToRemove).toStrictEqual(mockUser)
      expect(wrapper.vm.state.isRemoveUserDialogOpened).toBeTruthy()
    })

    it('should select the user and display the Manage Rights drawer', async () => {
      getUsersListComponent().vm.$emit('display-manage-rights', mockUser.id)
      await nextTick()

      expect(wrapper.vm.state.isManageRightsDrawerOpened).toBeTruthy()
      expect(wrapper.vm.state.selectedUserId).toStrictEqual(mockUser.id)
    })

    it('should select the user and display the User Details drawer', async () => {
      getUsersListComponent().vm.$emit('click-view-information', mockUser.id)
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
      const entityWithCustomId = getMockedEntitySummary({
        ...mockedEntity,
        accountId: entityId,
      })
      currentEntityStoreMock.currentEntity = entityWithCustomId
      fetchAccountContactsSpy = vi
        .spyOn(WalletServices, 'fetchAccountContacts')
        .mockResolvedValue(mockedResponse)
      wrapper = createWrapper(entityId)
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
