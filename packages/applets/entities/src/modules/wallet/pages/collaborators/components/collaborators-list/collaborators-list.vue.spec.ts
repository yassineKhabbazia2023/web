import { shallowMount, type VueWrapper } from '@vue/test-utils'
import type { MockInstance } from 'vitest'
import { nextTick } from 'vue'
import { mockedCollaboratorsList2 } from '@entities/__mocks__/collaborators.mocks'
import { MENU_ACTIONS_NAME } from './constants'
import { apiGatewayGetMock } from '@pulse/common/mocks/vitest'
import { armCurrentUserPermissions } from '@pulse/common/mocks/vitest/current-user.permissions.helper'
import { getInitials } from '@entities/helpers'
import { PTable } from '@pulse/styleguide/components'
import type { PToolboxItemProps } from '@pulse/styleguide/types'

import CollaboratorsList from './collaborators-list.vue'

let wrapper: VueWrapper<any>

const mockGatewayGet = apiGatewayGetMock
let hasPermissionMock: MockInstance

beforeEach(() => {
  mockGatewayGet.mockResolvedValue({
    data: mockedCollaboratorsList2,
  })
  hasPermissionMock = armCurrentUserPermissions()
})

const createWrapper = (): VueWrapper<any> =>
  shallowMount(CollaboratorsList, {
    props: {
      data: mockedCollaboratorsList2.items.map(({
        firstName,
        lastName,
        office,
        persona,
        ...rest
      }) => ({
        ...rest,
        initials: getInitials(
          firstName,
          lastName,
        ),
        firstName,
        lastName,
        fullName: `${firstName} ${lastName}`,
        ibsStatus: '',
        role: persona?.name ?? '',
        office: office ?? '',
        hasAccess: false,
      })),
    },
    attachTo: document.body,
    global: {
      stubs: {
        PTable: {
          name: 'PTable',
          template: '<div><slot /></div>',
        },
        PTableColumn: {
          name: 'PTableColumn',
          template: '<div><slot :row="row" /></div>',
          data: () => {
            const row = {
            }

            return {
              row,
            }
          },
        },
        PAvatar: {
          name: 'PAvatar',
          template: '<div><slot /></div>',
        },
        CollabDetailsDrawer: {
          name: 'CollabDetailsDrawer',
          template: '<div class="p-drawer" />',
        },
        CollabRightsDrawer: {
          name: 'CollabRightsDrawer',
          template: '<div class="p-drawer" />',
        },
      },
    },
  })

const toolBoxElementsWithoutPermissions: PToolboxItemProps[] = [
  {
    pIconName: 'person',
    pValue: 'collaboratorInformation',
    pActionName: 'collaboratorInformation',
    pState: 'default',
  },
]

describe('tableData', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('has a menu with 2 items', () => {
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    expect(pToolbox.props('pElements')).toHaveLength(2)
  })

  const { collaboratorInformation, manageAccessRights } = MENU_ACTIONS_NAME
  it.each([collaboratorInformation, manageAccessRights])(
    'can display a drawer when menu action name is %s',
    async (actionName) => {
      const getDrawer = () => wrapper.find('.p-drawer')

      expect(getDrawer().exists()).toBeFalsy()
      wrapper.vm.handleToolboxItemClick(actionName, mockedCollaboratorsList2.items[0])
      await nextTick()

      expect(getDrawer().exists()).toBeTruthy()
    },
  )

  it('should display only the actions that the user has permission to perform', () => {
    hasPermissionMock.mockReturnValue(false)
    wrapper = createWrapper()
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    expect(pToolbox.props('pElements')).toHaveLength(1)
    expect(pToolbox.props('pElements')).toStrictEqual(toolBoxElementsWithoutPermissions)
  })

  it('emits event update collaborators details when event is emitted', async () => {
    wrapper.vm.handleToolboxItemClick('collaboratorInformation', mockedCollaboratorsList2.items[0])
    await nextTick()
    const getCollabDetailsDrawer = () => wrapper.findComponent({ name: 'CollabDetailsDrawer' })

    expect(getCollabDetailsDrawer().exists()).toBeTruthy()

    getCollabDetailsDrawer().vm.$emit('update-collaborator-details', mockedCollaboratorsList2.items[0])

    expect(wrapper.emitted('update-collaborator-details')).toHaveLength(1)
    expect(wrapper.emitted('update-collaborator-details')).toStrictEqual([[mockedCollaboratorsList2.items[0]]])
  })

  it('emits event update collaborators role when event is emitted', async () => {
    wrapper.vm.handleToolboxItemClick('manageAccessRights', mockedCollaboratorsList2.items[0])
    await nextTick()
    const collabRightsDrawer = wrapper.findComponent({ name: 'CollabRightsDrawer' })
    expect(collabRightsDrawer.exists()).toBeTruthy()
    collabRightsDrawer.vm.$emit('update-collaborator-role', mockedCollaboratorsList2.items[0])
    expect(wrapper.emitted('update-collaborator-role')).toHaveLength(1)
    expect(wrapper.emitted('update-collaborator-role')).toStrictEqual([[mockedCollaboratorsList2.items[0]]])
  })

  it('should emit on-sort-change upon sort change event', async () => {
    const wrapper = createWrapper()
    const sortPayload =

      '{"column":{"order":"ascending","id":"el-table_18_column_100","type":"default","property":"email","align":"is-left","headerAlign":"is-left","showOverflowTooltip":true,"filteredValue":[],"filterPlacement":"","isColumnGroup":false,"isSubColumn":false,"filterOpened":false,"sortable":true,"rawColumnKey":null,"label":"E-Mail","resizable":true,"sortOrders":["ascending","descending",null],"reserveSelection":false,"filterMultiple":true,"minWidth":80,"realWidth":423,"no":1,"level":1,"colSpan":1,"rowSpan":1},"prop":"email","order":"ascending"}'
    const table = wrapper.findComponent(PTable)
    await nextTick()

    table.vm.$emit('sort-change', JSON.parse(sortPayload))

    expect(wrapper.emitted('on-sort-change')).toBeTruthy()
    expect(wrapper.emitted('on-sort-change')).toStrictEqual([[{ 'descending': false, 'field': 'email' }]])
  })
})
