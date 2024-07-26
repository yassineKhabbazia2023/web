import { describe, expect, it, vi, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { dataFromApi, getMockedCustomersCollab } from './mockData'
import { fetchAccountCustomers } from '@/services/wallet'
import { getAccountSignatories, updateSignatoryStatus } from '@/services/account'
import UsersCollab from '.'
import { getMockedAccount } from '@/services/account/accountMock'
import { nextTick } from 'vue'
const DEFAULT_CURRENT_PAGE = 1
const DEFAULT_ROUTE_PARAMS_ID = 5

const mockedCustomersCollab = getMockedCustomersCollab()
const mockedUser = {
  ...dataFromApi.data.items[0],
  fullName: "Johnny's Pizza",
  initials: 'JP',
}

const mockedAccount = getMockedAccount()

const mockHasPermission = vi.fn((_code: string) => true)

vi.mock('@/services/wallet', () => ({
  fetchAccountCustomers: vi.fn(() => Promise.resolve({
    items: mockedCustomersCollab,
    totalItems: mockedCustomersCollab.length,
    currentPage: DEFAULT_CURRENT_PAGE,
  })),
}))

const apiMocks = vi.hoisted(() => ({
  singleAccountSignatory: vi.fn(() => Promise.resolve([
    {
      ...mockedCustomersCollab[0],
    },
  ])),
  multipleAccountSignatories: vi.fn(() => Promise.resolve([
    {
      ...mockedCustomersCollab[0],
    },
    {
      ...mockedCustomersCollab[1],
    },
  ])),
}))

vi.mock('@/services/account', () => {
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

vi.mock('@kpmg/common', () => ({
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
}))

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper<any> =>
  mount(UsersCollab, {
    global: {
      plugins: [pinia],
    },
  })

let wrapper: VueWrapper<any>

const getRows = () => wrapper.findAll('tr.el-table__row')

const addSignatoryToolboxItem = {
  pIconName: 'PIPatchCheck',
  pValue: 'Designate as signatory',
  pActionName: 'assignSignatory',
  pState: 'default',
}

const removeSignatoryToolboxItemEnabled = {
  pIconName: 'PIPatchCheck',
  pValue: 'Revoke signatory status',
  pActionName: 'unassignSignatory',
  pState: 'default',
  disabled: false,
  pContentTooltip: undefined,
}

const removeSignatoryToolboxItemDisabled = {
  pIconName: 'PIPatchCheck',
  pValue: 'Revoke signatory status',
  pActionName: 'unassignSignatory',
  pState: 'default',
  disabled: true,
  pContentTooltip: 'A folder should have at least one signatory',
}

const modifyToolboxItem = {
  pIconName: 'PIPencilSquare',
  pValue: 'Change the rights',
  pActionName: 'modifyRights',
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

      expect(getRows()).toHaveLength(mockedCustomersCollab.length)

      const { firstName, lastName, email, creationDate, status } =
        mockedCustomersCollab[0]
      const mockData = [
        firstName,
        lastName,
        email,
        status,
        creationDate,
      ]
      const firstRowText = getRows()[0].text()

      mockData.forEach((data) => {
        expect(firstRowText).toContain(data)
      })
    })

    it('can display a declared status', () => {
      const secondRowText = getRows()[1].text()
      expect(secondRowText).toContain('Declared')
    })

    it('has a pagination', () => {
      const pages = wrapper.findAll('.el-pager li')
      const totalItems = wrapper.vm.state.totalItems
      const pagination = wrapper.findComponent({ name: 'PPagination' })

      expect(pages).toHaveLength(1)
      expect(pagination.exists()).toBeTruthy()
      expect(pagination.props('pCurrentPage')).toBe(1)
      expect(pagination.props('pPageSize')).toBe(15)
      expect(totalItems).toBe(mockedCustomersCollab.length)
    })

    it('displays the name in semibold if contact is signatory', async () => {
      await nextTick()
      const rows = wrapper.findAll('tr.el-table__row')
      // The first user in the mock is the one returned by getAccountSignatories mock
      expect(getAccountSignatories).toHaveBeenCalledWith(mockedAccount.accountId)
      const firstRowUsername = rows[0].find('p.font-semibold')
      expect(firstRowUsername.exists()).toBeTruthy()

      const secondRowUsername = rows[1].find('p.font-semibold')
      expect(secondRowUsername.exists()).toBeFalsy()
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

    it("should display the 'Modify Rights' drawer when the 'Modify Rights' action is clicked", async () => {
      await wrapper.vm.handleUserAction('modifyRights', mockedUser)
      const manageRightsDrawer = wrapper.findComponent({ name: 'ManageRightsDrawer' })

      expect(manageRightsDrawer.exists()).toBeTruthy()
      expect(manageRightsDrawer.props('modelValue')).toBeTruthy()
      expect(manageRightsDrawer.props('selectedUser')).toMatchObject(mockedUser)
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
        expectedItems: [
          {
            ...removeSignatoryToolboxItemDisabled,
          },
          {
            ...modifyToolboxItem,
          },
        ],
      },
      {
        userThatCanBeAdded: mockedCustomersCollab[1],
        expectedItems: [
          {
            ...addSignatoryToolboxItem,
          },
          {
            ...modifyToolboxItem,
          },
        ],
      },
    ])("should allow signatory add if user isn't already signatory", async ({ userThatCanBeAdded, expectedItems }) => {
      wrapper.vm.handleToolboxClick(userThatCanBeAdded)
      await nextTick()
      const items = wrapper.vm.toolboxItems
      expect(items).toStrictEqual(expectedItems)
    })

    it.each([
      {
        userToRemove: mockedCustomersCollab[0],
        expectedItems: [
          {
            ...removeSignatoryToolboxItemDisabled,
          },
          {
            ...modifyToolboxItem,
          },
        ],
        getSignatoriesMockToUse: apiMocks.singleAccountSignatory,
      },
      {
        userToRemove: mockedCustomersCollab[1],
        expectedItems: [
          {
            ...removeSignatoryToolboxItemEnabled,
          },
          {
            ...modifyToolboxItem,
          },
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
  })
})
