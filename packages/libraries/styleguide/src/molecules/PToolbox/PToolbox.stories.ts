import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PToolbox from './PToolbox.vue'
import PButton from '../../atoms/PButton'
import type { PToolboxItemProps } from '../../atoms/PToolboxItem/PToolboxItemTypes'

const meta: Meta<typeof PToolbox> = {
  title: 'Molecules/Toolbox',
  component: PToolbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Toolbox component for displaying contextual actions in a dropdown menu, triggered by hovering over the trigger element.',
      },
    },
  },
  argTypes: {
    pElements: {
      control: { type: 'object' },
      description: 'Array of toolbox items to display',
    },
    pPlacement: {
      control: { type: 'select' },
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'],
      description: 'Placement of the toolbox dropdown',
    },
    pElementsTestId: {
      control: { type: 'text' },
      description: 'Test ID for the toolbox elements',
    },
    pPopperClass: {
      control: { type: 'text' },
      description: 'Custom class for the popper container',
    },
    pCoordinates: {
      control: { type: 'object' },
      description: 'Custom coordinates for positioning',
    },
  },
}

export default meta
type Story = StoryObj<typeof PToolbox>

const basicToolboxData: PToolboxItemProps[] = [
  {
    pIconName: 'trash',
    pValue: 'Delete',
    pActionName: 'delete',
    pState: 'default',
    pContentTooltip: 'Delete this item',
  },
  {
    pIconName: 'add',
    pValue: 'Add',
    pActionName: 'add',
    pState: 'default',
  },
  {
    pIconName: 'vectorPen',
    pValue: 'Rename',
    pActionName: 'rename',
    pState: 'default',
  },
  {
    pIconName: 'send',
    pValue: 'Transmit',
    pActionName: 'transmit',
    pState: 'danger',
  },
]

export const Default: Story = {
  args: {
    pElements: basicToolboxData,
    pPlacement: 'bottom',
  },
  render: (args) => ({
    components: { PToolbox, PButton },
    setup() {
      return { args }
    },
    template: `
      <PToolbox v-bind="args">
        <PButton>Hover for Toolbox</PButton>
      </PToolbox>
    `,
  }),
}

export const WithCustomTooltips: Story = {
  args: {
    pElements: [
      {
        pIconName: 'trash',
        pValue: 'Delete',
        pActionName: 'delete',
        pState: 'danger',
        pContentTooltip: 'Permanently delete this item',
      },
      {
        pIconName: 'vectorPen',
        pValue: 'Edit',
        pActionName: 'edit',
        pState: 'default',
        pContentTooltip: 'Edit item properties',
      },
      {
        pIconName: 'plusCustom',
        pValue: 'Duplicate',
        pActionName: 'duplicate',
        pState: 'default',
        pContentTooltip: 'Create a copy of this item',
      },
    ],
    pPlacement: 'bottom',
  },
  render: (args) => ({
    components: { PToolbox, PButton },
    setup() {
      return { args }
    },
    template: `
      <PToolbox v-bind="args">
        <PButton>Hover for Actions with Tooltips</PButton>
      </PToolbox>
    `,
  }),
}

export const TopPlacement: Story = {
  args: {
    pElements: basicToolboxData,
    pPlacement: 'top',
  },
  render: (args) => ({
    components: { PToolbox, PButton },
    setup() {
      return { args }
    },
    template: `
      <div style="margin-top: 150px;">
        <PToolbox v-bind="args">
          <PButton>Hover for Top Toolbox</PButton>
        </PToolbox>
      </div>
    `,
  }),
}

export const DangerousActions: Story = {
  args: {
    pElements: [
      {
        pIconName: 'trash',
        pValue: 'Delete',
        pActionName: 'delete',
        pState: 'danger',
      },
      {
        pIconName: 'x',
        pValue: 'Cancel',
        pActionName: 'cancel',
        pState: 'danger',
      },
      {
        pIconName: 'exclamationTriangle',
        pValue: 'Reset',
        pActionName: 'reset',
        pState: 'danger',
      },
    ],
    pPlacement: 'bottom',
  },
  render: (args) => ({
    components: { PToolbox, PButton },
    setup() {
      return { args }
    },
    template: `
      <PToolbox v-bind="args">
        <PButton>Dangerous Actions</PButton>
      </PToolbox>
    `,
  }),
}

export const DisabledItems: Story = {
  args: {
    pElements: [
      {
        pIconName: 'trash',
        pValue: 'Delete',
        pActionName: 'delete',
        pState: 'default',
        disabled: true,
      },
      {
        pIconName: 'vectorPen',
        pValue: 'Edit',
        pActionName: 'edit',
        pState: 'default',
      },
      {
        pIconName: 'plusCustom',
        pValue: 'Copy',
        pActionName: 'copy',
        pState: 'default',
        disabled: true,
      },
    ],
    pPlacement: 'bottom',
  },
  render: (args) => ({
    components: { PToolbox, PButton },
    setup() {
      return { args }
    },
    template: `
      <PToolbox v-bind="args">
        <PButton>Some Disabled Actions</PButton>
      </PToolbox>
    `,
  }),
}

export const FileOperations: Story = {
  args: {
    pElements: [
      {
        pIconName: 'download',
        pValue: 'Download',
        pActionName: 'download',
        pState: 'default',
      },
      {
        pIconName: 'upload',
        pValue: 'Upload',
        pActionName: 'upload',
        pState: 'default',
      },
      {
        pIconName: 'send',
        pValue: 'Share',
        pActionName: 'share',
        pState: 'default',
      },
      {
        pIconName: 'vectorPen',
        pValue: 'Rename',
        pActionName: 'rename',
        pState: 'default',
      },
      {
        pIconName: 'trash',
        pValue: 'Delete',
        pActionName: 'delete',
        pState: 'danger',
      },
    ],
    pPlacement: 'bottom-start',
  },
  render: (args) => ({
    components: { PToolbox, PButton },
    setup() {
      return { args }
    },
    template: `
      <PToolbox v-bind="args">
        <PButton>File Operations</PButton>
      </PToolbox>
    `,
  }),
}

export const WithCustomButton: Story = {
  args: {
    pElements: basicToolboxData,
    pPlacement: 'bottom',
  },
  render: (args) => ({
    components: { PToolbox, PButton },
    setup() {
      return { args }
    },
    template: `
      <PToolbox v-bind="args">
        <PButton pVariant="outline" pIconOnly>
          <i class="fa fa-ellipsis-v"></i>
        </PButton>
      </PToolbox>
    `,
  }),
}
