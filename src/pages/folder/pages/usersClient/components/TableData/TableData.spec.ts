import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getInitials } from '@/helper'
import mock from './../../mock.json'
import TableData from './'
import { userActions } from './types'
import { nextTick } from 'vue'

const mockHasPermission = vi.fn((_code: string) => true)
vi.mock('@kpmg/common', () => ({
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
}))

const toolBoxElementsWithoutPermissions = [
  {
    pIconName: 'PIPerson',
    pValue: 'User information',
    pActionName: 'userInformation',
    pState: 'default',
  },
]

const createWrapper = (): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: mock.data.items.map(({ firstName, lastName, ...rest }) => ({
        initials: getInitials(firstName, lastName),
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        isSignatory: false,
        isOwner: false,
        isLoggedUser: false,
        ...rest,
      })),
    },
  })

const getMenu = () => document.querySelector('.el-popper') as HTMLElement

describe('tableData', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('has a menu with 3 items', () => {
    const menuItems = getMenu().querySelectorAll('li')
    expect(menuItems).toHaveLength(3)
  })

  const {
    MODIFY_RIGHTS,
    REMOVE_USER,
    USER_INFORMATION,
  } = userActions
  const ACTIONS_AND_ASSOCIATED_EVENTS = [
    [MODIFY_RIGHTS, 'display-manage-rights'],
    [REMOVE_USER, 'remove-user'],
    [USER_INFORMATION, 'click-view-information'],
  ]

  it.each(ACTIONS_AND_ASSOCIATED_EVENTS)(
    'can click on %s inside the toolbox and emit %s',
    async (action, expectedEvent) => {
      const wrapper = createWrapper()

      const row = { contactId: 123 }

      wrapper.vm.handleToolboxItemClick(action, row)
      await nextTick()
      await flushPromises()

      expect(wrapper.emitted(expectedEvent)).toBeTruthy()

      const isRemoveUserAction = action === REMOVE_USER
      expect(wrapper.emitted(expectedEvent)).toStrictEqual([
        [
          isRemoveUserAction
            ? { contactId: row.contactId }
            : row.contactId,
        ],
      ])
    },
  )

  it('should display only the actions that the user has permission to perform', () => {
    mockHasPermission.mockReturnValue(false)
    const wrapper = createWrapper()
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    expect(pToolbox.props('pElements')).toHaveLength(1)
    expect(pToolbox.props('pElements')).toStrictEqual(
      toolBoxElementsWithoutPermissions,
    )
  })

  describe('events', () => {
    it('should emit event to display drawer', async () => {
      const wrapper = createWrapper()
      const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

      pToolbox.vm.$emit(
        'p-toolbox-item-clicked',
        'modifyRights',
      )
      await nextTick()

      expect(wrapper.emitted('display-manage-rights')).toBeTruthy()
    })
  })
})
