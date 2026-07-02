import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PDropdown from './PDropdown.vue'
import type { PDropdownProps } from './PDropdownTypes'
import { getMockedDropdownOptions, getMockedDropdownOptionsWithDescription } from './PDropdown.mocks'

const meta: Meta<typeof PDropdown> = {
  title: 'Molecules/PDropdown',
  component: PDropdown,
  parameters: {
    docs: {
      description: {
        component: 'A dropdown/select component with support for single and multiple selection, filtering, grouping, and various customization options.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Selected value(s)',
    },
    pOptions: {
      control: 'object',
      description: 'Array of dropdown options',
      table: {
        type: { summary: 'PDropdownOption[]' },
      },
    },
    pPlaceholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    pDisabled: {
      control: 'boolean',
      description: 'Disable the dropdown',
    },
    pClearable: {
      control: 'boolean',
      description: 'Show clear button',
    },
    pMultiple: {
      control: 'boolean',
      description: 'Enable multiple selection',
    },
    pFilterable: {
      control: 'boolean',
      description: 'Enable option filtering',
    },
    pAllowCreate: {
      control: 'boolean',
      description: 'Allow creating new options',
    },
    pCollapseTags: {
      control: 'boolean',
      description: 'Collapse multiple selection tags',
    },
    pCollapseTagsTooltip: {
      control: 'boolean',
      description: 'Show tooltip for collapsed tags',
    },
    pHasRadioButton: {
      control: 'boolean',
      description: 'Show radio buttons for single selection',
    },
    pCheckAllLabel: {
      control: 'text',
      description: 'Label for check all option in multiple mode',
    },
  },
  args: {
    pSize: 'default',
    pDisabled: false,
    pClearable: false,
    pFilterable: false,
    pAllowCreate: false,
    pMultiple: false,
    pMultipleLimit: 0,
    pPlaceholder: 'Select',
    pDefaultFirstOption: false,
    pPopperClass: '',
    pReserveKeyword: false,
    pValueKey: '',
    pCollapseTags: false,
    pCollapseTagsTooltip: false,
    pAutomaticDropdown: true,
    pHasRadioButton: false,
    pCheckAllLabel: 'Tout sélectionner',
  },
}

export default meta
type Story = StoryObj<PDropdownProps>

const basicOptions = getMockedDropdownOptionsWithDescription()
const groupedOptions = getMockedDropdownOptions(true)

export const BasicUsage: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref('')
      return {
        args,
        value,
        basicOptions,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <PDropdown 
          v-model="value" 
          v-bind="args"
          :pOptions="basicOptions"
          style="width: 240px;"
        />
        <p style="margin-top: 16px;">Selected value: {{ value }}</p>
      </div>
    `,
  }),
}

export const WithRadioButtons: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref('')
      return {
        args: { ...args, pOptions: basicOptions, pCheckAllLabel: '' },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Dropdown with Radio Buttons</h3>
        <PDropdown 
          v-model="value" 
          v-bind="args"
          style="width: 240px;"
        />
        <p style="margin-top: 16px;">Selected value: {{ value }}</p>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Select option',
    pDisabled: false,
    pClearable: true,
    pHasRadioButton: true,
  },
}

export const MultipleSelection: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref<string[]>([])

      return {
        args: { ...args, pOptions: basicOptions },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Multiple Selection</h3>
        <PDropdown 
          v-model="value" 
          v-bind="args"
          style="width: 240px;"
        />
        <p style="margin-top: 16px;">Selected values: {{ value }}</p>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Select multiple options',
    pMultiple: true,
    pDisabled: false,
    pCollapseTags: false,
    pCollapseTagsTooltip: false,
    pCheckAllLabel: 'Select All',
  },
}

export const MultipleWithCollapsedTags: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref<string[]>(['a', 'b'])

      return {
        args: { ...args, pOptions: basicOptions },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Multiple Selection with Collapsed Tags</h3>
        <PDropdown 
          v-model="value" 
          v-bind="args"
          style="width: 240px;"
        />
        <p style="margin-top: 16px;">Selected values: {{ value }}</p>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Select multiple options',
    pMultiple: true,
    pCollapseTags: true,
    pCollapseTagsTooltip: true,
    pCheckAllLabel: 'Select All',
  },
}

export const FilterableDropdown: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref('')

      return {
        args: { ...args, pOptions: basicOptions },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Filterable Dropdown</h3>
        <PDropdown 
          v-model="value" 
          v-bind="args"
          style="width: 240px;"
        />
        <p style="margin-top: 16px;">Selected value: {{ value }}</p>
        <p><em>Type to filter options</em></p>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Type to search',
    pFilterable: true,
    pDisabled: false,
  },
}

export const AllowCreate: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref('')

      return {
        args: { ...args, pOptions: basicOptions },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Dropdown with Create Option</h3>
        <PDropdown 
          v-model="value" 
          v-bind="args"
          style="width: 240px;"
        />
        <p style="margin-top: 16px;">Selected value: {{ value }}</p>
        <p><em>Type new values to create them</em></p>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Type to search or create',
    pFilterable: true,
    pAllowCreate: true,
    pDisabled: false,
  },
}

export const GroupedOptions: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref('')

      return {
        args: { ...args, pOptions: groupedOptions },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Grouped Options</h3>
        <PDropdown 
          v-model="value" 
          v-bind="args"
          style="width: 240px;"
        />
        <p style="margin-top: 16px;">Selected value: {{ value }}</p>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Select from groups',
  },
}

export const DisabledState: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref('a')

      return {
        args: { ...args, pOptions: basicOptions },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Disabled Dropdown</h3>
        <PDropdown 
          v-model="value" 
          v-bind="args"
          style="width: 240px;"
        />
        <p style="margin-top: 16px;">Selected value: {{ value }}</p>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Disabled dropdown',
    pDisabled: true,
  },
}

export const WithClearButton: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref('a')

      return {
        args: { ...args, pOptions: basicOptions },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Clearable Dropdown</h3>
        <PDropdown 
          v-model="value" 
          v-bind="args"
          style="width: 240px;"
        />
        <p style="margin-top: 16px;">Selected value: {{ value }}</p>
        <p><em>Click the × button to clear selection</em></p>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Select option',
    pClearable: true,
  },
}

export const WithCustomEmptyState: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const value = ref('')

      return {
        args: { ...args, pOptions: [] },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Dropdown with Custom Empty State</h3>
        <PDropdown
          v-model="value"
          v-bind="args"
          style="width: 240px;"
        >
          <template #empty>
            <p style="padding: 12px; text-align: center; color: #999;">
              — No options available —
            </p>
          </template>
        </PDropdown>
        <p style="margin-top: 16px;">Selected value: {{ value }}</p>
        <p><em>Options array is empty, showing a custom message via the empty slot</em></p>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'No options to select',
  },
}
