import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PButton from './PButton.vue'
import PIcon from '../PIcon'

const meta: Meta<typeof PButton> = {
  title: 'Atoms/PButton',
  component: PButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Un composant bouton personnalisé basé sur Element Plus avec des variantes et options étendues.',
      },
    },
  },
  argTypes: {
    pType: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'tertiary', 'white', 'danger', 'active'],
      description: 'Le type/style du bouton',
    },
    pSize: {
      control: 'select',
      options: ['default', 'small'],
      description: 'La taille du bouton',
    },
    pCircle: {
      control: 'boolean',
      description: 'Rend le bouton circulaire',
    },
    pDisabled: {
      control: 'boolean',
      description: 'Désactive le bouton',
    },
    pLoading: {
      control: 'boolean',
      description: 'Affiche un état de chargement',
    },
    pIconOnly: {
      control: 'boolean',
      description: 'Optimise le style pour un bouton avec icône uniquement',
    },
    pIsActive: {
      control: 'boolean',
      description: 'Applique un style actif au bouton',
    },
    pIsUnderlined: {
      control: 'boolean',
      description: 'Souligne le texte du bouton',
    },
    pTag: {
      control: 'text',
      description: 'Élément HTML à utiliser comme tag (par défaut: button)',
    },
  },
  args: {
    pType: 'default',
    pSize: 'default',
    pCircle: false,
    pDisabled: false,
    pLoading: false,
    pIconOnly: false,
    pIsActive: false,
    pIsUnderlined: false,
    pTag: 'button',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Bouton par défaut</PButton>',
  }),
}

// Type variants
export const Primary: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Bouton principal</PButton>',
  }),
  args: {
    pType: 'primary',
  },
}

export const Secondary: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Bouton secondaire</PButton>',
  }),
  args: {
    pType: 'secondary',
  },
}

export const Tertiary: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Bouton tertiaire</PButton>',
  }),
  args: {
    pType: 'tertiary',
  },
}

export const White: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Bouton blanc</PButton>',
  }),
  args: {
    pType: 'white',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export const Danger: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Bouton danger</PButton>',
  }),
  args: {
    pType: 'danger',
  },
}

export const Active: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Bouton actif</PButton>',
  }),
  args: {
    pType: 'active',
  },
}

// Underlined variant
export const Underlined: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Bouton souligné</PButton>',
  }),
  args: {
    pType: 'tertiary',
    pIsUnderlined: true,
  },
}

// Sizes
export const Small: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Petit bouton</PButton>',
  }),
  args: {
    pType: 'primary',
    pSize: 'small',
  },
}

// States
export const Disabled: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Bouton désactivé</PButton>',
  }),
  args: {
    pType: 'primary',
    pDisabled: true,
  },
}

export const Loading: Story = {
  render: (args) => ({
    components: { PButton },
    setup() {
      return { args }
    },
    template: '<PButton v-bind="args">Chargement...</PButton>',
  }),
  args: {
    pType: 'primary',
    pLoading: true,
  },
}

// Circular button
export const Circle: Story = {
  args: {
    pType: 'primary',
    pCircle: true,
    pIconOnly: true,
  },
  render: (args) => ({
    components: { PButton, PIcon },
    setup() {
      return { args }
    },
    template: `
      <PButton v-bind="args">
        <PIcon pName="plusLg" />
      </PButton>
    `,
  }),
}

// Button with icon
export const WithIcon: Story = {
  render: (args) => ({
    components: { PButton, PIcon },
    setup() {
      return { args }
    },
    template: `
      <PButton v-bind="args">
        <PIcon pName="search" class="el-button__icon--left" />
        Rechercher
      </PButton>
    `,
  }),
  args: {
    pType: 'primary',
    pIconOnly: false,
  },
}

// Button with right icon
export const WithIconRight: Story = {
  render: (args) => ({
    components: { PButton, PIcon },
    setup() {
      return { args }
    },
    template: `
      <PButton v-bind="args">
        Suivant
        <PIcon pName="arrowRight" class="el-button__icon--right" />
      </PButton>
    `,
  }),
  args: {
    pType: 'primary',
    pIconOnly: false,
  },
}

// Icon only button
export const IconOnly: Story = {
  args: {
    pType: 'primary',
    pIconOnly: true,
  },
  render: (args) => ({
    components: { PButton, PIcon },
    setup() {
      return { args }
    },
    template: `
      <PButton v-bind="args">
        <PIcon pName="gear" />
      </PButton>
    `,
  }),
}

// Showcase of all variants
export const AllVariants: Story = {
  render: () => ({
    components: { PButton, PIcon },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 8px; align-items: center;">
          <PButton pType="default">Default</PButton>
          <PButton pType="primary">Primary</PButton>
          <PButton pType="secondary">Secondary</PButton>
          <PButton pType="tertiary">Tertiary</PButton>
          <PButton pType="white">White</PButton>
          <PButton pType="danger">Danger</PButton>
          <PButton pType="active">Active</PButton>
        </div>
        
        <div style="display: flex; gap: 8px; align-items: center;">
          <PButton pType="primary" pSize="small">Small</PButton>
          <PButton pType="primary">Default</PButton>
        </div>
        
        <div style="display: flex; gap: 8px; align-items: center;">
          <PButton pType="primary">Normal</PButton>
          <PButton pType="primary" pDisabled>Disabled</PButton>
          <PButton pType="primary" pLoading>Loading</PButton>
          <PButton pType="primary" pIsActive>Pressed</PButton>
        </div>
        
        <div style="display: flex; gap: 8px; align-items: center;">
          <PButton pType="primary">
            <PIcon pName="search" class="el-button__icon--left" />
            Icon Left
          </PButton>
          <PButton pType="primary">
            Icon Right
            <PIcon pName="arrowRight" class="el-button__icon--right" />
          </PButton>
          <PButton pType="primary" pIconOnly pCircle>
            <PIcon pName="plusLg" />
          </PButton>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Aperçu de toutes les variantes du composant PButton.',
      },
    },
  },
}
