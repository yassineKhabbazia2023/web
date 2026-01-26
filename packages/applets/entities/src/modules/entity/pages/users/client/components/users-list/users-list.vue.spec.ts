import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SortDirection, ContactType } from '@pulse/common/enums'
import { mockedUsersClient } from '@entities/__mocks__/users-client.mocks'
import { getInitials } from '@entities/helper'
import { CurrentUserManagerMock, hasPermissionMock } from '@pulse/common/mocks/vitest'
import { UserActions } from '@entities/modules/entity/enums'
import { nextTick } from 'vue'

import UsersList from './'

vi.mock('@pulse/common/managers', () => ({
  CurrentUserManager: CurrentUserManagerMock,
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'users' }),
}))

let wrapper: VueWrapper<any>

const toolBoxElementsWithoutPermissions = [
  {
    pIconName: 'person',
    pValue: 'User information',
    pActionName: 'userInformation',
    pState: 'default',
  },
]

const createWrapper = (): VueWrapper<any> =>
  shallowMount(UsersList, {
    props: {
      data: mockedUsersClient.data.items.map(({ firstName, lastName, ...rest }) => ({
        initials: getInitials(firstName, lastName),
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        isSignatory: false,
        isOwner: false,
        isLoggedUser: false,
        type: ContactType.CUSTOMER,
        status: 'Declared',
        globalContactId: '1bb50d07-f5de-424d-88be-75a5d4b570ed',
        ...rest,
      })),
      isInAnEntityPage: true,
      canManageUsers: true,
    },
    global: {
      stubs: {
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>',
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" /></div>',
          data() {
            const row = {
              initials: 'AB',
              creationDate: '2024-01-13',
              isSignatory: false,
              isLoggedUser: false,
              statusTag: {
                text: '',
                color: '',
                icon: '',
              },
            }

            return {
              row,
            }
          },
        },
        PToolbox: {
          name: 'PToolbox',
          template: '<div><slot /></div>',
          props: ['pElements'],
        },
      },
    },
  })

describe('users-list', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('has a menu with 3 items if the route name is users', () => {
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    expect(pToolbox.props('pElements')).toHaveLength(3)
  })

  const row = { contactId: 123 }
  const tests = [{
    action: UserActions.MODIFY_RIGHTS,
    expectedEvent: 'display-manage-rights',
    expectedParams: row.contactId,
  }, {
    action: UserActions.REMOVE_USER,
    expectedEvent: 'remove-user',
    expectedParams: { contactId: row.contactId },
  }, {
    action: UserActions.USER_INFORMATION,
    expectedEvent: 'click-view-information',
    expectedParams: row.contactId,
  }]

  it.each(tests)(
    'emit proper event when click on $action in toolbox',
    ({
      action,
      expectedEvent,
      expectedParams,
    }) => {
      wrapper.vm.handleToolboxItemClick(action, row)

      const emittedEvent = wrapper.emitted(expectedEvent)
      expect(emittedEvent).toBeTruthy()
      expect(emittedEvent).toStrictEqual([[expectedParams]])
    },
  )

  it('should display only the actions that the user has permission to perform', () => {
    hasPermissionMock.mockReturnValue(false)
    wrapper = createWrapper()
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    expect(pToolbox.exists()).toBeTruthy()
    expect(pToolbox.props('pElements')).toHaveLength(1)
    expect(pToolbox.props('pElements')).toStrictEqual(
      toolBoxElementsWithoutPermissions,
    )
  })

  describe('events', () => {
    it('should emit event to display drawer', async () => {
      const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

      pToolbox.vm.$emit(
        'p-toolbox-item-clicked',
        'modifyRights',
      )
      await nextTick()

      expect(wrapper.emitted('display-manage-rights')).toBeTruthy()
    })
  })

  describe('handleSelectUser', () => {
    it('should emit select-user with contactIds', () => {
      const users = [{ contactId: 1 }, { contactId: 2 }]

      wrapper.vm.handleSelectUser(users)

      expect(wrapper.emitted('select-user')).toStrictEqual([[[1, 2]]])
    })
  })

  describe('handleSort', () => {
    it('should emit sort-user with descending false for ascending order', () => {
      wrapper.vm.handleSort({ prop: 'name', order: SortDirection.ASCENDING })

      expect(wrapper.emitted('sort-user')).toStrictEqual([[{
        field: 'name',
        descending: false,
      }]])
    })

    it('should emit sort-user with descending true for descending order', () => {
      wrapper.vm.handleSort({ prop: 'name', order: SortDirection.DESCENDING })

      expect(wrapper.emitted('sort-user')).toStrictEqual([[{
        field: 'name',
        descending: true,
      }]])
    })
  })
})
