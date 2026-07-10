import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PSamePagePagination from './PSamePagePagination.vue'
import type { PSamePagePaginationProps } from './PSamePagePaginationTypes'

const meta: Meta<typeof PSamePagePagination> = {
  title: 'Atoms/PSamePagePagination',
  component: PSamePagePagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A same-page pagination action used to progressively load more results.',
      },
    },
  },
  argTypes: {
    pLabel: {
      control: 'text',
      description: 'Button label',
    },
    pLoading: {
      control: 'boolean',
      description: 'Whether the load-more action is loading',
    },
    pTestIdRoot: {
      control: 'text',
      description: 'Root used to generate data-testid attributes',
    },
  },
  args: {
    pLabel: 'Show more results',
    pLoading: false,
    pTestIdRoot: 'psame-page-pagination',
  },
}

export default meta
type Story = StoryObj<PSamePagePaginationProps>

export const Default: Story = {
  render: (args) => ({
    components: { PSamePagePagination },
    setup() {
      return { args }
    },
    template: '<PSamePagePagination v-bind="args" />',
  }),
}

export const Loading: Story = {
  args: {
    pLoading: true,
  },
  render: (args) => ({
    components: { PSamePagePagination },
    setup() {
      return { args }
    },
    template: '<PSamePagePagination v-bind="args" />',
  }),
}
