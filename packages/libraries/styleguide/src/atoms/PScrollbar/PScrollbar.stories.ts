import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PScrollbar from './PScrollbar.vue'
import { ref } from 'vue'

const meta: Meta<typeof PScrollbar> = {
  title: 'Atoms/PScrollbar',
  component: PScrollbar,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A custom scrollbar component for handling overflow content.',
      },
    },
  },
  argTypes: {
    pHeight: {
      control: 'text',
      description: 'Height of the scrollbar container',
    },
    pMaxHeight: {
      control: 'text',
      description: 'Maximum height of the scrollbar container',
    },
    pNative: {
      control: 'boolean',
      description: 'Whether to use native scrollbar',
    },
    pWrapStyle: {
      control: 'text',
      description: 'Style for wrap container',
    },
    pViewStyle: {
      control: 'text',
      description: 'Style for view container',
    },
    pWrapClass: {
      control: 'text',
      description: 'Class for wrap container',
    },
    pViewClass: {
      control: 'text',
      description: 'Class for view container',
    },
    pNoresize: {
      control: 'boolean',
      description: 'Whether to respond to container size changes',
    },
    pTag: {
      control: 'text',
      description: 'Element tag for the view',
    },
    pAlways: {
      control: 'boolean',
      description: 'Always show scrollbar',
    },
    pMinSize: {
      control: 'number',
      description: 'Minimum size of scrollbar',
    },
  },
  args: {
    pMaxHeight: '200px',
    pNative: false,
    pAlways: false,
    pMinSize: 20,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PScrollbar },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px;">
        <PScrollbar v-bind="args">
          <div v-for="item in 20" :key="item" style="height: 50px; margin: 8px; background: #e1e8ff; color: #5470c6; display: flex; align-items: center; justify-content: center;">
            {{ item }}
          </div>
        </PScrollbar>
      </div>
    `,
  }),
}

export const HorizontalScroll: Story = {
  args: {
    pMaxHeight: undefined,
  },
  render: (args) => ({
    components: { PScrollbar },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px;">
        <PScrollbar v-bind="args">
          <div style="display: flex;">
            <div v-for="item in 50" :key="item" style="flex-shrink: 0; width: 100px; height: 50px; margin: 8px; background: #ffe1e1; color: #e55353; display: flex; align-items: center; justify-content: center;">
              {{ item }}
            </div>
          </div>
        </PScrollbar>
      </div>
    `,
  }),
}

export const DynamicContent: Story = {
  args: {
    pMaxHeight: '400px',
  },
  render: (args) => ({
    components: { PScrollbar },
    setup() {
      const count = ref(3)
      const onAdd = () => count.value++
      const onDelete = () => {
        if (count.value > 0) {
          count.value--
        }
      }
      return { args, count, onAdd, onDelete }
    },
    template: `
      <div style="width: 500px;">
        <div style="margin-bottom: 16px;">
          <button @click="onAdd" style="padding: 4px 8px; margin-right: 8px;">Add Item</button>
          <button @click="onDelete" style="padding: 4px 8px; background: #e55353; color: white;">Delete Item</button>
        </div>
        <PScrollbar v-bind="args">
          <div v-for="item in count" :key="item" style="height: 50px; margin: 8px; background: #e1e8ff; color: #5470c6; display: flex; align-items: center; justify-content: center;">
            {{ item }}
          </div>
        </PScrollbar>
      </div>
    `,
  }),
}

export const AlwaysVisible: Story = {
  args: {
    pMaxHeight: '300px',
    pAlways: true,
  },
  render: (args) => ({
    components: { PScrollbar },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px;">
        <PScrollbar v-bind="args">
          <div v-for="item in 10" :key="item" style="height: 50px; margin: 8px; background: #e1e8ff; color: #5470c6; display: flex; align-items: center; justify-content: center;">
            {{ item }}
          </div>
        </PScrollbar>
      </div>
    `,
  }),
}

export const CustomHeight: Story = {
  args: {
    pHeight: '150px',
  },
  render: (args) => ({
    components: { PScrollbar },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px;">
        <PScrollbar v-bind="args">
          <div v-for="item in 20" :key="item" style="height: 50px; margin: 8px; background: #e1e8ff; color: #5470c6; display: flex; align-items: center; justify-content: center;">
            {{ item }}
          </div>
        </PScrollbar>
      </div>
    `,
  }),
}

export const NativeScrollbar: Story = {
  args: {
    pMaxHeight: '200px',
    pNative: true,
  },
  render: (args) => ({
    components: { PScrollbar },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px;">
        <PScrollbar v-bind="args">
          <div v-for="item in 20" :key="item" style="height: 50px; margin: 8px; background: #e1e8ff; color: #5470c6; display: flex; align-items: center; justify-content: center;">
            Native Scrollbar - {{ item }}
          </div>
        </PScrollbar>
      </div>
    `,
  }),
}
