import { describe, expect, it, vi, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { dataFromApi, getMockedCustomersCollab } from './mockData'
import { fetchAccountCustomers } from '@/services/wallet'
import UsersCollab from '.'

const DEFAULT_CURRENT_PAGE = 1
const DEFAULT_ROUTE_PARAMS_ID = 5

const mockedCustomersCollab = getMockedCustomersCollab()
const mockedUser = {
  ...dataFromApi.data.items[0],
  fullName: "Johnny's Pizza",
  initials: 'JP',
}

const mockHasPermission = vi.fn((_code: string) => true)

vi.mock('@/services/wallet', () => ({
  fetchAccountCustomers: vi.fn(() => Promise.resolve({
    items: mockedCustomersCollab,
    totalItems: mockedCustomersCollab.length,
    currentPage: DEFAULT_CURRENT_PAGE,
  })),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: DEFAULT_ROUTE_PARAMS_ID,
    },
  }),
}))

vi.mock('@kpmg/common', () => ({
  commonStore: defineStore('common', {
    state: () => ({
      user: {
        id: 2,
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

describe('usersCollab', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it('should display correctly the users collab table', () => {
      const usersTable = wrapper.find('[data-testid=folder-users-table]')
      expect(usersTable.exists()).toBeTruthy()

      const rows = wrapper.findAll('tr.el-table__row')
      expect(rows).toHaveLength(mockedCustomersCollab.length)

      const { firstName, lastName, email, creationDate } =
        mockedCustomersCollab[0]
      const mockData = [
        firstName,
        lastName,
        email,
        'Invited',
        creationDate,
      ]
      const firstRowText = rows[0].text()

      mockData.forEach((data) => {
        expect(firstRowText).toContain(data)
      })
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
  })
})
