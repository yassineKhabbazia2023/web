import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PPagination from './PPagination.vue'
import { ref } from 'vue'

const meta: Meta<typeof PPagination> = {
  title: 'Atoms/PPagination',
  component: PPagination,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A pagination component based on Element Plus with extended options.',
      },
    },
  },
  argTypes: {
    pCurrentPage: {
      control: 'number',
      description: 'Current page number (v-model)',
    },
    pPageSize: {
      control: 'number',
      description: 'Items per page (v-model)',
    },
    pPageSizes: {
      control: 'object',
      description: 'Array of page size options',
    },
    pPageSizeSelectorGroupLabel: {
      control: 'text',
      description: 'Label for page size selector',
    },
    pPageSizeSelectorSuffix: {
      control: 'text',
      description: 'Suffix for page size selector',
    },
    pShowTotalPageCounter: {
      control: 'boolean',
      description: 'Whether to show total page counter',
    },
    pHidePageSize: {
      control: 'boolean',
      description: 'Whether to hide page size selector',
    },
    pTotal: {
      control: 'number',
      description: 'Total number of items',
    },
  },
  args: {
    pCurrentPage: 1,
    pPageSize: 100,
    pPageSizes: [100, 200, 300, 400],
    pPageSizeSelectorGroupLabel: 'Some text',
    pPageSizeSelectorSuffix: 'documents',
    pShowTotalPageCounter: true,
    pHidePageSize: false,
    pTotal: 2000000,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PPagination },
    setup() {
      const currentPage = ref(args.pCurrentPage)
      const pageSize = ref(args.pPageSize)
      return { ...args, currentPage, pageSize }
    },
    template: `
      <PPagination
        v-model:pCurrentPage="currentPage"
        v-model:pPageSize="pageSize"
        :pPageSizes="pPageSizes"
        :pPageSizeSelectorGroupLabel="pPageSizeSelectorGroupLabel"
        :pPageSizeSelectorSuffix="pPageSizeSelectorSuffix"
        :pShowTotalPageCounter="pShowTotalPageCounter"
        :pHidePageSize="pHidePageSize"
        :pTotal="pTotal"
      >
        <p>1-25 sur 157</p>
      </PPagination>
    `,
  }),
}

export const WithoutPageSizeSelector: Story = {
  args: {
    pHidePageSize: true,
  },
  render: (args) => ({
    components: { PPagination },
    setup() {
      const currentPage = ref(args.pCurrentPage)
      const pageSize = ref(args.pPageSize)
      return { ...args, currentPage, pageSize }
    },
    template: `
      <PPagination
        v-model:pCurrentPage="currentPage"
        v-model:pPageSize="pageSize"
        :pPageSizes="pPageSizes"
        :pPageSizeSelectorGroupLabel="pPageSizeSelectorGroupLabel"
        :pPageSizeSelectorSuffix="pPageSizeSelectorSuffix"
        :pShowTotalPageCounter="pShowTotalPageCounter"
        :pHidePageSize="pHidePageSize"
        :pTotal="pTotal"
      >
        <p>Items 1-100</p>
      </PPagination>
    `,
  }),
}

export const WithoutTotalPageCounter: Story = {
  args: {
    pShowTotalPageCounter: false,
  },
  render: (args) => ({
    components: { PPagination },
    setup() {
      const currentPage = ref(args.pCurrentPage)
      const pageSize = ref(args.pPageSize)
      return { ...args, currentPage, pageSize }
    },
    template: `
      <PPagination
        v-model:pCurrentPage="currentPage"
        v-model:pPageSize="pageSize"
        :pPageSizes="pPageSizes"
        :pPageSizeSelectorGroupLabel="pPageSizeSelectorGroupLabel"
        :pPageSizeSelectorSuffix="pPageSizeSelectorSuffix"
        :pShowTotalPageCounter="pShowTotalPageCounter"
        :pHidePageSize="pHidePageSize"
        :pTotal="pTotal"
      />
    `,
  }),
}

export const SmallDataset: Story = {
  args: {
    pTotal: 50,
    pPageSizes: [10, 20, 30, 50],
    pPageSize: 10,
  },
  render: (args) => ({
    components: { PPagination },
    setup() {
      const currentPage = ref(args.pCurrentPage)
      const pageSize = ref(args.pPageSize)
      return { ...args, currentPage, pageSize }
    },
    template: `
      <PPagination
        v-model:pCurrentPage="currentPage"
        v-model:pPageSize="pageSize"
        :pPageSizes="pPageSizes"
        :pPageSizeSelectorGroupLabel="pPageSizeSelectorGroupLabel"
        :pPageSizeSelectorSuffix="pPageSizeSelectorSuffix"
        :pShowTotalPageCounter="pShowTotalPageCounter"
        :pHidePageSize="pHidePageSize"
        :pTotal="pTotal"
      >
        <p>Showing items</p>
      </PPagination>
    `,
  }),
}

export const CustomLabels: Story = {
  args: {
    pPageSizeSelectorGroupLabel: 'Display',
    pPageSizeSelectorSuffix: 'items',
    pPageSizes: [25, 50, 100, 200],
    pPageSize: 25,
    pTotal: 1000,
  },
  render: (args) => ({
    components: { PPagination },
    setup() {
      const currentPage = ref(args.pCurrentPage)
      const pageSize = ref(args.pPageSize)
      return { ...args, currentPage, pageSize }
    },
    template: `
      <PPagination
        v-model:pCurrentPage="currentPage"
        v-model:pPageSize="pageSize"
        :pPageSizes="pPageSizes"
        :pPageSizeSelectorGroupLabel="pPageSizeSelectorGroupLabel"
        :pPageSizeSelectorSuffix="pPageSizeSelectorSuffix"
        :pShowTotalPageCounter="pShowTotalPageCounter"
        :pHidePageSize="pHidePageSize"
        :pTotal="pTotal"
      >
        <p>Results</p>
      </PPagination>
    `,
  }),
}
