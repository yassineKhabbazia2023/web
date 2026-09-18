import { ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PSegmentedControl from './PSegmentedControl.vue'
import type { PSegmentedControlOption } from './PSegmentedControlTypes'

const meta: Meta<typeof PSegmentedControl> = {
  title: 'Molecules/SegmentedControl',
  component: PSegmentedControl,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'An exclusive choice among a few options, all of them visible at once. '
          + 'Unlike PFilterGroup, the selection is mandatory: clicking the selected option '
          + 'keeps it, so a caller always has a value to render. Reach for PDropdown past a '
          + 'handful of options, and for PFilterGroup when several can be picked together.',
      },
    },
  },
  argTypes: {
    pOptions: { description: 'Every choice offered, in the order they read' },
    pDisabled: {
      control: { type: 'boolean' },
      description: 'Displayed, but none of the options is pickable',
    },
    pSize: {
      control: { type: 'select' },
      options: ['default', 'small'],
      description: 'Size of every option, as PButton reads it',
    },
    pAriaLabel: {
      control: { type: 'text' },
      description: 'Names the group when no visible caption labels it',
    },
    pTestId: {
      control: { type: 'text' },
      description: 'Stem of the `data-testid` of every option, suffixed by its own value',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const EXERCISES: PSegmentedControlOption[] = [
  { pValue: 'N-1', pLabel: 'N-1 (12/2024)' },
  { pValue: 'N-2', pLabel: 'N-2 (12/2023)' },
]

const UNITS: PSegmentedControlOption[] = [
  { pValue: false, pLabel: '€' },
  { pValue: true, pLabel: 'k€' },
]

export const Default: Story = {
  args: {
    pOptions: EXERCISES,
    pAriaLabel: 'Exercice de comparaison',
    pTestId: 'comparison',
  },
  render: (args) => ({
    components: { PSegmentedControl },
    setup: () => ({ args, selected: ref('N-1') }),
    template: '<PSegmentedControl v-bind="args" v-model="selected" />',
  }),
}

/**
 * The choice exists and cannot be made: the control stays on display rather
 * than vanishing, so the reader knows it is there.
 */
export const Disabled: Story = {
  args: {
    pOptions: [EXERCISES[0]],
    pDisabled: true,
    pAriaLabel: 'Exercice de comparaison',
  },
  render: (args) => ({
    components: { PSegmentedControl },
    setup: () => ({ args, selected: ref('N-1') }),
    template: '<PSegmentedControl v-bind="args" v-model="selected" />',
  }),
}

/** A value is not always a string: booleans and numbers read the same way. */
export const BooleanValues: Story = {
  args: {
    pOptions: UNITS,
    pSize: 'small',
    pAriaLabel: 'Unité d\'affichage',
  },
  render: (args) => ({
    components: { PSegmentedControl },
    setup: () => ({ args, selected: ref(false) }),
    template: `
      <div>
        <PSegmentedControl v-bind="args" v-model="selected" />
        <p class="margin-top--2">modelValue = {{ selected }}</p>
      </div>
    `,
  }),
}

/**
 * What the control is for: clicking the option already selected leaves the
 * model untouched, where a filter group would empty it.
 */
export const NeverEmptied: Story = {
  args: {
    pOptions: EXERCISES,
    pAriaLabel: 'Exercice de comparaison',
  },
  render: (args) => ({
    components: { PSegmentedControl },
    setup: () => ({ args, selected: ref('N-1') }),
    template: `
      <div>
        <PSegmentedControl v-bind="args" v-model="selected" />
        <p class="margin-top--2">
          Click the selected option: modelValue stays {{ selected }}
        </p>
      </div>
    `,
  }),
}
