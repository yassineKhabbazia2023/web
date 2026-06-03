import { Meta, StoryObj } from '@storybook/vue3-vite'
import PEntityHeader from './PEntityHeader.vue'

const meta: Meta<typeof PEntityHeader> = {
  title: 'Molecules/PEntityHeader',
  component: PEntityHeader,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Composant d\'en-tête avec Account legalName, accountNumber.',
      },
    },
  },
  argTypes: {
    pAccountNumber: { control: 'text', description: 'Account number' },
    pLegalName: { control: 'text', description: 'Account legal name' },
    pSize: {
      control: 'select',
      options: ['small', 'default'],
    },
    pAccountType: {
      control: 'select',
      options: ['CLIENT', 'PROSPECT'], // Assuming these are the possible values based on the AccountType enum
      description: 'Account type (PROSPECT forces rydge monogramme icon)',
    },
  },
  args: {
    pAccountNumber: 'AccountNumber',
    pLegalName: 'LegalName',
  },
}

export default meta
export type Story = StoryObj<typeof meta>

// Basic variant
export const Basic: Story = {
  args: {
    pAccountNumber: 'EC1291233',
    pLegalName: 'legal name',
  },
}

// Prospect variant
export const Prospect: Story = {
  args: {
    pAccountNumber: 'EC1291233',
    pLegalName: 'Prospect Entity',
    pAccountType: 'PROSPECT',
  },
}
