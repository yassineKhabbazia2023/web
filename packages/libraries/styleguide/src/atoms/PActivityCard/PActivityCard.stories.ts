import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PActivityCard from './PActivityCard.vue'

// Storybook meta configuration for PActivityCard
const meta: Meta<typeof PActivityCard> = {
  title: 'Atoms/PActivityCard',
  component: PActivityCard,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          "Carte d'activité affichant des initiales et un texte avec une heure associée.",
      },
    },
  },
  argTypes: {
    pInitials: {
      control: 'text',
      description: "Initiales affichées dans l'avatar (2 caractères recommandés)",
    },
    pTime: {
      control: 'text',
      description: "Texte indiquant l'heure ou la date",
    },
  },
  args: {
    pInitials: 'JD',
    pTime: 'il y a 5 min',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PActivityCard },
    setup() {
      return { args }
    },
    template: `
      <PActivityCard v-bind="args">
        Nouvelle activité détectée sur votre dossier.
      </PActivityCard>
    `,
  }),
}

export const DifferentInitials: Story = {
  args: {
    pInitials: 'AB',
    pTime: 'hier',
  },
  render: (args) => ({
    components: { PActivityCard },
    setup() {
      return { args }
    },
    template: `
      <PActivityCard v-bind="args">
        Document ajouté au dossier client.
      </PActivityCard>
    `,
  }),
}

export const LongText: Story = {
  args: {
    pInitials: 'ML',
    pTime: '12:30',
  },
  render: (args) => ({
    components: { PActivityCard },
    setup() {
      return { args }
    },
    template: `
      <PActivityCard v-bind="args">
        Mise à jour importante: la demande a été validée et transmise au service concerné pour traitement.
      </PActivityCard>
    `,
  }),
}
