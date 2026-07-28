import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PActiveFiltersBar from './PActiveFiltersBar.vue'
import type { ActiveFilterItem, PActiveFiltersBarProps } from './PActiveFiltersBarTypes'

const meta: Meta<typeof PActiveFiltersBar> = {
  title: 'Molecules/PActiveFiltersBar',
  component: PActiveFiltersBar,
  parameters: {
    docs: {
      description: {
        component:
          'Displays the currently applied filters as closable chips (PFilterOption). Past pMaxVisible (default 4), the remaining filters are collapsed into a single non-closable "+N" chip.',
      },
    },
  },
  argTypes: {
    pFilters: { control: 'object', description: 'Array of applied filters' },
    pMaxVisible: { control: 'number', description: 'Maximum number of chips displayed before collapsing into "+N"' },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PActiveFiltersBarProps>

const fewFilters: ActiveFilterItem[] = [
  { pCode: 'favorites', pContent: 'Favoris', pColor: 'default' },
  { pCode: 'customer-relation', pContent: 'Relation client', pColor: 'default' },
]

const manyFilters: ActiveFilterItem[] = Array.from({ length: 9 }, (_, index) => ({
  pCode: `filter-${index}`,
  pContent: `Filtre ${index + 1}`,
  pColor: 'default',
}))

export const Default: Story = {
  render: (args) => ({
    components: { PActiveFiltersBar },
    setup: () => ({ args }),
    template: '<PActiveFiltersBar v-bind="args" />',
  }),
  args: {
    pFilters: fewFilters,
  },
}

export const WithOverflow: Story = {
  render: (args) => ({
    components: { PActiveFiltersBar },
    setup: () => ({ args }),
    template: '<PActiveFiltersBar v-bind="args" />',
  }),
  args: {
    pFilters: manyFilters,
  },
}

export const Interactive: Story = {
  render: (args) => ({
    components: { PActiveFiltersBar },
    setup: () => {
      const filters = ref<ActiveFilterItem[]>([...manyFilters])
      const onRemove = (code: string) => {
        filters.value = filters.value.filter(filter => filter.pCode !== code)
      }
      return { args, filters, onRemove }
    },
    template: '<PActiveFiltersBar v-bind="args" :pFilters="filters" @remove="onRemove" />',
  }),
  args: {},
}
