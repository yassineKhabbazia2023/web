import { describe, expect, it, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount, type VueWrapper } from '@vue/test-utils'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { getMockedOperations } from '@entities/__mocks__/operations.mocks'
import { contactServiceMock } from '@entities/__mocks__/contact.service.mocks'
import { walletServiceMock } from '@entities/__mocks__/wallet.service.mocks'
import { getMockedCustomersCollab } from '@entities/__mocks__/contact.mocks'
import { dataFromApi } from '@entities/__mocks__/api.mocks'
import { fetchAccountCustomers } from '@entities/services/wallet'
import { getAccountSignatories, updateSignatoryStatus } from '@entities/services/account'
import UsersCollab from '.'
import { getMockedAccount } from '@entities/__mocks__/account-row.mocks'
import { nextTick, ref } from 'vue'
import { userActions } from './types'
import type { PToolboxItemProps } from '@pulse/styleguide/types'

const DEFAULT_CURRENT_PAGE = 1
const DEFAULT_ROUTE_PARAMS_ID = 5

const mockedCustomersCollab = getMockedCustomersCollab()
const mockedUser = {
  ...dataFromApi.data.items[0],
  fullName: "Johnny's Pizza",
  initials: 'JP',
}

const MOCKED_USER = {
  contactId: mockedCustomersCollab[0].contactId,
  firstName:  mockedCustomersCollab[0].firstName,
  lastName:  mockedCustomersCollab[0].lastName,
  fullName: `${mockedCustomersCollab[0].firstName} ${mockedCustomersCollab[0].lastName}`,
  email:  mockedCustomersCollab[0].email,
  personaName:  mockedCustomersCollab[0].personaName,
  creationDate:  mockedCustomersCollab[0].creationDate,
  status: {
    text: 'statusDeclared',
    iconName: 'patchCheck',
    color: 'gray-900',
  },
}

const mockedAccount = getMockedAccount()

const mockHasPermission = vi.hoisted(() => vi.fn())

vi.mock('@entities/services/contact', () => contactServiceMock)
vi.mock('@entities/services/wallet', () => walletServiceMock)
vi.mock('@entities/pages/folder/pages/usersCollab/composables/useOperation', () => ({
  useOperation: () => {
    return {
      availableOperations: ref(getMockedOperations()),
      operations: ref(getMockedOperations()),
    }
  },
}))

const apiMocks = vi.hoisted(() => ({
  singleAccountSignatory: vi.fn(() => Promise.resolve([
    mockedCustomersCollab[0],
  ])),
  multipleAccountSignatories: vi.fn(() => Promise.resolve([
    mockedCustomersCollab[0],
    mockedCustomersCollab[1],
  ])),
}))

vi.mock('@entities/services/account', () => {
  return {
    updateSignatoryStatus: vi.fn(() => Promise.resolve({})),
    getAccountSignatories: apiMocks.singleAccountSignatory,
  }
})

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: DEFAULT_ROUTE_PARAMS_ID,
    },
  }),
  useRouter: () => ({
    go: vi.fn(),
  }),
}))

vi.mock('@pulse/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        id: 2,
        entities: {
          default: {
            accountId: mockedAccount.accountId,
          },
        },
      },
    }),
  }),
  getInitials: vi.fn(),
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
  amplitudeService: {
    track: vi.fn(),
  },
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper<any> =>
  shallowMount(UsersCollab, {
    global: {
      plugins: [pinia],
      stubs: {
        FormSearch: true,
        ManageAccessDrawer: true,
        ManageRightsDrawer: true,
        NoResult: true,
        PAvatar: true,
        PIcon: true,
        PLoader: true,
        PNotification: true,
        PToolbox: true,
        RemoveUserDialog: true,
        PTable: {
          name: 'PTable',
          template: '<div class="el-table__row"><slot /></div>',
          props: ['pData'],
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" /></div>',
          data() {
            const row = MOCKED_USER

            return {
              row,
            }
          },
        },
      },
    },
  })

let wrapper: VueWrapper<any>

const addSignatoryToolboxItem: PToolboxItemProps = {
  pIconName: 'patchCheck',
  pValue: 'Designate as signatory',
  pActionName: 'assignSignatory',
  pState: 'default',
}

const removeSignatoryToolboxItemEnabled: PToolboxItemProps = {
  pIconName: 'patchCheck',
  pValue: 'Revoke signatory status',
  pActionName: 'unassignSignatory',
  pState: 'default',
  disabled: false,
  pContentTooltip: undefined,
}

const removeSignatoryToolboxItemDisabled: PToolboxItemProps = {
  pIconName: 'patchCheck',
  pValue: 'Revoke signatory status',
  pActionName: 'unassignSignatory',
  pState: 'default',
  disabled: true,
  pContentTooltip: 'A folder should have at least one signatory',
}

const modifyToolboxItem: PToolboxItemProps = {
  pIconName: 'pencilSquare',
  pValue: 'Change the rights',
  pActionName: 'modifyRights',
  pState: 'default',
}

const removeUserToolboxItem: PToolboxItemProps = {
  pIconName: 'personRemove',
  pValue: 'Remove user',
  pActionName: 'removeUser',
  pState: 'default',
}

describe('usersCollab', () => {
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it('should display correctly the users collab table', () => {
      const usersTable = wrapper.find('[data-testid=folder-users-table]')
      expect(usersTable.exists()).toBeTruthy()

      const pTable = wrapper.findComponent({ name: 'PTable' })

      expect(pTable.props('pData')).toHaveLength(mockedCustomersCollab.length)
    })

    it('has a pagination', () => {
      const totalItems = wrapper.vm.state.totalItems
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      expect(pagination.exists()).toBeTruthy()
      expect(pagination.props('pCurrentPage')).toBe(1)
      expect(pagination.props('pPageSize')).toBe(15)
      expect(totalItems).toBe(mockedCustomersCollab.length)
    })

    it('displays the name in semibold if contact is signatory', async () => {
      await nextTick()
      const rows = wrapper.findAll('.el-table__row')
      // The first user in the mock is the one returned by getAccountSignatories mock
      expect(getAccountSignatories).toHaveBeenCalledWith(mockedAccount.accountId)
      const firstRowUsername = rows[0].find('p.font-semibold')
      expect(firstRowUsername.exists()).toBeTruthy()
    })
  })
  describe('events', () => {
    it('can make a search', async () => {
      expect(fetchAccountCustomers).toHaveBeenCalledOnce()

      const searchValue = 'customSearchValue'
      await wrapper.findComponent({ name: 'FormSearch' }).vm.$emit('search-value-submitted', searchValue)

      expect(fetchAccountCustomers).toHaveBeenCalledTimes(2)
      expect(fetchAccountCustomers).toHaveBeenNthCalledWith(
        2,
        DEFAULT_ROUTE_PARAMS_ID,
        {
          search: searchValue,
          pageSize: 15,
          pageNumber: DEFAULT_CURRENT_PAGE,
        },
      )
    })

    it('can make a sort', async () => {
      const SORTING_FIELD = 'name'

      expect(fetchAccountCustomers).toHaveBeenCalledOnce()

      await wrapper
        .findComponent({ name: 'PTable' })
        .vm.$emit('sort-change', {
          prop: SORTING_FIELD,
          order: 'ascending',
        })
      expect(fetchAccountCustomers).toHaveBeenCalledTimes(2)
      expect(fetchAccountCustomers).toHaveBeenNthCalledWith(
        2,
        DEFAULT_ROUTE_PARAMS_ID,
        {
          pageSize: 15,
          pageNumber: DEFAULT_CURRENT_PAGE,
          'sorting.field': SORTING_FIELD,
        },
      )
    })

    it('should reset the current page and update the limit', () => {
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      pagination.vm.$emit('on-page-range-changed', 30)

      expect(wrapper.vm.state.limit).toBe(30)
      expect(wrapper.vm.state.currentPage).toBe(1)
    })

    it("should display the 'Modify Rights' drawer when the 'Modify Rights' action is clicked", async () => {
      await wrapper.vm.handleUserAction('modifyRights', mockedUser)
      const manageRightsDrawer = wrapper.findComponent({ name: 'ManageRightsDrawer' })

      expect(manageRightsDrawer.exists()).toBeTruthy()
      expect(manageRightsDrawer.props('modelValue')).toBeTruthy()
      expect(manageRightsDrawer.props('selectedUser')).toMatchObject(mockedUser)
    })

    it("should display the 'Manage Access' drawer when the 'Manage Access' button is clicked", async () => {
      mockHasPermission.mockReturnValue(true)
      const wrapper = createWrapper()
      await flushPromises()
      const manageAccessButton = wrapper.find('[data-testid="manage-access-button"]')

      await manageAccessButton.trigger('click')
      await nextTick()
      const manageAccessDrawer = wrapper.findComponent({ name: 'ManageAccessDrawer' })

      expect(manageAccessDrawer.props('modelValue')).toBeTruthy()
    })

    it("should add user as account signatory when the 'Designate as signatory action is clicked", async () => {
      await wrapper.vm.handleUserAction('assignSignatory', mockedUser)

      expect(updateSignatoryStatus).toHaveBeenCalledWith(mockedAccount.accountId, mockedUser.contactId)
    })

    it("should remove account signatory when the 'Revoke signatory status'", async () => {
      apiMocks.singleAccountSignatory.mockReturnValue(apiMocks.multipleAccountSignatories())
      wrapper = createWrapper()
      await flushPromises()
      await wrapper.vm.handleUserAction('unassignSignatory', mockedUser)

      expect(updateSignatoryStatus).toHaveBeenCalledWith(mockedAccount.accountId, mockedUser.contactId, false)
    })

    it.each([
      {
        userThatCanBeAdded: mockedCustomersCollab[0],
        hasRemoveUserPermission: false,
        expectedItems: [
          removeSignatoryToolboxItemDisabled,
          modifyToolboxItem,
        ],
      },
      {
        userThatCanBeAdded: mockedCustomersCollab[1],
        hasRemoveUserPermission: false,
        expectedItems: [
          addSignatoryToolboxItem,
          modifyToolboxItem,
        ],
      },
      {
        userThatCanBeAdded: mockedCustomersCollab[1],
        hasRemoveUserPermission: true,
        expectedItems: [
          addSignatoryToolboxItem,
          modifyToolboxItem,
          removeUserToolboxItem,
        ],
      },
    ])("should allow signatory add if user isn't already signatory", async ({
      userThatCanBeAdded,
      hasRemoveUserPermission,
      expectedItems,
    }) => {
      mockHasPermission.mockReturnValue(hasRemoveUserPermission)
      const wrapper = createWrapper()
      await flushPromises()
      wrapper.vm.handleToolboxClick(userThatCanBeAdded)
      await nextTick()
      const items = wrapper.vm.toolboxItems
      expect(items).toStrictEqual(expectedItems)
    })

    it.each([
      {
        userToRemove: mockedCustomersCollab[0],
        expectedItems: [
          removeSignatoryToolboxItemDisabled,
          modifyToolboxItem,
        ],
        getSignatoriesMockToUse: apiMocks.singleAccountSignatory,
      },
      {
        userToRemove: mockedCustomersCollab[1],
        expectedItems: [
          removeSignatoryToolboxItemEnabled,
          modifyToolboxItem,
        ],
        getSignatoriesMockToUse: apiMocks.multipleAccountSignatories,
      },
    ])('should allow signatory remove if user is signatory and account has at least another signatory',
      async ({ userToRemove, expectedItems, getSignatoriesMockToUse }) => {
        apiMocks.singleAccountSignatory.mockReturnValue(getSignatoriesMockToUse())
        wrapper = createWrapper()
        await flushPromises()

        wrapper.vm.handleToolboxClick(userToRemove)
        const items = wrapper.vm.toolboxItems
        expect(items).toMatchObject(expectedItems)
      })

    it('when click on REMOVE_USER action', async () => {
      mockHasPermission.mockReturnValue(true)
      const wrapper = createWrapper()
      await flushPromises()

      const expectedRemoveUserDialogProps = {
        isCollab: true,
        modelValue: true,
        userToRemove: MOCKED_USER,
      }

      const removeUserDialogBefore = wrapper.findComponent({ name: 'RemoveUserDialog' })
      expect(removeUserDialogBefore.exists()).toBeFalsy()

      const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

      expect(pToolbox.exists()).toBeTruthy()
      pToolbox.vm.$emit('p-toolbox-item-clicked', userActions.REMOVE_USER)
      await nextTick()

      const removeUserDialogAfter = wrapper.findComponent({ name: 'RemoveUserDialog' })
      expect(removeUserDialogAfter.exists()).toBeTruthy()
      expect(removeUserDialogAfter.props()).toStrictEqual(expectedRemoveUserDialogProps)

      expect(fetchAccountCustomers).toHaveBeenCalledTimes(2)
    })

    it('when click on REMOVE_USER action and close RemoveUserDialog after removed user', async () => {
      mockHasPermission.mockReturnValue(true)
      const wrapper = createWrapper()
      await flushPromises()

      const expectedRemoveUserDialogProps = {
        isCollab: true,
        modelValue: false,
        userToRemove: MOCKED_USER,
      }

      const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

      expect(pToolbox.exists()).toBeTruthy()
      pToolbox.vm.$emit('p-toolbox-item-clicked', userActions.REMOVE_USER)
      await nextTick()

      const removeUserDialogAfter = wrapper.findComponent({ name: 'RemoveUserDialog' })

      removeUserDialogAfter.vm.$emit('user-removed')
      removeUserDialogAfter.vm.$emit('update:modelValue', false)
      await nextTick()

      const removeUserDialogWhenClosed = wrapper.findComponent({ name: 'RemoveUserDialog' })
      expect(removeUserDialogWhenClosed.props()).toStrictEqual(expectedRemoveUserDialogProps)

      expect(fetchAccountCustomers).toHaveBeenCalledTimes(3)
    })
  })
})
