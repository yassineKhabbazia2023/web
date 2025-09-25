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
      table: {
        type: { summary: 'any' },
      },
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
      table: {
        type: { summary: 'string' },
      },
    },
    pDisabled: {
      control: 'boolean',
      description: 'Disable the dropdown',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pClearable: {
      control: 'boolean',
      description: 'Show clear button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pMultiple: {
      control: 'boolean',
      description: 'Enable multiple selection',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pFilterable: {
      control: 'boolean',
      description: 'Enable option filtering',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pAllowCreate: {
      control: 'boolean',
      description: 'Allow creating new options',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pCollapseTags: {
      control: 'boolean',
      description: 'Collapse multiple selection tags',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pCollapseTagsTooltip: {
      control: 'boolean',
      description: 'Show tooltip for collapsed tags',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pHasRadioButton: {
      control: 'boolean',
      description: 'Show radio buttons for single selection',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pCheckAllLabel: {
      control: 'text',
      description: 'Label for check all option in multiple mode',
      table: {
        type: { summary: 'string' },
      },
    },
    pSize: {
      control: 'select',
      options: ['', 'large', 'default', 'small'],
      description: 'Size of the dropdown',
      table: {
        type: { summary: "'large' | 'default' | 'small'" },
      },
    },
  },
  tags: ['autodocs'],
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
        args: { ...args, pOptions: basicOptions },
        value,
      }
    },
    template: `
      <div style="padding: 20px; height: 300px;">
        <h3>Basic Dropdown</h3>
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
    pClearable: false,
    pHasRadioButton: false,
  },
}

export const WithRadioButtons: Story = {
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

export const DifferentSizes: Story = {
  render: (args) => ({
    components: { PDropdown },
    setup() {
      const valueLarge = ref('')
      const valueDefault = ref('')
      const valueSmall = ref('')

      return {
        args: { ...args, pOptions: basicOptions },
        valueLarge,
        valueDefault,
        valueSmall,
      }
    },
    template: `
      <div style="padding: 20px; height: 400px;">
        <div style="margin-bottom: 20px;">
          <h4>Large Size</h4>
          <PDropdown 
            v-model="valueLarge" 
            v-bind="args"
            pSize="large"
            pPlaceholder="Large dropdown"
            style="width: 240px;"
          />
        </div>
        <div style="margin-bottom: 20px;">
          <h4>Default Size</h4>
          <PDropdown 
            v-model="valueDefault" 
            v-bind="args"
            pSize="default"
            pPlaceholder="Default dropdown"
            style="width: 240px;"
          />
        </div>
        <div style="margin-bottom: 20px;">
          <h4>Small Size</h4>
          <PDropdown 
            v-model="valueSmall" 
            v-bind="args"
            pSize="small"
            pPlaceholder="Small dropdown"
            style="width: 240px;"
          />
        </div>
      </div>
    `,
  }),
  args: {},
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
