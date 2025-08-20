import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { reactive } from 'vue'
import PMenu from './PMenu.vue'
import PMenuItem from '../PMenuItem'
import PSubMenu from '../PSubMenu'
import type { PMenuProps } from './PMenuTypes'

const meta: Meta<typeof PMenu> = {
  title: 'Molecules/PMenu',
  component: PMenu,
  parameters: {
    docs: {
      description: {
        component: 'A versatile menu component with support for nested submenus, collapse functionality, and various display modes.',
      },
    },
  },
  argTypes: {
    pMode: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Menu display mode',
      table: {
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: 'vertical' },
      },
    },
    pCollapse: {
      control: 'boolean',
      description: 'Whether the menu is collapsed',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pEllipsis: {
      control: 'boolean',
      description: 'Whether to show ellipsis for overflow items',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pDefaultActive: {
      control: 'text',
      description: 'Default active menu item index',
      table: {
        type: { summary: 'string' },
      },
    },
    pRouter: {
      control: 'boolean',
      description: 'Whether to enable router mode',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pDefaultOpeneds: {
      control: 'object',
      description: 'Array of default opened submenu indexes',
      table: {
        type: { summary: 'string[]' },
      },
    },
    pUniqueOpened: {
      control: 'boolean',
      description: 'Whether to keep only one submenu open at a time',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pMenuTrigger: {
      control: 'select',
      options: ['hover', 'click'],
      description: 'How to trigger submenu opening',
      table: {
        type: { summary: "'hover' | 'click'" },
        defaultValue: { summary: 'hover' },
      },
    },
    pCollapseTransition: {
      control: 'boolean',
      description: 'Whether to enable collapse transition',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PMenu>

const menuItems = [
  { index: '1', title: 'Menu Item 1' },
  { index: '2', title: 'Menu Item 2' },
  { index: '3', title: 'Menu Item 3' },
  { index: '4', title: 'Menu Item 4' },
]

const submenus = [
  {
    index: '1',
    title: 'Submenu 1',
    items: menuItems.map((item) => ({ ...item, index: `1-${item.index}` })),
  },
  {
    index: '2',
    title: 'Submenu 2',
    items: menuItems.map((item) => ({ ...item, index: `2-${item.index}` })),
  },
]

export const Default: Story = {
  render: (args: PMenuProps) => ({
    components: { PMenu, PMenuItem, PSubMenu },
    setup() {
      const handleOpen = (index: string) => {
        console.log('Menu opened:', index)
      }

      const handleClose = (index: string) => {
        console.log('Menu closed:', index)
      }

      const handleSelect = (index: string) => {
        console.log('Menu selected:', index)
      }

      return {
        args,
        submenus,
        menuItems,
        handleOpen,
        handleClose,
        handleSelect,
      }
    },
    template: `
      <div style="padding: 20px; background-color: var(--el-color-persian-100, #f5f5f5); min-height: 400px;">
        <PMenu
          v-bind="args"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
        >
          <PSubMenu
            v-for="submenu in submenus"
            :key="submenu.index"
            :pIndex="submenu.index"
            pIconName="house"
          >
            <template #title>
              {{ submenu.title }}
            </template>
            <PMenuItem
              v-for="item in submenu.items"
              :key="item.index"
              :pIndex="item.index"
              pIconRightName="checkCircle"
            >
              <template #title>
                {{ item.title }}
              </template>
            </PMenuItem>
          </PSubMenu>
          <PMenuItem
            v-for="item in menuItems"
            :key="item.index"
            :pIndex="item.index"
            pIconLeftName="house"
          >
            <template #title>
              {{ item.title }}
            </template>
          </PMenuItem>
        </PMenu>
      </div>
    `,
  }),
  args: {
    pDefaultActive: '1-2',
    pMode: 'vertical',
    pCollapse: false,
    pEllipsis: true,
    pRouter: true,
    pUniqueOpened: false,
    pMenuTrigger: 'hover',
    pCollapseTransition: false,
  },
}

export const CollapsedMenu: Story = {
  render: (args: PMenuProps) => ({
    components: { PMenu, PMenuItem, PSubMenu },
    setup() {
      return {
        args,
        submenus,
        menuItems,
      }
    },
    template: `
      <div style="padding: 20px; background-color: var(--el-color-persian-100, #f5f5f5); min-height: 400px;">
        <div style="width: 54px;">
          <PMenu v-bind="args">
            <PSubMenu
              v-for="submenu in submenus"
              :key="submenu.index"
              :pIndex="submenu.index"
              pIconName="house"
            >
              <template #title>
                {{ submenu.title }}
              </template>
              <PMenuItem
                v-for="item in submenu.items"
                :key="item.index"
                :pIndex="item.index"
                pIconRightName="checkCircle"
              >
                <template #title>
                  {{ item.title }}
                </template>
              </PMenuItem>
            </PSubMenu>
            <PMenuItem
              v-for="item in menuItems"
              :key="item.index"
              :pIndex="item.index"
              pIconLeftName="house"
            >
              <template #title>
                {{ item.title }}
              </template>
            </PMenuItem>
          </PMenu>
        </div>
      </div>
    `,
  }),
  args: {
    pDefaultActive: '1',
    pMode: 'vertical',
    pCollapse: true,
    pRouter: false,
    pCollapseTransition: true,
  },
}

export const UniqueOpenedSubmenus: Story = {
  render: (args: PMenuProps) => ({
    components: { PMenu, PMenuItem, PSubMenu },
    setup() {
      return {
        args,
        submenus,
        menuItems,
      }
    },
    template: `
      <div style="padding: 20px; background-color: var(--el-color-persian-100, #f5f5f5); min-height: 400px;">
        <PMenu v-bind="args">
          <PSubMenu
            v-for="submenu in submenus"
            :key="submenu.index"
            :pIndex="submenu.index"
            pIconName="folder"
          >
            <template #title>
              {{ submenu.title }}
            </template>
            <PMenuItem
              v-for="item in submenu.items"
              :key="item.index"
              :pIndex="item.index"
              pIconRightName="checkCircle"
            >
              <template #title>
                {{ item.title }}
              </template>
            </PMenuItem>
          </PSubMenu>
          <PMenuItem
            v-for="item in menuItems"
            :key="item.index"
            :pIndex="item.index"
            pIconLeftName="fileText"
          >
            <template #title>
              {{ item.title }}
            </template>
          </PMenuItem>
        </PMenu>
      </div>
    `,
  }),
  args: {
    pDefaultActive: '1-1',
    pMode: 'vertical',
    pCollapse: false,
    pUniqueOpened: true,
    pDefaultOpeneds: ['1'],
    pRouter: false,
  },
}

export const ClickTriggerSubmenus: Story = {
  render: (args: PMenuProps) => ({
    components: { PMenu, PMenuItem, PSubMenu },
    setup() {
      return {
        args,
        submenus,
        menuItems,
      }
    },
    template: `
      <div style="padding: 20px; background-color: var(--el-color-persian-100, #f5f5f5); min-height: 400px;">
        <h3 style="margin-bottom: 16px;">Click to Open Submenus</h3>
        <PMenu v-bind="args">
          <PSubMenu
            v-for="submenu in submenus"
            :key="submenu.index"
            :pIndex="submenu.index"
            pIconName="gear"
          >
            <template #title>
              {{ submenu.title }} (Click to open)
            </template>
            <PMenuItem
              v-for="item in submenu.items"
              :key="item.index"
              :pIndex="item.index"
            >
              <template #title>
                {{ item.title }}
              </template>
            </PMenuItem>
          </PSubMenu>
          <PMenuItem
            v-for="item in menuItems"
            :key="item.index"
            :pIndex="item.index"
            pIconLeftName="person"
          >
            <template #title>
              {{ item.title }}
            </template>
          </PMenuItem>
        </PMenu>
      </div>
    `,
  }),
  args: {
    pMode: 'vertical',
    pCollapse: false,
    pMenuTrigger: 'click',
    pRouter: false,
  },
}

export const DisabledItems: Story = {
  render: (args: PMenuProps) => ({
    components: { PMenu, PMenuItem, PSubMenu },
    setup() {
      return {
        args,
        submenus,
        menuItems,
      }
    },
    template: `
      <div style="padding: 20px; background-color: var(--el-color-persian-100, #f5f5f5); min-height: 400px;">
        <h3 style="margin-bottom: 16px;">Menu with Disabled Items</h3>
        <PMenu v-bind="args">
          <PSubMenu
            v-for="(submenu, index) in submenus"
            :key="submenu.index"
            :pIndex="submenu.index"
            pIconName="folder"
            :pDisabled="index === 1"
          >
            <template #title>
              {{ submenu.title }} {{ index === 1 ? '(Disabled)' : '' }}
            </template>
            <PMenuItem
              v-for="(item, itemIndex) in submenu.items"
              :key="item.index"
              :pIndex="item.index"
              :pDisabled="itemIndex === 1"
            >
              <template #title>
                {{ item.title }} {{ itemIndex === 1 ? '(Disabled)' : '' }}
              </template>
            </PMenuItem>
          </PSubMenu>
          <PMenuItem
            v-for="(item, index) in menuItems"
            :key="item.index"
            :pIndex="item.index"
            pIconLeftName="fileText"
            :pDisabled="index === 2"
          >
            <template #title>
              {{ item.title }} {{ index === 2 ? '(Disabled)' : '' }}
            </template>
          </PMenuItem>
        </PMenu>
      </div>
    `,
  }),
  args: {
    pMode: 'vertical',
    pCollapse: false,
    pRouter: false,
  },
}

export const MenuVariations: Story = {
  render: (_args: PMenuProps) => ({
    components: { PMenu, PMenuItem, PSubMenu },
    setup() {
      const collapsedState = reactive({ collapsed: false })

      const toggleCollapse = () => {
        collapsedState.collapsed = !collapsedState.collapsed
      }

      return {
        submenus,
        menuItems,
        collapsedState,
        toggleCollapse,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Interactive Menu Variations</h3>
        
        <div style="margin-bottom: 16px;">
          <button 
            @click="toggleCollapse"
            style="padding: 8px 16px; background: #409eff; color: white; border: none; border-radius: 4px; cursor: pointer;"
          >
            {{ collapsedState.collapsed ? 'Expand Menu' : 'Collapse Menu' }}
          </button>
        </div>
        
        <div style="background-color: var(--el-color-persian-100, #f5f5f5); min-height: 400px;" :style="{ width: collapsedState.collapsed ? '64px' : '220px', transition: 'width 0.3s' }">
          <PMenu
            pDefaultActive="1-2"
            pMode="vertical"
            :pCollapse="collapsedState.collapsed"
            :pCollapseTransition="true"
            :pUniqueOpened="false"
            :pRouter="false"
          >
            <PSubMenu
              v-for="submenu in submenus"
              :key="submenu.index"
              :pIndex="submenu.index"
              pIconName="house"
            >
              <template #title>
                {{ submenu.title }}
              </template>
              <PMenuItem
                v-for="item in submenu.items"
                :key="item.index"
                :pIndex="item.index"
                pIconRightName="checkCircle"
              >
                <template #title>
                  {{ item.title }}
                </template>
              </PMenuItem>
            </PSubMenu>
            <PMenuItem
              v-for="item in menuItems"
              :key="item.index"
              :pIndex="item.index"
              pIconLeftName="person"
            >
              <template #title>
                {{ item.title }}
              </template>
            </PMenuItem>
          </PMenu>
        </div>
      </div>
    `,
  }),
  args: {},
}
