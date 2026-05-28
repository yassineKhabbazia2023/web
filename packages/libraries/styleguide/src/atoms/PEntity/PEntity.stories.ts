import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PEntity from './PEntity.vue'
import { pulseGeneratedIcons } from '../PIcon/components/constants'

const meta: Meta<typeof PEntity> = {
  title: 'Atoms/PEntity',
  component: PEntity,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant entité avec avatar et contenu, utilisé pour représenter des utilisateurs, organisations, etc.',
      },
    },
  },
  argTypes: {
    pContent: {
      control: 'text',
      description: 'Contenu textuel de l\'entité',
    },
    pIconName: {
      control: 'select',
      options: [undefined, ...pulseGeneratedIcons.map(icon => icon.name)],
      description: 'Nom de l\'icône à afficher dans l\'avatar',
    },
    pType: {
      control: 'select',
      options: ['primary', 'secondary'],
      description: 'Type de style de l\'entité',
    },
    pIconShape: {
      control: 'select',
      options: ['circle', 'square'],
      description: 'Forme de l\'avatar',
    },
    pIconColor: {
      control: 'text',
      description: 'Couleur de l\'avatar',
    },
    pIconType: {
      control: 'select',
      options: ['xsmall', 'small', 'medium', 'large', 'xlarge'],
      description: 'Taille de l\'avatar',
    },
    pBold: {
      control: 'boolean',
      description: 'Texte en gras',
    },
    pSelected: {
      control: 'boolean',
      description: 'État sélectionné',
    },
  },
  args: {
    pContent: 'Nom de l\'entité',
    pIconName: 'person',
    pType: 'primary',
    pIconShape: 'circle',
    pIconColor: 'persian-gradient',
    pIconType: 'xsmall',
    pBold: false,
    pSelected: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Entité par défaut avec avatar et nom.',
      },
    },
  },
}

// Different types
export const DifferentTypes: Story = {
  render: () => ({
    components: { PEntity },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
        <PEntity 
          pContent="Entité primaire" 
          pIconName="person" 
          pType="primary" 
        />
        <PEntity 
          pContent="Entité secondaire" 
          pIconName="person" 
          pType="secondary" 
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents types d\'entités.',
      },
    },
  },
}

// States
export const States: Story = {
  render: () => ({
    components: { PEntity },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
        <PEntity 
          pContent="Entité normale" 
          pIconName="person" 
          pType="primary"
          :pSelected="false"
          :pBold="false"
        />
        <PEntity 
          pContent="Entité sélectionnée" 
          pIconName="person" 
          pType="primary"
          :pSelected="true"
          :pBold="false"
        />
        <PEntity 
          pContent="Entité en gras" 
          pIconName="person" 
          pType="primary"
          :pSelected="false"
          :pBold="true"
        />
        <PEntity 
          pContent="Entité sélectionnée et en gras" 
          pIconName="person" 
          pType="primary"
          :pSelected="true"
          :pBold="true"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents états des entités : normal, sélectionné, gras.',
      },
    },
  },
}
