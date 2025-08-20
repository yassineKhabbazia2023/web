import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PEmailInputField from './PEmailInputField.vue'

const meta: Meta<typeof PEmailInputField> = {
  title: 'Atoms/PEmailInputField',
  component: PEmailInputField,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'PEmailInputField is a component that displays an email input split into two parts, with an \'@\' symbol in the middle, allowing users to easily input and visualize email addresses.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'text',
      description: 'Binding value',
    },
    pDefaultDomainPart: {
      control: 'text',
      description: 'The default domain part when the domain part is not filled',
    },
    pLocalPartPlaceholder: {
      control: 'text',
      description: 'The placeholder text for the local part of the email',
    },
    pDomainPartPlaceholder: {
      control: 'text',
      description: 'The placeholder text for the domain part of the email',
    },
    pLocalPartDisabled: {
      control: 'boolean',
      description: 'A flag to disable the local part input field',
    },
    pDomainPartDisabled: {
      control: 'boolean',
      description: 'A flag to disable the domain part input field',
    },
  },
  args: {
    modelValue: '',
    pDefaultDomainPart: 'test.com',
    pLocalPartPlaceholder: '',
    pDomainPartPlaceholder: '',
    pLocalPartDisabled: false,
    pDomainPartDisabled: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PEmailInputField },
    setup() {
      return { args }
    },
    template: '<PEmailInputField v-bind="args" />',
  }),
}

export const WithPlaceholders: Story = {
  args: {
    pLocalPartPlaceholder: 'john.doe',
    pDomainPartPlaceholder: 'example.com',
  },
}

export const WithDefaultDomain: Story = {
  args: {
    pDefaultDomainPart: 'company.com',
    pLocalPartPlaceholder: 'username',
  },
}

export const LocalPartDisabled: Story = {
  args: {
    modelValue: 'fixed.user@domain.com',
    pLocalPartDisabled: true,
  },
}

export const DomainPartDisabled: Story = {
  args: {
    modelValue: 'user@fixed.domain.com',
    pDomainPartDisabled: true,
  },
}

export const BothPartsDisabled: Story = {
  args: {
    modelValue: 'readonly@email.com',
    pLocalPartDisabled: true,
    pDomainPartDisabled: true,
  },
}
