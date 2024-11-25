import { shallowMount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getInitials } from '@entities/helper'
import mock from './../../mock.json'
import TableData from './'
import { userActions } from './types'
import { nextTick } from 'vue'

const mockHasPermission = vi.fn((_code: string) => true)
vi.mock('@pulse/common', () => ({
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
}))

vi.mock('vue-router', () => ({
  useRoute: () => ({ name: 'users' }),
}))

let wrapper: VueWrapper<any>

const toolBoxElementsWithoutPermissions = [
  {
    pIconName: 'PIPerson',
    pValue: 'User information',
    pActionName: 'userInformation',
    pState: 'default',
  },
]

const createWrapper = (): VueWrapper<any> =>
  shallowMount(TableData, {
    props: {
      data: mock.data.items.map(({ firstName, lastName, ...rest }) => ({
        initials: getInitials(firstName, lastName),
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        isSignatory: false,
        isOwner: false,
        isLoggedUser: false,
        type: 'Customer',
        status: 'Declared',
        globalContactId: '1bb50d07-f5de-424d-88be-75a5d4b570ed',
        ...rest,
      })),
      isInAnEntityPage: true,
    },
    global: {
      stubs: {
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>'
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
              }
            }

            return {
              row
            }
          }
        },
        PToolbox: {
          name: 'PToolbox',
          template: '<div><slot /></div>',
          props: ['pElements'],
        }
      }
    }
  })

describe('tableData', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('has a menu with 3 items if the route name is users', () => {
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    expect(pToolbox.props('pElements')).toHaveLength(3)
  })

  const row = { contactId: 123 }
  const tests = [{
    action: userActions.MODIFY_RIGHTS,
    expectedEvent: 'display-manage-rights',
    expectedParams: row.contactId,
  }, {
    action: userActions.REMOVE_USER,
    expectedEvent: 'remove-user',
    expectedParams: { contactId: row.contactId },
  }, {
    action: userActions.USER_INFORMATION,
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
    mockHasPermission.mockReturnValue(false)
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
})
