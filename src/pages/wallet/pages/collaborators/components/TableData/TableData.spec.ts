import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import mock from './../../mock.json'
import { MENU_ACTIONS_NAME } from './constants'
import TableData from './'

let wrapper: VueWrapper<any>

const createWrapper = (): VueWrapper<any> =>
  mount(TableData, {
    props: {
      data: mock.data.items.map(({
        firstName,
        lastName,
        ...rest
      }) => ({
        initials: `${firstName[0].toUpperCase()}${lastName[0].toUpperCase()}`,
        fullName: `${firstName} ${lastName}`,
        firstName,
        lastName,
        ...rest,
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
      wrapper.vm.handleToolboxItemClick(actionName, mock.data.items[0])
      await nextTick()

      expect(getDrawer().exists()).toBeTruthy()
    },
  )
})
