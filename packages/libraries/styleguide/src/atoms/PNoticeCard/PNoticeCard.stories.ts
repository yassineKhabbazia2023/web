import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PNoticeCard from './PNoticeCard.vue'

const meta: Meta<typeof PNoticeCard> = {
  title: 'Atoms/PNoticeCard',
  component: PNoticeCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Notice card component with colored header and customizable content.',
      },
    },
  },
  argTypes: {
    pTitle: {
      control: 'text',
      description: 'Title displayed in header',
    },
    pIcon: {
      control: 'select',
      options: [undefined, 'pennylane', 'infoCircle', 'checkCircle', 'exclamationTriangle', 'xCircle', 'pennylaneColor'],
      description: 'Icon displayed in header',
    },
    pHeaderColor: {
      control: 'select',
      options: ['', 'dark-green', 'dark-blue', 'teal', 'info', 'success', 'warning', 'danger', 'purple', 'red', 'orange', 'pennylane'],
      description: 'Header background color (dark colors)',
    },
    pBodyColor: {
      control: 'select',
      options: ['', 'default', 'light-green', 'green-lighter', 'light-blue', 'lighter-gray', 'light-gray', 'tranquil'],
      description: 'Body background color (light colors)',
    },
  },
  args: {
    pTitle: 'Notice Title',
    pIcon: 'infoCircle',
    pHeaderColor: 'info',
    pBodyColor: 'default',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PNoticeCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px;">
        <PNoticeCard v-bind="args">
          <p>Ceci est le contenu de la carte de notification. Vous pouvez y placer n'importe quel contenu HTML.</p>
        </PNoticeCard>
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Default notice card with colored header and customizable content.',
      },
    },
  },
}

// Header Colors
export const HeaderColors: Story = {
  render: () => ({
    components: { PNoticeCard },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 500px;">
        <PNoticeCard pTitle="Dark Green Header" pHeaderColor="dark-green" pIcon="checkCircle">
          <p>Carte avec header vert foncé</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Dark Blue Header" pHeaderColor="dark-blue" pIcon="infoCircle">
          <p>Carte avec header bleu foncé</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Teal Header" pHeaderColor="teal" pIcon="infoCircle">
          <p>Carte avec header teal foncé</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Info Header" pHeaderColor="info" pIcon="infoCircle">
          <p>Carte avec header info</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Success Header" pHeaderColor="success" pIcon="checkCircle">
          <p>Carte avec header succès</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Warning Header" pHeaderColor="warning" pIcon="exclamationTriangle">
          <p>Carte avec header avertissement</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Danger Header" pHeaderColor="danger" pIcon="xCircle">
          <p>Carte avec header danger</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Purple Header" pHeaderColor="purple" pIcon="pennylane">
          <p>Carte avec header violet</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Red Header" pHeaderColor="red" pIcon="xCircle">
          <p>Carte avec header rouge</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Orange Header" pHeaderColor="orange" pIcon="exclamationTriangle">
          <p>Carte avec header orange</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Pennylane Header" pHeaderColor="pennylane" pIcon="pennylaneColor">
          <p>Carte avec header Pennylane</p>
        </PNoticeCard>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Available header colors (dark colors).',
      },
    },
  },
}

// Body Colors
export const BodyColors: Story = {
  render: () => ({
    components: { PNoticeCard },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 500px;">
        <PNoticeCard pTitle="Default Body" pHeaderColor="info" pBodyColor="default">
          <p>Carte avec body par défaut (blanc)</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Light Green Body" pHeaderColor="dark-green" pBodyColor="light-green">
          <p>Carte avec body vert très clair (jungle-50)</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Green Lighter Body" pHeaderColor="dark-green" pBodyColor="green-lighter">
          <p>Carte avec body vert clair</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Light Blue Body" pHeaderColor="dark-blue" pBodyColor="light-blue">
          <p>Carte avec body bleu clair</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Lighter Gray Body" pHeaderColor="info" pBodyColor="lighter-gray">
          <p>Carte avec body gris très clair</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Light Gray Body" pHeaderColor="info" pBodyColor="light-gray">
          <p>Carte avec body gris clair</p>
        </PNoticeCard>
        <PNoticeCard pTitle="Tranquil Body" pHeaderColor="info" pBodyColor="tranquil">
          <p>Carte avec body tranquil</p>
        </PNoticeCard>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Available body colors (light colors).',
      },
    },
  },
}

// Without Icon
export const WithoutIcon: Story = {
  render: () => ({
    components: { PNoticeCard },
    template: `
      <div style="width: 500px;">
        <PNoticeCard pTitle="Notification sans icône" pHeaderColor="info">
          <p>Cette carte n'a pas d'icône dans le header.</p>
        </PNoticeCard>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Notice card without icon.',
      },
    },
  },
}

// Rich Content
export const RichContent: Story = {
  render: () => ({
    components: { PNoticeCard },
    template: `
      <div style="width: 600px;">
        <PNoticeCard
          pTitle="Réforme de la facture électronique"
          pHeaderColor="dark-blue"
          pIcon="pennylane"
          pBodyColor="default"
        >
          <p>
            La réforme de la facturation électronique va généraliser progressivement
            les échanges électroniques des factures dès 2026. Cette réforme impacte
            notre organisation, c'est pourquoi nous avons choisi de l'anticiper
            dès maintenant pour garantir une conformité et assurer la poursuite de nos missions.
          </p>
          <p style="margin-top: 12px;">
            Pour recevoir et émettre des factures conformes <strong>à compter de septembre 2026</strong>,
            un travail complémentaire de mise à jour des fiches clients et fournisseurs est
            nécessaire par nos équipes (fiches comportant les codes que changent les opérations
            de vente exonérées de TVA).
          </p>
        </PNoticeCard>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Example with rich content (multiple paragraphs, bold text).',
      },
    },
  },
}
