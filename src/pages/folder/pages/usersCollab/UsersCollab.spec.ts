import { describe, expect, it, vi, beforeEach } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { defineStore } from 'pinia'
import { createTestingPinia } from '@pinia/testing'
import { dataFromApi, getMockedCustomersCollab } from './mockData'
import UsersCollab from '.'

const mockedCustomersCollab = getMockedCustomersCollab()
const mockedUser = {
  ...dataFromApi.data.items[0],
  fullName: "Johnny's Pizza",
  initials: 'JP',
}
const mockHasPermission = vi.fn((_code: string) => true)

vi.mock('@/services/wallet', () => ({
  fetchAccountCustomers: vi.fn(() => Promise.resolve(mockedCustomersCollab)),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      id: 5,
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

const toolBoxElementsWithoutPermissions = [
  {
    pActionName: 'assignSignatory',
    pIconName: 'PIPatchCheck',
    pState: 'default',
    pValue: 'Designate as signatory',
  },
  {
    pIconName: 'PIPencilSquare',
    pValue: 'Change the rights',
    pActionName: 'modifyRights',
    pState: 'default',
  },
]

const pinia = createTestingPinia()

const createWrapper = (): VueWrapper<any> => {
  return mount(UsersCollab, {
    global: {
      plugins: [pinia],
    },
  })
}

describe('usersCollab', () => {
  let wrapper: VueWrapper<any>
  beforeEach(async () => {
    wrapper = createWrapper()
    await flushPromises()
  })
  describe('display', () => {
    it('displays the Block Header', () => {
      const pToolbox = wrapper.findComponent({ name: 'PToolbox' })
      const blockHeader = wrapper.findComponent(
        '[data-testid=folder-users-collab-block-header]',
      )

      expect(blockHeader.exists()).toBeTruthy()
      expect(pToolbox.props('pElements')).toHaveLength(3)
    })
    it('should display only the actions that the user has permission to perform', () => {
      mockHasPermission.mockReturnValue(false)
      wrapper = createWrapper()
      const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

      expect(pToolbox.props('pElements')).toHaveLength(2)
      expect(pToolbox.props('pElements')).toStrictEqual(toolBoxElementsWithoutPermissions)
    })
    it('should display correctly the users collab table', () => {
      const usersTable = wrapper.find('[data-testid=folder-users-table]')
      expect(usersTable.exists()).toBeTruthy()

      const rows = wrapper.findAll('tr.el-table__row')
      expect(rows).toHaveLength(mockedCustomersCollab.length)

      const { firstName, lastName, email, personaName, creationDate } =
        mockedCustomersCollab[0]
      const mockData = [
        firstName,
        lastName,
        email,
        'Invited',
        personaName,
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
    it("should display the 'Modify Rights' drawer when the 'Modify Rights' action is clicked", async () => {
      await wrapper.vm.handleUserAction('modifyRights', mockedUser)
      const manageRightsDrawer = wrapper.findComponent({ name: 'ManageRightsDrawer' })

      expect(manageRightsDrawer.exists()).toBeTruthy()
      expect(manageRightsDrawer.props('modelValue')).toBeTruthy()
      expect(manageRightsDrawer.props('selectedUser')).toMatchObject(mockedUser)
    })
  })
})
