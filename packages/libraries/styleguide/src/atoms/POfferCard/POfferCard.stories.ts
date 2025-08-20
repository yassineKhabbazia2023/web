import type { Meta, StoryObj } from '@storybook/vue3-vite'
import POfferCard from './POfferCard.vue'

const meta: Meta<typeof POfferCard> = {
  title: 'Atoms/POfferCard',
  component: POfferCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Button usage for accessibility. Attribute title will be read by the reader of the browser.',
      },
    },
  },
  argTypes: {
    pLogo: {
      control: 'text',
      description: 'The logo/image name for the offer',
    },
    pTitle: {
      control: 'text',
      description: 'The title of the offer',
    },
    pDescription: {
      control: 'text',
      description: 'The description of the offer',
    },
    pSelected: {
      control: 'boolean',
      description: 'Whether the offer is selected',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the offer is disabled',
    },
  },
  args: {
    pLogo: 'loop-color',
    pTitle: 'Mes Modules de Compta',
    pDescription: 'Loop collaboratif (RYDGE compta)',
    pSelected: false,
    disabled: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { POfferCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 750px; padding: 24px;">
        <POfferCard v-bind="args" />
      </div>
    `,
  }),
}

export const Selected: Story = {
  args: {
    pLogo: 'brand-color',
    pTitle: 'Ma Banque',
    pDescription: 'Visualisation des données bancaires',
    pSelected: true,
  },
}

export const Disabled: Story = {
  args: {
    pLogo: 'silae-color',
    pTitle: 'Externalisation de la paie',
    pDescription: 'Silae en externalisation',
    disabled: true,
  },
}

export const MultipleOffers: Story = {
  render: () => ({
    components: { POfferCard },
    template: `
      <div style="width: 750px; padding: 24px; display: flex; flex-direction: column; gap: 16px;">
        <POfferCard
          pLogo="loop-color"
          pTitle="Mes Modules de Compta"
          pDescription="Loop collaboratif (RYDGE compta)"
        />
        <POfferCard
          pLogo="meg"
          pTitle="Gestion Smart"
          pDescription="Mon Expert en Gestion (MEG) en version start (inclus dans RYDGE)"
        />
        <POfferCard
          pLogo="brand-color"
          pTitle="Ma Banque"
          pDescription="Visualisation des données bancaires"
          pSelected
        />
        <POfferCard
          pLogo="silae-color"
          pTitle="Externalisation de la paie"
          pDescription="Silae en externalisation"
          disabled
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
  },
}
