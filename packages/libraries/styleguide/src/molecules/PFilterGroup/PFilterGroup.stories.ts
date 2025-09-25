import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PFilterGroup from './PFilterGroup.vue'
import type { FilterOption, PFilterGroupProps } from './PFilterGroupTypes'

const meta: Meta<typeof PFilterGroup> = {
  title: 'Molecules/PFilterGroup',
  component: PFilterGroup as any,
  parameters: {
    docs: {
      description: {
        component: 'A filter group component that displays a collection of filter options with selection capabilities.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'object',
      description: 'Array of selected filter codes',
      table: {
        type: { summary: 'T[]' },
      },
    },
    pFilters: {
      control: 'object',
      description: 'Array of filter options',
      table: {
        type: { summary: 'FilterOption<T>[]' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PFilterGroupProps<any>>

const defaultFilters: FilterOption[] = [
  {
    pIconName: 'checkCircle',
    pValue: '2',
    pContent: 'Incident',
    pColor: 'danger',
    pCode: 'incident',
  },
  {
    pIconName: 'checkCircle',
    pValue: '4',
    pContent: 'Deploiment',
    pColor: 'warning',
    pCode: 'deploiment',
  },
  {
    pIconName: 'checkCircle',
    pContent: 'Actif',
    pColor: 'success',
    pCode: 'actif',
  },
  {
    pIconName: 'checkCircle',
    pValue: 2,
    pContent: 'En cours',
    pColor: 'fuschia',
    pCode: 'en-cours',
  },
  {
    pIconName: 'xCircle',
    pValue: '9',
    pContent: 'Résilié',
    pColor: 'gray-900',
    pCode: 'resilie',
  },
]

const numberFilters: FilterOption<number>[] = [
  {
    pIconName: 'checkCircle',
    pValue: '2',
    pContent: 'Incident',
    pColor: 'danger',
    pCode: 1,
  },
  {
    pIconName: 'checkCircle',
    pValue: '4',
    pContent: 'Deploiment',
    pColor: 'warning',
    pCode: 2,
  },
  {
    pIconName: 'checkCircle',
    pValue: '24',
    pContent: 'Actif',
    pColor: 'success',
    pCode: 3,
  },
  {
    pIconName: 'checkCircle',
    pValue: 2,
    pContent: 'En cours',
    pColor: 'fuschia',
    pCode: 4,
  },
  {
    pIconName: 'xCircle',
    pValue: '9',
    pContent: 'Résilié',
    pColor: 'gray-900',
    pCode: 5,
  },
]

export const Default: Story = {
  render: (args) => ({
    components: { PFilterGroup },
    setup() {
      const selectedCodes = ref<string[]>([])

      const handleUpdate = (value: string[]) => {
        console.log('Selected filters:', value)
      }

      return {
        args: { ...args, pFilters: defaultFilters },
        selectedCodes,
        handleUpdate,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFilterGroup 
          v-model="selectedCodes"
          v-bind="args"
          @update:model-value="handleUpdate"
        />
        <div style="margin-top: 16px;">
          <strong>Selected:</strong> {{ selectedCodes }}
        </div>
      </div>
    `,
  }),
  args: {
    pFilters: defaultFilters,
  },
}

export const WithNumberCodes: Story = {
  render: (args) => ({
    components: { PFilterGroup },
    setup() {
      const selectedIds = ref<number[]>([])

      const handleUpdate = (value: number[]) => {
        console.log('Selected filter IDs:', value)
      }

      return {
        args: { ...args, pFilters: numberFilters },
        selectedIds,
        handleUpdate,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFilterGroup 
          v-model="selectedIds"
          v-bind="args"
          @update:model-value="handleUpdate"
        />
        <div style="margin-top: 16px;">
          <strong>Selected IDs:</strong> {{ selectedIds }}
        </div>
      </div>
    `,
  }),
  args: {
    pFilters: numberFilters,
  },
}

export const PreSelected: Story = {
  render: (args) => ({
    components: { PFilterGroup },
    setup() {
      const selectedCodes = ref<string[]>(['incident', 'actif'])

      const handleUpdate = (value: string[]) => {
        console.log('Selected filters:', value)
      }

      return {
        args: { ...args, pFilters: defaultFilters },
        selectedCodes,
        handleUpdate,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Pre-selected Filters</h3>
        <PFilterGroup 
          v-model="selectedCodes"
          v-bind="args"
          @update:model-value="handleUpdate"
        />
        <div style="margin-top: 16px;">
          <strong>Selected:</strong> {{ selectedCodes }}
        </div>
      </div>
    `,
  }),
  args: {
    pFilters: defaultFilters,
  },
}

export const StatusFilters: Story = {
  render: () => ({
    components: { PFilterGroup },
    setup() {
      const selectedStatuses = ref<string[]>([])

      const statusFilters: FilterOption[] = [
        {
          pIconName: 'checkCircle',
          pContent: 'Active',
          pColor: 'success',
          pCode: 'active',
        },
        {
          pIconName: 'clock',
          pContent: 'Pending',
          pColor: 'warning',
          pCode: 'pending',
        },
        {
          pIconName: 'xCircle',
          pContent: 'Inactive',
          pColor: 'danger',
          pCode: 'inactive',
        },
        {
          pIconName: 'xCircle',
          pContent: 'Suspended',
          pColor: 'gray-500',
          pCode: 'suspended',
        },
      ]

      const handleUpdate = (value: string[]) => {
        console.log('Selected statuses:', value)
      }

      return {
        selectedStatuses,
        statusFilters,
        handleUpdate,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Status Filters</h3>
        <PFilterGroup 
          v-model="selectedStatuses"
          :pFilters="statusFilters"
          @update:model-value="handleUpdate"
        />
        <div style="margin-top: 16px;">
          <strong>Selected statuses:</strong> {{ selectedStatuses }}
        </div>
      </div>
    `,
  }),
  args: {},
}

export const CategoryFilters: Story = {
  render: () => ({
    components: { PFilterGroup },
    setup() {
      const selectedCategories = ref<string[]>([])

      const categoryFilters: FilterOption[] = [
        {
          pIconName: 'fileText',
          pContent: 'Documents',
          pColor: 'amethyste',
          pCode: 'documents',
        },
        {
          pIconName: 'folder',
          pContent: 'Projects',
          pColor: 'success',
          pCode: 'projects',
        },
        {
          pIconName: 'person',
          pContent: 'Users',
          pColor: 'fuschia',
          pCode: 'users',
        },
        {
          pIconName: 'gear',
          pContent: 'Settings',
          pColor: 'gray-500',
          pCode: 'settings',
        },
        {
          pIconName: 'shield',
          pContent: 'Security',
          pColor: 'danger',
          pCode: 'security',
        },
      ]

      const handleUpdate = (value: string[]) => {
        console.log('Selected categories:', value)
      }

      return {
        selectedCategories,
        categoryFilters,
        handleUpdate,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Category Filters</h3>
        <PFilterGroup 
          v-model="selectedCategories"
          :pFilters="categoryFilters"
          @update:model-value="handleUpdate"
        />
        <div style="margin-top: 16px;">
          <strong>Selected categories:</strong> {{ selectedCategories }}
        </div>
      </div>
    `,
  }),
  args: {},
}

export const AllVariants: Story = {
  render: () => ({
    components: { PFilterGroup },
    setup() {
      const stringSelected = ref<string[]>(['incident'])
      const numberSelected = ref<number[]>([1, 3])

      return {
        stringSelected,
        numberSelected,
        defaultFilters,
        numberFilters,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Filter Group Variants</h3>
        
        <div style="margin-bottom: 32px;">
          <h4>String-based Filters</h4>
          <PFilterGroup 
            v-model="stringSelected"
            :pFilters="defaultFilters"
          />
          <p style="margin-top: 8px;"><strong>Selected:</strong> {{ stringSelected }}</p>
        </div>
        
        <div>
          <h4>Number-based Filters</h4>
          <PFilterGroup 
            v-model="numberSelected"
            :pFilters="numberFilters"
          />
          <p style="margin-top: 8px;"><strong>Selected IDs:</strong> {{ numberSelected }}</p>
        </div>
      </div>
    `,
  }),
  args: {},
}
