import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PBreadcrumb from './PBreadcrumb.vue'
import type { BreadcrumbItems } from './PBreadcrumbTypes'

const meta: Meta<typeof PBreadcrumb> = {
  title: 'Molecules/PBreadcrumb',
  component: PBreadcrumb,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Composant de fil d\'Ariane permettant de naviguer dans une hiérarchie de pages. Supporte l\'ellipse automatique pour les longues listes.',
      },
    },
  },
  argTypes: {
    pElements: {
      control: 'object',
      description: 'Éléments du breadcrumb avec id et texte',
    },
    pSize: {
      control: 'select',
      options: ['S', 'M'],
      description: 'Taille du breadcrumb',
    },
  },
  args: {
    pElements: [
      { pId: 0, pText: 'Accueil' },
      { pId: 1, pText: 'Produits' },
      { pId: 2, pText: 'Catégorie' },
      { pId: 3, pText: 'Sous-catégorie' },
      { pId: 4, pText: 'Article' },
    ],
    pSize: 'M',
  },
}

export default meta
export type Story = StoryObj<typeof meta>

const generateBreadcrumbItems = (numberOfItems: number): BreadcrumbItems[] => {
  const breadcrumbItems = []
  for (let i = 0; i < numberOfItems; i++) {
    breadcrumbItems.push({ pId: i, pText: `Lorem ${i}` })
  }
  return breadcrumbItems
}

// Basic breadcrumb
export const Basic: Story = {
  args: {
    pElements: [
      { pId: 0, pText: 'Accueil' },
      { pId: 1, pText: 'Produits' },
      { pId: 2, pText: 'Ordinateurs' },
      { pId: 3, pText: 'Portables' },
      { pId: 4, pText: 'MacBook Pro' },
    ],
  },
  render: (args) => ({
    components: { PBreadcrumb },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBreadcrumb v-bind="args" />
      </div>
    `,
  }),
}

// Long breadcrumb with ellipsis
export const WithEllipsis: Story = {
  args: {
    pElements: generateBreadcrumbItems(8),
    pSize: 'M',
  },
  render: (args) => ({
    components: { PBreadcrumb },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBreadcrumb v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px;">
          Avec 8 éléments, le breadcrumb utilise automatiquement des ellipses pour condenser l'affichage
        </p>
      </div>
    `,
  }),
}

// Small size
export const Small: Story = {
  args: {
    pElements: generateBreadcrumbItems(8),
    pSize: 'S',
  },
  render: (args) => ({
    components: { PBreadcrumb },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBreadcrumb v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px;">
          Breadcrumb en taille S (small)
        </p>
      </div>
    `,
  }),
}

// Medium size
export const Medium: Story = {
  args: {
    pElements: generateBreadcrumbItems(8),
    pSize: 'M',
  },
  render: (args) => ({
    components: { PBreadcrumb },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBreadcrumb v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px;">
          Breadcrumb en taille M (medium)
        </p>
      </div>
    `,
  }),
}

// Short breadcrumb
export const Short: Story = {
  args: {
    pElements: [
      { pId: 0, pText: 'Accueil' },
      { pId: 1, pText: 'Page actuelle' },
    ],
    pSize: 'M',
  },
  render: (args) => ({
    components: { PBreadcrumb },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBreadcrumb v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px;">
          Breadcrumb court avec seulement 2 éléments
        </p>
      </div>
    `,
  }),
}

// Real world example
export const RealWorld: Story = {
  args: {
    pElements: [
      { pId: 0, pText: 'Pulse' },
      { pId: 1, pText: 'Entreprises' },
      { pId: 2, pText: 'Acme Corp' },
      { pId: 3, pText: 'Collaborateurs' },
      { pId: 4, pText: 'Gestion' },
      { pId: 5, pText: 'Nouveau collaborateur' },
    ],
    pSize: 'M',
  },
  render: (args) => ({
    components: { PBreadcrumb },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 100%; max-width: 800px;">
        <PBreadcrumb v-bind="args" />
        <p style="margin-top: 16px; color: #666; font-size: 14px;">
          Exemple réel de navigation dans l'application Pulse
        </p>
      </div>
    `,
  }),
}
