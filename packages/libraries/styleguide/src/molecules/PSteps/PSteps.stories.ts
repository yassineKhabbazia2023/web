import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PSteps from './PSteps.vue'
import PStep from '../../atoms/PStep'

const meta: Meta<typeof PSteps> = {
  title: 'Molecules/Steps',
  component: PSteps,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Steps component for displaying step-by-step processes with customizable direction, status, and styling.',
      },
    },
  },
  argTypes: {
    pSpace: {
      control: { type: 'number' },
      description: 'Space between steps',
    },
    pDirection: {
      control: { type: 'select' },
      options: ['vertical', 'horizontal'],
      description: 'Direction of the steps',
    },
    pActive: {
      control: { type: 'number', min: 0 },
      description: 'Active step index',
    },
    pProcessStatus: {
      control: { type: 'select' },
      options: ['wait', 'process', 'finish', 'error', 'success'],
      description: 'Status of the current process step',
    },
    pFinishStatus: {
      control: { type: 'select' },
      options: ['wait', 'process', 'finish', 'error', 'success'],
      description: 'Status of finished steps',
    },
    pAlignCenter: {
      control: { type: 'boolean' },
      description: 'Center align the steps',
    },
    pSimple: {
      control: { type: 'boolean' },
      description: 'Use simple style',
    },
  },
}

export default meta
type Story = StoryObj<typeof PSteps>

export const Default: Story = {
  args: {
    pActive: 0,
    pDirection: 'horizontal',
    pProcessStatus: 'process',
    pFinishStatus: 'finish',
  },
  render: (args) => ({
    components: { PSteps, PStep },
    setup() {
      return { args }
    },
    template: `
      <PSteps v-bind="args">
        <PStep pTitle="Step 1" />
        <PStep pTitle="Step 2" />
        <PStep pTitle="Step 3" />
      </PSteps>
    `,
  }),
}

export const Vertical: Story = {
  args: {
    pActive: 1,
    pDirection: 'vertical',
    pProcessStatus: 'process',
    pFinishStatus: 'finish',
  },
  render: (args) => ({
    components: { PSteps, PStep },
    setup() {
      return { args }
    },
    template: `
      <PSteps v-bind="args">
        <PStep pTitle="Registration" />
        <PStep pTitle="Verification" />
        <PStep pTitle="Complete" />
      </PSteps>
    `,
  }),
}

export const WithError: Story = {
  args: {
    pActive: 2,
    pDirection: 'horizontal',
    pProcessStatus: 'error',
    pFinishStatus: 'finish',
  },
  render: (args) => ({
    components: { PSteps, PStep },
    setup() {
      return { args }
    },
    template: `
      <PSteps v-bind="args">
        <PStep pTitle="Start" />
        <PStep pTitle="Process" />
        <PStep pTitle="Error Step" />
        <PStep pTitle="Final" />
      </PSteps>
    `,
  }),
}

export const Success: Story = {
  args: {
    pActive: 3,
    pDirection: 'horizontal',
    pProcessStatus: 'success',
    pFinishStatus: 'success',
  },
  render: (args) => ({
    components: { PSteps, PStep },
    setup() {
      return { args }
    },
    template: `
      <PSteps v-bind="args">
        <PStep pTitle="Step 1" />
        <PStep pTitle="Step 2" />
        <PStep pTitle="Step 3" />
        <PStep pTitle="Complete" />
      </PSteps>
    `,
  }),
}

export const Simple: Story = {
  args: {
    pActive: 1,
    pDirection: 'horizontal',
    pProcessStatus: 'process',
    pFinishStatus: 'finish',
    pSimple: true,
  },
  render: (args) => ({
    components: { PSteps, PStep },
    setup() {
      return { args }
    },
    template: `
      <PSteps v-bind="args">
        <PStep pTitle="Simple Step 1" />
        <PStep pTitle="Simple Step 2" />
        <PStep pTitle="Simple Step 3" />
      </PSteps>
    `,
  }),
}
