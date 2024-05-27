import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { getInitials } from '@/helper'
import mock from './../../mock.json'
import TableData from './'
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
        isOwner: false,
        isLoggedUser: () => false,
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

  it('should emit click-view-information upon toolbox click event', async () => {
    const wrapper = createWrapper()
    const row = { contactId: 123 }

    wrapper.vm.handleToolboxItemClick('', row)
    await nextTick()
    await flushPromises()

    expect(wrapper.emitted('click-view-information')).toBeTruthy()
    expect(wrapper.emitted('click-view-information')).toStrictEqual([
      [row.contactId],
    ])
  })

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
