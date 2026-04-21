import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PDrawerActions from './PDrawerActions.vue'
import type { PDrawerActionButton } from './PDrawerActionsTypes'

const meta: Meta<typeof PDrawerActions> = {
  title: 'Molecules/PDrawerActions',
  component: PDrawerActions,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Action bar for drawer footers with back, secondary, and primary buttons.',
      },
    },
  },
  argTypes: {
    pBackCTA: {
      control: 'object',
      description: 'Tertiary button displayed on the left side (e.g. "Cancel", "Back")',
    },
    pSecondaryCTA: {
      control: 'object',
      description: 'Secondary button displayed on the right side (e.g. "Cancel")',
    },
    pPrimaryCTA: {
      control: 'object',
      description: 'Primary button displayed on the right side (e.g. "Submit", "Next")',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

function getButton(label: string, override: Partial<PDrawerActionButton> = {}): PDrawerActionButton {
  return {
    pLabel: label,
    pDisabled: false,
    pLoading: false,
    ...override,
  }
}

export const AllButtons: Story = {
  args: {
    pBackCTA: getButton('Précédent'),
    pSecondaryCTA: getButton('Envoyer une invitation'),
    pPrimaryCTA: getButton('Suivant'),
  },
}

export const PrimaryOnly: Story = {
  args: {
    pPrimaryCTA: getButton('Valider'),
  },
}

export const BackAndPrimary: Story = {
  args: {
    pBackCTA: getButton('Précédent'),
    pPrimaryCTA: getButton('Suivant'),
  },
}

export const SecondaryAndPrimary: Story = {
  args: {
    pSecondaryCTA: getButton('Envoyer une invitation'),
    pPrimaryCTA: getButton('Valider'),
  },
}

export const Disabled: Story = {
  args: {
    pBackCTA: getButton('Précédent', { pDisabled: true }),
    pSecondaryCTA: getButton('Envoyer une invitation', { pDisabled: true }),
    pPrimaryCTA: getButton('Suivant', { pDisabled: true }),
  },
}

export const Loading: Story = {
  args: {
    pBackCTA: getButton('Précédent'),
    pSecondaryCTA: getButton('Sauvegarder un brouillon'),
    pPrimaryCTA: getButton('Valider', { pLoading: true }),
  },
}
