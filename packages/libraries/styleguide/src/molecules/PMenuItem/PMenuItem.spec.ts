import { describe, it, expect } from 'vitest'
import type { VueWrapper } from '@vue/test-utils'
import { flushPromises, shallowMount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { ElMenuItem } from 'element-plus'
import type { PMenuItemProps } from './PMenuItemTypes'
import PMenuItem from '.'
import PMenu from '../PMenu'

const testMenuItemProps = {
  index: '1-1',
  route: { path: '/item1' },
  disabled: false,
}

const defaultItems: PMenuItemProps[] = [
  {
    pIndex: testMenuItemProps.index,
    pRoute: testMenuItemProps.route,
    pDisabled: testMenuItemProps.disabled,
  },
  {
    pIndex: '1-2',
    pRoute: { path: '/item2' },
  },
  {
    pIndex: '1-3',
    pRoute: { path: '/item3' },
    pDisabled: true,
  },
]

const createWrapper = (items: PMenuItemProps[] = defaultItems): VueWrapper => {
  const Component = {
    template: `
      <PMenu>
        <PMenuItem
          v-for="item in items"
          :key="item.pIndex"
          :pIndex="item.pIndex"
          :pRoute="item.pRoute"
          :pDisabled="item.pDisabled"
          pLeftIcon="PIHouse"
          pRightIcon="PICheckCircle"
          data-testid="menu-item"
        >
          <template #title>
            Item {{ item.pIndex }}
          </template>
        </PMenuItem>
      </PMenu>
    `,
    data() {
      return {
        items,
      }
    },
  }

  return shallowMount(Component, {
    global: {
      stubs: {
        PMenuItem,
        ElMenuItem: {
          name: 'ElMenuItem',
          template: '<div><slot name="title" /><slot /></div>',
          props: [
            'disabled',
            'index',
            'route',
          ],
        },
        PMenu: {
          name: 'PMenu',
          template: '<div><slot /></div>',
        },
        PIcon: {
          name: 'PIcon',
          template: '<div><slot /></div>',
        },
      },
    },
  })
}

const findMenuItem = (wrapper: VueWrapper, index: number) =>
  wrapper.find(`[data-testid=menu-item]:nth-child(${index})`)

describe('pMenu', () => {
  describe('props', () => {
    it('should be props passed', () => {
      const wrapper = createWrapper()
      const component = wrapper.findComponent(ElMenuItem)

      expect(component.props()).toMatchObject(testMenuItemProps)
    })
  })
  describe('display', () => {
    it('should display menu items correctly inside the menu.', () => {
      const wrapper = createWrapper()
      const allMenuItems = wrapper.findAll('[data-testid=menu-item]')
      const firstMenuItem = findMenuItem(wrapper, 1)
      const secondMenuItem = findMenuItem(wrapper, 2)

      expect(allMenuItems).toHaveLength(defaultItems.length)
      expect(firstMenuItem.text()).toBe(`Item ${defaultItems[0].pIndex}`)
      expect(secondMenuItem.text()).toBe(`Item ${defaultItems[1].pIndex}`)
    })
    it('should display the leftIcon if it exists', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const leftIconElement = wrapper.find('.p-menu-item__left-icon')
      expect(leftIconElement).toBeTruthy()
    })
    it('should display the rightIcon if it exists', async () => {
      const wrapper = createWrapper()
      await flushPromises()
      const rightIconElement = wrapper.find('.p-menu-item__right-icon')
      expect(rightIconElement.exists()).toBeTruthy()
    })
  })
})
