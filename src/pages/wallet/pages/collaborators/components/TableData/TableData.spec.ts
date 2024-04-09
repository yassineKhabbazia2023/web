import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { MENU_ACTIONS_NAME } from './constants'
import TableData from './'
import mock from '../../mockCollaborators.json'
import { getInitials } from '@/helper'
import DrawerCollabDetails from '../DrawerCollabDetails'
import DrawerCollabRole from '../DrawerCollabRole'

let wrapper: VueWrapper<any>

const mockGatewayGet = vi.fn(() => {
  return Promise.resolve({
    data: mock,
  })
})

vi.mock('@kpmg/common', () => ({
  commonApi: () => ({
    gateway: {
      get: mockGatewayGet,
    },
  }),
  commonStore: () => ({
    $patch: vi.fn(),
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

describe('tableData', () => {
  beforeEach(() => {
    wrapper = createWrapper()
  })

  it('has a menu with 3 items', () => {
    const menuItems = getMenu().querySelectorAll('li')
    expect(menuItems).toHaveLength(3)
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

  it('emits event update collaborators details when event is emitted', async () => {
    wrapper.vm.handleToolboxItemClick('collaboratorInformation', mock.items[0])
    await nextTick()
    const drawerCollabDetails = wrapper.findComponent(DrawerCollabDetails)
    expect(drawerCollabDetails.exists()).toBeTruthy()
    drawerCollabDetails.vm.$emit('update-collaborator-details', mock.items[0])
    expect(wrapper.emitted('update-collaborator-details')).toHaveLength(1)
    expect(wrapper.emitted('update-collaborator-details')).toStrictEqual([[mock.items[0]]])
  })

  it('emits event update collaborators role when event is emitted', async () => {
    wrapper.vm.handleToolboxItemClick('manageAccessRights', mock.items[0])
    await nextTick()
    const drawerCollabRole = wrapper.findComponent(DrawerCollabRole)
    expect(drawerCollabRole.exists()).toBeTruthy()
    drawerCollabRole.vm.$emit('update-collaborator-role', mock.items[0])
    expect(wrapper.emitted('update-collaborator-role')).toHaveLength(1)
    expect(wrapper.emitted('update-collaborator-role')).toStrictEqual([[mock.items[0]]])
  })
})
