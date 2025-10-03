import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PFileAndFolderLineCheck from './PFileAndFolderLineCheck.vue'
import type { PFileAndFolderLineCheckProps } from './PFileAndFolderLineCheckTypes'

const meta: Meta<typeof PFileAndFolderLineCheck> = {
  title: 'Molecules/PFileAndFolderLineCheck',
  component: PFileAndFolderLineCheck as any,
  parameters: {
    docs: {
      description: {
        component: 'A file and folder line check component that displays file information with various states and checkbox functionality.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'The checkbox model value',
      table: {
        type: { summary: 'boolean' },
      },
    },
    pFileName: {
      control: 'text',
      description: 'Name of the file',
      table: {
        type: { summary: 'string' },
      },
    },
    pAdditionalText: {
      control: 'text',
      description: 'Additional text to display (optional)',
      table: {
        type: { summary: 'string' },
      },
    },
    pState: {
      control: 'select',
      options: ['default', 'loading', 'error', 'success'],
      description: 'State of the file line',
      table: {
        type: { summary: "'default' | 'loading' | 'error' | 'success'" },
        defaultValue: { summary: 'default' },
      },
    },
  },
  tags: ['autodocs'],
  args: {
    pAdditionalText: '',
    pState: 'default',
    pFileName: '',
  },
}

export default meta
type Story = StoryObj<PFileAndFolderLineCheckProps>

export const Default: Story = {
  render: (args) => ({
    components: { PFileAndFolderLineCheck },
    setup() {
      const checkboxValue = ref(false)

      return {
        args,
        checkboxValue,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFileAndFolderLineCheck 
          v-model="checkboxValue"
          v-bind="args"
        />
        <div style="margin-top: 16px;">
          <strong>Checked:</strong> {{ checkboxValue }}
        </div>
      </div>
    `,
  }),
  args: {
    pFileName: 'A PDF File.pdf',
    pState: 'default',
  },
}

export const Success: Story = {
  render: (args) => ({
    components: { PFileAndFolderLineCheck },
    setup() {
      const checkboxValue = ref(false)

      return {
        args: { ...args },
        checkboxValue,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFileAndFolderLineCheck 
          v-model="checkboxValue"
          v-bind="args"
        />
      </div>
    `,
  }),
  args: {
    pFileName: 'A success state.pdf',
    pState: 'success',
    pAdditionalText: 'Accountancy > Deposit > Purchases',
  },
}

export const Error: Story = {
  render: (args) => ({
    components: { PFileAndFolderLineCheck },
    setup() {
      const checkboxValue = ref(false)

      return {
        args: { ...args },
        checkboxValue,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFileAndFolderLineCheck 
          v-model="checkboxValue"
          v-bind="args"
        />
      </div>
    `,
  }),
  args: {
    pFileName: 'An error state.pdf',
    pState: 'error',
    pAdditionalText: 'Unallowed file extension',
  },
}

export const Loading: Story = {
  render: (args) => ({
    components: { PFileAndFolderLineCheck },
    setup() {
      const checkboxValue = ref(false)

      return {
        args: { ...args },
        checkboxValue,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFileAndFolderLineCheck 
          v-model="checkboxValue"
          v-bind="args"
        />
      </div>
    `,
  }),
  args: {
    pFileName: 'Another type of file.txt',
    pState: 'loading',
  },
}

export const AllStates: Story = {
  render: () => ({
    components: { PFileAndFolderLineCheck },
    setup() {
      const defaultValue = ref(false)
      const successValue = ref(true)
      const errorValue = ref(false)
      const loadingValue = ref(true)

      return {
        defaultValue,
        successValue,
        errorValue,
        loadingValue,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>All File Line Check States</h3>
        <div style="display: grid; gap: 16px;">
          <div>
            <h4>Default State</h4>
            <PFileAndFolderLineCheck 
              v-model="defaultValue"
              pFileName="A PDF File.pdf"
              pState="default"
            />
          </div>
          
          <div>
            <h4>Success State</h4>
            <PFileAndFolderLineCheck 
              v-model="successValue"
              pFileName="A success state.pdf"
              pState="success"
              pAdditionalText="Accountancy > Deposit > Purchases"
            />
          </div>
          
          <div>
            <h4>Error State</h4>
            <PFileAndFolderLineCheck 
              v-model="errorValue"
              pFileName="An error state.pdf"
              pState="error"
              pAdditionalText="Unallowed file extension"
            />
          </div>
          
          <div>
            <h4>Loading State</h4>
            <PFileAndFolderLineCheck 
              v-model="loadingValue"
              pFileName="Another type of file.txt"
              pState="loading"
            />
          </div>
        </div>
      </div>
    `,
  }),
}
