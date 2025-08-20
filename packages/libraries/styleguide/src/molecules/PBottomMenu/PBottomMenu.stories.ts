import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PBottomMenu from './PBottomMenu.vue'

const meta: Meta<typeof PBottomMenu> = {
  title: 'Molecules/PBottomMenu',
  component: PBottomMenu,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Menu de navigation inférieur pour mobile et tablette. Disparaît automatiquement sur desktop sauf si spécifié.',
      },
    },
  },
  argTypes: {
    pHideOnDesktop: {
      control: 'boolean',
      description: 'Cache le menu sur desktop (lg et plus)',
    },
    pUseRouter: {
      control: 'boolean',
      description: 'Utilise vue-router pour la navigation',
    },
    pItems: {
      control: 'object',
      description: 'Éléments du menu avec nom, chemin et icône',
    },
  },
  args: {
    pHideOnDesktop: true,
    pUseRouter: false,
    pItems: [
      {
        pName: 'Dashboard',
        pPath: '/dashboard',
        pIconName: 'columnsGap',
      },
      {
        pName: 'Document',
        pPath: '/document',
        pIconName: 'files',
      },
      {
        pName: 'Settings',
        pPath: '/settings',
        pIconName: 'gear',
      },
      {
        pName: 'Profile',
        pPath: '/profile',
        pIconName: 'person',
      },
    ],
  },
}

export default meta
export type Story = StoryObj<typeof meta>

// Basic usage
export const Basic: Story = {
  render: (args) => ({
    components: { PBottomMenu },
    setup() {
      const activeRoute = ref('/dashboard')

      const handleItemClick = (path: string) => {
        activeRoute.value = path
        console.log('Navigate to:', path)
      }

      return { args, activeRoute, handleItemClick }
    },
    template: `
      <div style="height: 100vh; display: flex; flex-direction: column;">
        <div style="flex: 1; padding: 20px; background: #f5f5f5;">
          <h2>Content Area</h2>
          <p>Current active route: {{ activeRoute }}</p>
          <p>The bottom menu appears at the bottom of the screen.</p>
        </div>
        <PBottomMenu 
          v-bind="args"
          :defaultActive="activeRoute"
          @item-click="handleItemClick"
        />
      </div>
    `,
  }),
}

// Visible on desktop
export const VisibleOnDesktop: Story = {
  args: {
    pHideOnDesktop: false,
  },
  render: (args) => ({
    components: { PBottomMenu },
    setup() {
      const activeRoute = ref('/dashboard')

      const handleItemClick = (path: string) => {
        activeRoute.value = path
        console.log('Navigate to:', path)
      }

      return { args, activeRoute, handleItemClick }
    },
    template: `
      <div style="height: 100vh; display: flex; flex-direction: column;">
        <div style="flex: 1; padding: 20px; background: #f5f5f5;">
          <h2>Content Area</h2>
          <p>Current active route: {{ activeRoute }}</p>
          <p>This bottom menu is visible on desktop (pHideOnDesktop=false).</p>
        </div>
        <PBottomMenu 
          v-bind="args"
          :defaultActive="activeRoute"
          @item-click="handleItemClick"
        />
      </div>
    `,
  }),
}

// Minimal menu
export const Minimal: Story = {
  args: {
    pItems: [
      {
        pName: 'Home',
        pPath: '/',
        pIconName: 'house',
      },
      {
        pName: 'Search',
        pPath: '/search',
        pIconName: 'search',
      },
    ],
  },
  render: (args) => ({
    components: { PBottomMenu },
    setup() {
      const activeRoute = ref('/')

      const handleItemClick = (path: string) => {
        activeRoute.value = path
        console.log('Navigate to:', path)
      }

      return { args, activeRoute, handleItemClick }
    },
    template: `
      <div style="height: 100vh; display: flex; flex-direction: column;">
        <div style="flex: 1; padding: 20px; background: #f5f5f5;">
          <h2>Minimal Menu</h2>
          <p>Current active route: {{ activeRoute }}</p>
          <p>A simple menu with only 2 items.</p>
        </div>
        <PBottomMenu 
          v-bind="args"
          :defaultActive="activeRoute"
          @item-click="handleItemClick"
        />
      </div>
    `,
  }),
}

// Extended menu
export const Extended: Story = {
  args: {
    pItems: [
      {
        pName: 'Dashboard',
        pPath: '/dashboard',
        pIconName: 'columnsGap',
      },
      {
        pName: 'Analytics',
        pPath: '/analytics',
        pIconName: 'barChart',
      },
      {
        pName: 'Documents',
        pPath: '/documents',
        pIconName: 'files',
      },
      {
        pName: 'Messages',
        pPath: '/messages',
        pIconName: 'envelope',
      },
      {
        pName: 'Settings',
        pPath: '/settings',
        pIconName: 'gear',
      },
    ],
  },
  render: (args) => ({
    components: { PBottomMenu },
    setup() {
      const activeRoute = ref('/analytics')

      const handleItemClick = (path: string) => {
        activeRoute.value = path
        console.log('Navigate to:', path)
      }

      return { args, activeRoute, handleItemClick }
    },
    template: `
      <div style="height: 100vh; display: flex; flex-direction: column;">
        <div style="flex: 1; padding: 20px; background: #f5f5f5;">
          <h2>Extended Menu</h2>
          <p>Current active route: {{ activeRoute }}</p>
          <p>A menu with 5 items showing how it handles more content.</p>
        </div>
        <PBottomMenu 
          v-bind="args"
          :defaultActive="activeRoute"
          @item-click="handleItemClick"
        />
      </div>
    `,
  }),
}
