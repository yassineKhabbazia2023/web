import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PExpandableSearch from './PExpandableSearch.vue'

const meta: Meta<typeof PExpandableSearch> = {
  title: 'Atoms/PExpandableSearch',
  component: PExpandableSearch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'An expandable search input component with animation effects.',
      },
    },
  },
  argTypes: {
    pSearchContent: {
      control: 'text',
      description: 'The search content value',
    },
    pPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
    },
    pIsSearchShrinkable: {
      control: 'boolean',
      description: 'Whether the search can be collapsed',
    },
    pIsSearchOpen: {
      control: 'boolean',
      description: 'Whether the search is expanded',
    },
    pFocusOnExpand: {
      control: 'boolean',
      description: 'Whether to focus on the input when expanded',
    },
    pMaxLength: {
      control: 'number',
      description: 'Maximum length of the search input',
    },
    pType: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'white', 'danger'],
      description: 'Button type styling',
    },
  },
  args: {
    pSearchContent: '',
    pPlaceholder: '',
    pIsSearchShrinkable: true,
    pIsSearchOpen: false,
    pFocusOnExpand: false,
    pType: 'default',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PExpandableSearch },
    setup() {
      return { args }
    },
    template: '<PExpandableSearch v-bind="args" />',
  }),
}

export const WithPlaceholder: Story = {
  args: {
    pPlaceholder: 'Search...',
  },
}

export const ExpandedByDefault: Story = {
  args: {
    pIsSearchOpen: true,
    pPlaceholder: 'Type to search...',
  },
}

export const NonShrinkable: Story = {
  args: {
    pIsSearchShrinkable: false,
    pIsSearchOpen: true,
    pPlaceholder: 'Always expanded',
  },
}

export const WithFocusOnExpand: Story = {
  args: {
    pFocusOnExpand: true,
    pPlaceholder: 'Auto-focused when expanded',
  },
}

export const WithMaxLength: Story = {
  args: {
    pMaxLength: 20,
    pPlaceholder: 'Max 20 characters',
  },
}
