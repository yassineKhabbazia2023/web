import { describe, it, expect } from 'vitest'
import { VueWrapper, mount } from '@vue/test-utils'
import { ElMenu } from 'element-plus'
import PMenu from '.'
import PMenuItem from '../PMenuItem'
import PSubMenu from '../PSubMenu'

const defaultMenuProps = {
  mode: 'vertical',
  defaultActive: '1-1',
  collapse: false,
  ellipsis: false,
  router: true,
  uniqueOpened: true,
  menuTrigger: 'click',
  collapseTransition: true
}

const defaultMenu = {
  index: '1',
  title: 'Submenu 1',
  items: [
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
}

const createWrapper = (
  menu: any = defaultMenu,
  menuProps: any = defaultMenuProps
): VueWrapper => {
  const Component = {
    template: `
      <PMenu 
        :pMode="menuProps.mode"
        :pDefaultActive="menuProps.defaultActive"
        :pCollapse="menuProps.collapse"
        :pEllipsis="menuProps.ellipsis"
        :pRouter="menuProps.router"
        :pUniqueOpened="menuProps.uniqueOpened"
        :pMenuTrigger="menuProps.menuTrigger"
        :pCollapseTransition="menuProps.collapseTransition"
        data-testid="menu"
      >
        <PSubMenu
          :pIndex="menu.index"
          data-testid="submenu"
        >
          <template #title>
            {{ menu.title }}
          </template>
          <PMenuItem
            v-for="item in menu.items"
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
        menu,
        menuProps
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

const findMenuItem = (wrapper: VueWrapper, index: number) =>
  wrapper.find(`[data-testid=menu-item]:nth-child(${index})`)

describe('pMenu', () => {
  describe('props', () => {
    it('should the props be passed correctly', () => {
      const wrapper = createWrapper()
      const component = wrapper.findComponent(ElMenu)

      expect(component.props()).toMatchObject(defaultMenuProps)
    })
  })
  describe('display', () => {
    it('should display the menu correctly', () => {
      const wrapper = createWrapper()
      const menu = wrapper.find('[data-testid=menu]')
      const submenu = wrapper.find('[data-testid=submenu]')
      const menuItems = wrapper.findAll('[data-testid=menu-item]')

      expect(menu.exists()).toBeTruthy()
      expect(submenu.exists()).toBeTruthy()
      expect(menuItems).toHaveLength(defaultMenu.items.length)
    })
    it('should display the menu correctly in horizontal mode', () => {
      const wrapper = createWrapper(defaultMenu, { mode: 'horizontal' })
      const menu = wrapper.find('[data-testid=menu]')

      expect(menu.classes()).toContain('el-menu--horizontal')
    })
    it('should the menu be collapsible and expandable', () => {
      const wrapper = createWrapper(defaultMenu, { collapse: true })
      const menu = wrapper.find('[data-testid=menu]')

      expect(menu.classes()).toContain('p-menu--collapsed')
    })
    it("should make 'defaultItemActive' active", () => {
      const wrapper = createWrapper()
      const firstMenuItem = findMenuItem(wrapper, 1)

      expect(firstMenuItem.classes()).toContain('is-active')
    })
  })
})
