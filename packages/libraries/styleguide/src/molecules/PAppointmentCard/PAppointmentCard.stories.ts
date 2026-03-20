import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PAppointmentCard from './PAppointmentCard.vue'
import type { PAppointmentCardProps } from './PAppointmentCardTypes'

const meta: Meta<typeof PAppointmentCard> = {
  title: 'Molecules/PAppointmentCard',
  component: PAppointmentCard,
  parameters: {
    docs: {
      description: {
        component: 'Carte affichant un rendez-vous avec date, heure, label et bouton rejoindre optionnel pour les réunions en ligne.',
      },
    },
  },
  argTypes: {
    pStartDateTime: {
      control: 'text',
      description: 'Date ISO 8601 du rendez-vous',
      table: {
        type: { summary: 'string' },
      },
    },
    pLabel: {
      control: 'text',
      description: 'Label principal du rendez-vous',
      table: {
        type: { summary: 'string' },
      },
    },
    pIsOnlineMeeting: {
      control: 'boolean',
      description: 'Indique si le rendez-vous est en ligne (affiche le bouton rejoindre)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pJoinLabel: {
      control: 'text',
      description: 'Label du bouton rejoindre',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Rejoindre' },
      },
    },
    pIsActive: {
      control: 'boolean',
      description: 'État actif du rendez-vous (surbrillance)',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PAppointmentCardProps>

export const Default: Story = {
  render: (args) => ({
    components: { PAppointmentCard },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 20px; max-width: 500px;">
        <PAppointmentCard v-bind="args" />
      </div>
    `,
  }),
  args: {
    pStartDateTime: '2026-03-20T10:30:00',
    pLabel: 'RDV avec Jean Dupont',
  },
}

export const AvecBoutonRejoindre: Story = {
  render: (args) => ({
    components: { PAppointmentCard },
    setup() {
      const handleJoin = () => {
        console.log('Join clicked')
      }
      return { args, handleJoin }
    },
    template: `
      <div style="padding: 20px; max-width: 500px;">
        <PAppointmentCard v-bind="args" @join="handleJoin" />
      </div>
    `,
  }),
  args: {
    pStartDateTime: '2026-03-20T10:30:00',
    pLabel: 'RDV avec Jean Dupont',
    pIsOnlineMeeting: true,
  },
}

export const Inactif: Story = {
  render: (args) => ({
    components: { PAppointmentCard },
    setup() {
      return { args }
    },
    template: `
      <div style="padding: 20px; max-width: 500px;">
        <PAppointmentCard v-bind="args" />
      </div>
    `,
  }),
  args: {
    pStartDateTime: '2026-03-20T10:30:00',
    pLabel: 'RDV avec Jean Dupont',
    pIsActive: false,
  },
}

export const InactifAvecBoutonRejoindre: Story = {
  render: (args) => ({
    components: { PAppointmentCard },
    setup() {
      const handleJoin = () => {
        console.log('Join clicked')
      }
      return { args, handleJoin }
    },
    template: `
      <div style="padding: 20px; max-width: 500px;">
        <PAppointmentCard v-bind="args" @join="handleJoin" />
      </div>
    `,
  }),
  args: {
    pStartDateTime: '2026-03-20T10:30:00',
    pLabel: 'RDV avec Marie Martin',
    pIsOnlineMeeting: true,
    pIsActive: false,
  },
}

export const PlusieursRendezVous: Story = {
  render: () => ({
    components: { PAppointmentCard },
    setup() {
      const handleJoin = (name: string) => {
        console.log(`Join clicked for ${name}`)
      }
      return { handleJoin }
    },
    template: `
      <div style="padding: 20px; max-width: 500px;">
        <h3 style="margin-bottom: 16px;">Prochains rendez-vous</h3>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <PAppointmentCard
            pStartDateTime="2026-03-20T09:00:00"
            pLabel="RDV avec Jean Dupont"
            :pIsOnlineMeeting="true"
            @join="handleJoin('Jean Dupont')"
          />
          <PAppointmentCard
            pStartDateTime="2026-03-20T14:30:00"
            pLabel="RDV avec Marie Martin"
            :pIsOnlineMeeting="true"
            :pIsActive="false"
            @join="handleJoin('Marie Martin')"
          />
          <PAppointmentCard
            pStartDateTime="2026-03-21T10:00:00"
            pLabel="RDV avec Pierre Durand"
            :pIsActive="false"
          />
        </div>
      </div>
    `,
  }),
}
