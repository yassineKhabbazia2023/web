import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PSteps from './PSteps.vue'
import { PStepStatus } from './PSteps.enums'
import type { PStepsItem } from './PStepsTypes'

const stepStatusOptions = [
  PStepStatus.WAIT,
  PStepStatus.PROCESS,
  PStepStatus.ERROR,
  PStepStatus.SUCCESS,
]

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
      options: stepStatusOptions,
      description: 'Status of the current process step',
    },
    pFinishStatus: {
      control: { type: 'select' },
      options: stepStatusOptions,
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
    pSteps: {
      control: { type: 'object' },
      description: 'List of step items',
    },
  },
}

export default meta
type Story = StoryObj<typeof PSteps>

const defaultSteps: PStepsItem[] = [
  { pTitle: 'Step 1' },
  { pTitle: 'Step 2' },
  { pTitle: 'Step 3' },
]

export const Default: Story = {
  args: {
    pActive: 0,
    pDirection: 'horizontal',
    pProcessStatus: PStepStatus.PROCESS,
    pFinishStatus: PStepStatus.SUCCESS,
    pSteps: defaultSteps,
  },
  render: (args) => ({
    components: { PSteps },
    setup() {
      return { args }
    },
    template: '<PSteps v-bind="args" />',
  }),
}

export const Vertical: Story = {
  args: {
    pActive: 1,
    pDirection: 'vertical',
    pProcessStatus: PStepStatus.PROCESS,
    pFinishStatus: PStepStatus.SUCCESS,
    pSteps: [
      { pTitle: 'Registration' },
      { pTitle: 'Verification' },
      { pTitle: 'Complete' },
    ],
  },
  render: (args) => ({
    components: { PSteps },
    setup() {
      return { args }
    },
    template: '<PSteps v-bind="args" />',
  }),
}

export const WithError: Story = {
  args: {
    pActive: 2,
    pDirection: 'horizontal',
    pProcessStatus: PStepStatus.ERROR,
    pFinishStatus: PStepStatus.SUCCESS,
    pSteps: [
      { pTitle: 'Start' },
      { pTitle: 'Process' },
      { pTitle: 'Error Step' },
      { pTitle: 'Final' },
    ],
  },
  render: (args) => ({
    components: { PSteps },
    setup() {
      return { args }
    },
    template: '<PSteps v-bind="args" />',
  }),
}

export const Success: Story = {
  args: {
    pActive: 3,
    pDirection: 'horizontal',
    pProcessStatus: PStepStatus.SUCCESS,
    pFinishStatus: PStepStatus.SUCCESS,
    pSteps: [
      { pTitle: 'Step 1' },
      { pTitle: 'Step 2' },
      { pTitle: 'Step 3' },
      { pTitle: 'Complete' },
    ],
  },
  render: (args) => ({
    components: { PSteps },
    setup() {
      return { args }
    },
    template: '<PSteps v-bind="args" />',
  }),
}

export const Simple: Story = {
  args: {
    pActive: 1,
    pDirection: 'horizontal',
    pProcessStatus: PStepStatus.PROCESS,
    pFinishStatus: PStepStatus.SUCCESS,
    pSimple: true,
    pSteps: [
      { pTitle: 'Simple Step 1' },
      { pTitle: 'Simple Step 2' },
      { pTitle: 'Simple Step 3' },
    ],
  },
  render: (args) => ({
    components: { PSteps },
    setup() {
      return { args }
    },
    template: '<PSteps v-bind="args" />',
  }),
}
