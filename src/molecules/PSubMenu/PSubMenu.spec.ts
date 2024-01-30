import { describe, it, expect } from 'vitest'
import { VueWrapper, flushPromises, mount } from '@vue/test-utils'
import { ElSubMenu } from 'element-plus'
import PMenu from '../PMenu'
import PSubMenu from '.'
import PMenuItem from '../PMenuItem'

const defaultSubmenuProps = {
  index: '1',
  popperOffset: 10,
  showTimeout: 300,
  hideTimeout: 300,
  disabled: false
}

const menuItems = [
  {
    index: '1-1',
    title: 'Item 1',
    route: '/item1'
  },
  {
    index: '1-2',
    title: 'Item 2',
    route: '/item2'
  }
]

const createWrapper = (
  items: any = menuItems,
  submenuProps: any = defaultSubmenuProps
): VueWrapper => {
  const Component = {
    template: `
      <PMenu>
        <PSubMenu
          :pIndex="submenuProps.index"
          :pDisabled="submenuProps.disabled"
          :pPopperOffset="submenuProps.popperOffset"
          :pShowTimeout="submenuProps.showTimeout"
          :pHideTimeout="submenuProps.hideTimeout"
          pIcon="PIHouse"
          data-testid="submenu"
        >
          <template #title>
            Submenu {{ submenuProps.index }}
          </template>
          <PMenuItem
            v-for="item in items"
            :key="item.index"
            :pIndex="item.index"
            :pRoute="item.route"
            data-testid="menu-item"
          >
            <template #title>
              {{ item.title }}
            </template>
          </PMenuItem>
        </PSubMenu>
      </PMenu>
    `,
    data() {
      return {
        items,
        submenuProps
      }
    }
  }

  return mount(Component, {
    global: {
      components: {
        PMenu,
        PMenuItem,
        PSubMenu
      }
    }
  })
}

describe('pSubMenu', () => {
  it('should be props passed', () => {
    const wrapper = createWrapper()
    const component = wrapper.findComponent(ElSubMenu)

    expect(component.props()).toMatchObject(defaultSubmenuProps)
  })
  describe('display', () => {
    it('should display the submenu correctly with all menu items', () => {
      const wrapper = createWrapper()
      const submenu = wrapper.find('[data-testid=submenu]')
      const allMenuItems = wrapper.findAll('[data-testid=menu-item]')
      const submenuTitle = submenu.find('.el-sub-menu__title').text()

      expect(submenuTitle).toBe(`Submenu ${defaultSubmenuProps.index}`)
      expect(submenu.exists()).toBeTruthy()
      expect(allMenuItems).toHaveLength(menuItems.length)
    })
    it('should not open the submenu when the state is disabled', () => {
      const wrapper = createWrapper(menuItems, {
        ...defaultSubmenuProps,
        disabled: true
      })
      const submenu = wrapper.find('[data-testid=submenu]')

      expect(submenu.classes().includes('is-disabled')).toBeTruthy()
    })
    it('should display the icon if it exists', async () => {
      const wrapper = createWrapper()

      await flushPromises()
      const iconElement = wrapper.find('.p-submenu__icon')
      expect(iconElement.exists()).toBeTruthy()
    })
  })
})
