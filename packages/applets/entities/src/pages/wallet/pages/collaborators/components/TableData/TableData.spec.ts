import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { MENU_ACTIONS_NAME } from './constants'
import TableData from './'
import mock from '../../mockCollaborators.json'
import { getInitials } from '@entities/helper'
import { PTable } from '@pulse/styleguide/components'

let wrapper: VueWrapper<any>

const mockHasPermission = vi.fn((_code: string) => true)
const mockGatewayGet = vi.fn(() => {
  return Promise.resolve({
    data: mock,
  })
})

vi.mock('@pulse/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockGatewayGet,
    },
  }),
  commonStore: () => ({
    $patch: vi.fn(),
  }),
  debounce: (callback: Function) => callback,
  userPermissions: () => ({
    hasPermission: mockHasPermission,
  }),
}))
const createWrapper = (): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: mock.items.map(({
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
  })

const getMenu = () => document.querySelector('.el-popper') as HTMLElement

const toolBoxElementsWithoutPermissions = [
  {
    pIconName: 'PIPerson',
    pValue: 'Collaborator information',
    pActionName: 'collaboratorInformation',
    pState: 'default',
  },
]

describe('tableData', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('has a menu with 3 items', () => {
    const menuItems = getMenu().querySelectorAll('li')
    expect(menuItems).toHaveLength(2)
  })

  const { collaboratorInformation, manageAccessRights } = MENU_ACTIONS_NAME
  it.each([collaboratorInformation, manageAccessRights])(
    'can display a drawer when menu action name is %s',
    async (actionName) => {
      const getDrawer = () => wrapper.find('.p-drawer')

      expect(getDrawer().exists()).toBeFalsy()
      wrapper.vm.handleToolboxItemClick(actionName, mock.items[0])
      await nextTick()

      expect(getDrawer().exists()).toBeTruthy()
    },
  )

  it('should display only the actions that the user has permission to perform', () => {
    mockHasPermission.mockReturnValue(false)
    wrapper = createWrapper()
    const pToolbox = wrapper.findComponent({ name: 'PToolbox' })

    expect(pToolbox.props('pElements')).toHaveLength(1)
    expect(pToolbox.props('pElements')).toStrictEqual(toolBoxElementsWithoutPermissions)
  })

  it('emits event update collaborators details when event is emitted', async () => {
    wrapper.vm.handleToolboxItemClick('collaboratorInformation', mock.items[0])
    await nextTick()
    const getCollabDetailsDrawer = () => wrapper.findComponent({ name: 'CollabDetailsDrawer' })

    expect(getCollabDetailsDrawer().exists()).toBeTruthy()

    getCollabDetailsDrawer().vm.$emit('update-collaborator-details', mock.items[0])

    expect(wrapper.emitted('update-collaborator-details')).toHaveLength(1)
    expect(wrapper.emitted('update-collaborator-details')).toStrictEqual([[mock.items[0]]])
  })

  it('emits event update collaborators role when event is emitted', async () => {
    wrapper.vm.handleToolboxItemClick('manageAccessRights', mock.items[0])
    await nextTick()
    const collabRightsDrawer = wrapper.findComponent({ name: 'CollabRightsDrawer' })
    expect(collabRightsDrawer.exists()).toBeTruthy()
    collabRightsDrawer.vm.$emit('update-collaborator-role', mock.items[0])
    expect(wrapper.emitted('update-collaborator-role')).toHaveLength(1)
    expect(wrapper.emitted('update-collaborator-role')).toStrictEqual([[mock.items[0]]])
  })

  it('should emit on-sort-change upon sort change event', async () => {
    const wrapper = createWrapper()
    const sortPayload =

        '{"column":{"order":"ascending","id":"el-table_18_column_100","type":"default","property":"email","align":"is-left","headerAlign":"is-left","showOverflowTooltip":true,"filteredValue":[],"filterPlacement":"","isColumnGroup":false,"isSubColumn":false,"filterOpened":false,"sortable":true,"rawColumnKey":null,"label":"E-Mail","resizable":true,"sortOrders":["ascending","descending",null],"reserveSelection":false,"filterMultiple":true,"minWidth":80,"realWidth":423,"no":1,"level":1,"colSpan":1,"rowSpan":1},"prop":"email","order":"ascending"}'
    const table = wrapper.findComponent(PTable)
    await nextTick()

    table.vm.$emit('sort-change', JSON.parse(sortPayload))

    expect(wrapper.emitted('on-sort-change')).toBeTruthy()
    expect(wrapper.emitted('on-sort-change')).toStrictEqual([['+email']])
  })
})
