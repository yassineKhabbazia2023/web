import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PPastille from './PPastille.vue'
import { pulseGeneratedIcons } from '../PIcon/components/constants'

const meta: Meta<typeof PPastille> = {
  title: 'Atoms/PPastille',
  component: PPastille,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant pastille/badge basé sur Element Plus avec différents styles.',
      },
    },
  },
  argTypes: {
    pType: {
      control: 'select',
      options: ['default', 'warning', 'persian', 'white'],
      description: 'Type de style de la pastille',
    },
    pSize: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Taille de la pastille',
    },
    pDisabled: {
      control: 'boolean',
      description: 'État désactivé de la pastille',
    },
    pIconName: {
      control: 'select',
      options: [undefined, ...pulseGeneratedIcons.map(icon => icon.name)],
      description: 'Nom de l\'icône à afficher (optionnel)',
    },
  },
  args: {
    pType: 'default',
    pSize: 'default',
    pDisabled: false,
    pIconName: undefined,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PPastille },
    setup() {
      return { args }
    },
    template: '<PPastille v-bind="args">Pastille</PPastille>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Pastille par défaut avec du texte.',
      },
    },
  },
}

// Different types
export const DifferentTypes: Story = {
  render: () => ({
    components: { PPastille },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <PPastille pType="default">Défaut</PPastille>
        <PPastille pType="warning">Avertissement</PPastille>
        <PPastille pType="persian">Persian</PPastille>
        <PPastille pType="white">Blanc</PPastille>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents types de pastilles avec leurs styles respectifs.',
      },
    },
  },
}

// Different sizes
export const DifferentSizes: Story = {
  render: () => ({
    components: { PPastille },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <PPastille pSize="small">Petit</PPastille>
        <PPastille pSize="default">Normal</PPastille>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différentes tailles de pastilles.',
      },
    },
  },
}

// With icons
export const WithIcons: Story = {
  render: () => ({
    components: { PPastille },
    template: `
      <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
        <PPastille pIconName="check" pType="default" />
        <PPastille pIconName="exclamationTriangle" pType="warning" />
        <PPastille pIconName="x" pType="persian" />
        <PPastille pIconName="infoCircle" pType="white" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Pastilles avec des icônes au lieu de texte.',
      },
    },
  },
}

// States
export const States: Story = {
  render: () => ({
    components: { PPastille },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: flex; gap: 16px; align-items: center;">
          <PPastille pType="default">Normal</PPastille>
          <PPastille pType="default" :pDisabled="true">Désactivé</PPastille>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <PPastille pType="warning">Normal</PPastille>
          <PPastille pType="warning" :pDisabled="true">Désactivé</PPastille>
        </div>
        <div style="display: flex; gap: 16px; align-items: center;">
          <PPastille pIconName="check">Normal</PPastille>
          <PPastille pIconName="check" :pDisabled="true">Désactivé</PPastille>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'États normal et désactivé des pastilles.',
      },
    },
  },
}

// Real world examples
export const RealWorldExamples: Story = {
  render: () => ({
    components: { PPastille },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 12px;">États de commande</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <PPastille pType="default">En attente</PPastille>
            <PPastille pType="warning">En cours</PPastille>
            <PPastille pType="persian">Annulé</PPastille>
            <PPastille pIconName="check" pType="default">Terminé</PPastille>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px;">Notifications</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <PPastille pIconName="bell" pType="warning" pSize="small" />
            <PPastille pType="persian" pSize="small">3</PPastille>
            <PPastille pIconName="envelope" pType="default" pSize="small" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px;">Tags de catégorie</h3>
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <PPastille pType="default" pSize="small">Personnel</PPastille>
            <PPastille pType="warning" pSize="small">Professionnel</PPastille>
            <PPastille pType="persian" pSize="small">Urgent</PPastille>
            <PPastille pType="white" pSize="small">Archive</PPastille>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemples d\'utilisation dans des interfaces réelles.',
      },
    },
  },
}
