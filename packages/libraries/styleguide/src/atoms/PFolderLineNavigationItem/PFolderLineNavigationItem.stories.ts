import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PFolderLineNavigationItem from './PFolderLineNavigationItem.vue'

const meta: Meta<typeof PFolderLineNavigationItem> = {
  title: 'Atoms/PFolderLineNavigationItem',
  component: PFolderLineNavigationItem,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A folder navigation item component with icon and arrow support.',
      },
    },
  },
  argTypes: {
    pFolderName: {
      control: 'text',
      description: 'The name of the folder',
    },
    pFolderId: {
      control: 'number',
      description: 'The ID of the folder',
    },
    pHasArrow: {
      control: 'boolean',
      description: 'Whether to show an arrow',
    },
    pIconLeftName: {
      control: 'text',
      description: 'The name of the icon to display',
    },
    pSelected: {
      control: 'boolean',
      description: 'Whether the item is selected',
    },
    pDisabled: {
      control: 'boolean',
      description: 'Whether the item is disabled',
    },
    pTooltipContent: {
      control: 'text',
      description: 'Tooltip content to display on hover',
    },
  },
  args: {
    pFolderName: 'Name of folder',
    pFolderId: 3116446,
    pHasArrow: true,
    pIconLeftName: 'folder',
    pSelected: false,
    pDisabled: false,
    pTooltipContent: '',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PFolderLineNavigationItem },
    setup() {
      return { args }
    },
    template: '<PFolderLineNavigationItem v-bind="args" />',
  }),
}

export const LongName: Story = {
  args: {
    pFolderName: 'This is a really really really looooooooooooooooooooooooooooooooooooooooooooooooooooooong name',
    pTooltipContent: "Tooltip won't show",
  },
}

export const Disabled: Story = {
  args: {
    pFolderName: 'A disabled line',
    pDisabled: true,
    pTooltipContent: "You can't access this folder",
  },
}

export const Selected: Story = {
  args: {
    pSelected: true,
  },
}

export const WithoutArrow: Story = {
  args: {
    pHasArrow: false,
  },
}

export const DifferentIcon: Story = {
  args: {
    pIconLeftName: 'folderOpen',
  },
}
