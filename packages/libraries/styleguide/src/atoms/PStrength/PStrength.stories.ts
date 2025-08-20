import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PStrength from './PStrength.vue'
import { PStrengthLevel } from './PStrength.types'
import { strengthLabelsMock } from './PStrength.mocks'

const meta: Meta<typeof PStrength> = {
  title: 'Atoms/PStrength',
  component: PStrength,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A strength indicator component for displaying password strength or similar metrics.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'select',
      options: [0, 1, 2, 3, 4],
      description: 'The strength level value',
      mapping: {
        0: PStrengthLevel.EMPTY,
        1: PStrengthLevel.WEAK,
        2: PStrengthLevel.POOR,
        3: PStrengthLevel.MEDIUM,
        4: PStrengthLevel.STRONG,
      },
    },
    labels: {
      control: 'object',
      description: 'Labels for each strength level',
    },
  },
  args: {
    modelValue: PStrengthLevel.POOR,
    labels: strengthLabelsMock,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PStrength },
    setup() {
      return { args }
    },
    template: '<PStrength v-bind="args" />',
  }),
}

export const Empty: Story = {
  args: {
    modelValue: PStrengthLevel.EMPTY,
  },
}

export const Weak: Story = {
  args: {
    modelValue: PStrengthLevel.WEAK,
  },
}

export const Poor: Story = {
  args: {
    modelValue: PStrengthLevel.POOR,
  },
}

export const Medium: Story = {
  args: {
    modelValue: PStrengthLevel.MEDIUM,
  },
}

export const Strong: Story = {
  args: {
    modelValue: PStrengthLevel.STRONG,
  },
}

export const CustomLabels: Story = {
  args: {
    modelValue: PStrengthLevel.MEDIUM,
    labels: {
      0: '',
      1: 'Very Weak',
      2: 'Weak',
      3: 'Good',
      4: 'Excellent',
    },
  },
}

export const AllLevels: Story = {
  render: () => ({
    components: { PStrength },
    setup() {
      return {
        strengthLabelsMock,
        levels: [
          PStrengthLevel.EMPTY,
          PStrengthLevel.WEAK,
          PStrengthLevel.POOR,
          PStrengthLevel.MEDIUM,
          PStrengthLevel.STRONG,
        ],
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div v-for="level in levels" :key="level" style="display: flex; align-items: center; gap: 16px;">
          <span style="width: 100px;">Level {{ level }}:</span>
          <PStrength :modelValue="level" :labels="strengthLabelsMock" />
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
}
