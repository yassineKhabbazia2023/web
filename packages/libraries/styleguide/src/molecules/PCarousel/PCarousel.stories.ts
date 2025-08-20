import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PCarousel from './PCarousel.vue'
import type { PCarouselItemProps } from '../../atoms/PCarouselItem/PCarouselItemTypes'

const meta: Meta<typeof PCarousel> = {
  title: 'Molecules/PCarousel',
  component: PCarousel,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant carrousel pour afficher des éléments sous forme de diapositives avec navigation automatique ou manuelle.',
      },
    },
  },
  argTypes: {
    pItems: {
      control: 'object',
      description: 'Éléments du carrousel avec texte et image',
    },
    pHeight: {
      control: 'text',
      description: 'Hauteur du carrousel',
    },
    pInitialIndex: {
      control: 'number',
      description: 'Index initial de l\'élément affiché',
    },
    pTrigger: {
      control: 'select',
      options: ['hover', 'click'],
      description: 'Type de déclenchement pour la navigation',
    },
    pAutoplay: {
      control: 'boolean',
      description: 'Active le défilement automatique',
    },
    pInterval: {
      control: 'number',
      description: 'Intervalle en ms pour le défilement automatique',
    },
    pArrow: {
      control: 'select',
      options: ['always', 'hover', 'never'],
      description: 'Affichage des flèches de navigation',
    },
    pLoop: {
      control: 'boolean',
      description: 'Active la boucle infinie',
    },
    pDirection: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: 'Direction du défilement',
    },
    pPauseOnHover: {
      control: 'boolean',
      description: 'Met en pause le défilement au survol',
    },
  },
  args: {
    pItems: [
      {
        pText: 'Manage the activation of the various RYDGE services and the digitization of your customer relationship.',
        pImageName: 'feedcenter-fav',
        pImageType: 'paupulse',
      },
      {
        pText: 'Create and track your bank mandate requests at a glance!',
        pImageType: 'paupulse',
        pImageName: 'bank-mandate',
      },
      {
        pText: 'Follow the documents shared by your customers on a daily basis.',
        pImageType: 'paupulse',
        pImageName: 'shared-document',
      },
    ],
    pHeight: '600px',
    pInitialIndex: 0,
    pTrigger: 'click',
    pAutoplay: false,
    pInterval: 3000,
    pArrow: 'never',
    pLoop: true,
    pDirection: 'horizontal',
    pPauseOnHover: true,
  },
}

export default meta
export type Story = StoryObj<typeof meta>

const createCarouselItems = (count: number = 3): PCarouselItemProps[] => {
  const items = [
    {
      pText: 'Manage the activation of the various RYDGE services and the digitization of your customer relationship.',
      pImageName: 'feedcenter-fav' as any,
      pImageType: 'paupulse',
    },
    {
      pText: 'Create and track your bank mandate requests at a glance!',
      pImageType: 'paupulse',
      pImageName: 'bank-mandate' as any,
    },
    {
      pText: 'Follow the documents shared by your customers on a daily basis.',
      pImageType: 'paupulse',
      pImageName: 'shared-document' as any,
    },
    {
      pText: 'Streamline your workflow with automated processes and real-time updates.',
      pImageType: 'paupulse',
      pImageName: 'workflow-automation' as any,
    },
    {
      pText: 'Get comprehensive analytics and insights to make informed business decisions.',
      pImageType: 'paupulse',
      pImageName: 'analytics-dashboard' as any,
    },
  ]

  return items.slice(0, count)
}

// Basic carousel
export const Basic: Story = {
  render: (args) => ({
    components: { PCarousel },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px; height: 600px;">
        <PCarousel v-bind="args" />
      </div>
    `,
  }),
}

// With arrows always visible
export const WithArrows: Story = {
  args: {
    pArrow: 'always',
  },
  render: (args) => ({
    components: { PCarousel },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px; height: 600px;">
        <PCarousel v-bind="args" />
      </div>
    `,
  }),
}

// With arrows on hover
export const WithArrowsOnHover: Story = {
  args: {
    pArrow: 'hover',
  },
  render: (args) => ({
    components: { PCarousel },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px; height: 600px;">
        <PCarousel v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px; text-align: center;">
          Survolez le carrousel pour voir les flèches
        </p>
      </div>
    `,
  }),
}

// Autoplay carousel
export const Autoplay: Story = {
  args: {
    pAutoplay: true,
    pInterval: 2000,
    pArrow: 'hover',
    pPauseOnHover: true,
  },
  render: (args) => ({
    components: { PCarousel },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px; height: 600px;">
        <PCarousel v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px; text-align: center;">
          Défilement automatique toutes les 2 secondes (pause au survol)
        </p>
      </div>
    `,
  }),
}

// Vertical carousel
export const Vertical: Story = {
  args: {
    pDirection: 'vertical',
    pArrow: 'always',
    pHeight: '400px',
  },
  render: (args) => ({
    components: { PCarousel },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px; height: 400px;">
        <PCarousel v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px; text-align: center;">
          Carrousel vertical
        </p>
      </div>
    `,
  }),
}

// With more items
export const MoreItems: Story = {
  args: {
    pItems: createCarouselItems(5),
    pArrow: 'always',
    pAutoplay: true,
    pInterval: 3000,
  },
  render: (args) => ({
    components: { PCarousel },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px; height: 600px;">
        <PCarousel v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px; text-align: center;">
          Carrousel avec 5 éléments et défilement automatique
        </p>
      </div>
    `,
  }),
}

// Custom height
export const CustomHeight: Story = {
  args: {
    pHeight: '300px',
    pArrow: 'always',
  },
  render: (args) => ({
    components: { PCarousel },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 500px; height: 300px;">
        <PCarousel v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px; text-align: center;">
          Carrousel avec hauteur personnalisée (300px)
        </p>
      </div>
    `,
  }),
}
