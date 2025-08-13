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

// Different icons and shapes
export const DifferentIconsAndShapes: Story = {
  render: () => ({
    components: { PEntity },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
        <PEntity 
          pContent="Utilisateur" 
          pIconName="person" 
          pIconShape="circle"
          pType="primary"
        />
        <PEntity 
          pContent="Organisation" 
          pIconName="building" 
          pIconShape="square"
          pType="primary"
        />
        <PEntity 
          pContent="Équipe" 
          pIconName="people" 
          pIconShape="circle"
          pType="primary"
        />
        <PEntity 
          pContent="Département" 
          pIconName="handbag" 
          pIconShape="square"
          pType="primary"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Entités avec différentes icônes et formes d\'avatar.',
      },
    },
  },
}

// Different sizes
export const DifferentSizes: Story = {
  render: () => ({
    components: { PEntity },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
        <PEntity 
          pContent="Très petit avatar" 
          pIconName="person" 
          pIconType="xsmall"
          pType="primary"
        />
        <PEntity 
          pContent="Petit avatar" 
          pIconName="person" 
          pIconType="small"
          pType="primary"
        />
        <PEntity 
          pContent="Avatar moyen" 
          pIconName="person" 
          pIconType="medium"
          pType="primary"
        />
        <PEntity 
          pContent="Grand avatar" 
          pIconName="person" 
          pIconType="large"
          pType="primary"
        />
        <PEntity 
          pContent="Très grand avatar" 
          pIconName="person" 
          pIconType="xlarge"
          pType="primary"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Entités avec différentes tailles d\'avatar.',
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

// Real world examples
export const RealWorldExamples: Story = {
  render: () => ({
    components: { PEntity },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 12px;">Liste d'utilisateurs</h3>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 350px;">
            <PEntity 
              pContent="Marie Dupont" 
              pIconName="person" 
              pType="primary"
              :pSelected="true"
              :pBold="true"
            />
            <PEntity 
              pContent="Pierre Martin" 
              pIconName="person" 
              pType="primary"
            />
            <PEntity 
              pContent="Sophie Laurent" 
              pIconName="person" 
              pType="primary"
            />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px;">Organisations</h3>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 350px;">
            <PEntity 
              pContent="Entreprise ABC" 
              pIconName="building" 
              pIconShape="square"
              pType="primary"
              pIconType="small"
            />
            <PEntity 
              pContent="Société XYZ" 
              pIconName="building" 
              pIconShape="square"
              pType="secondary"
              pIconType="small"
            />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px;">Équipes et départements</h3>
          <div style="display: flex; flex-direction: column; gap: 8px; width: 350px;">
            <PEntity 
              pContent="Équipe Développement" 
              pIconName="people" 
              pType="primary"
              pIconType="medium"
              :pBold="true"
            />
            <PEntity 
              pContent="Département Marketing" 
              pIconName="handbag" 
              pIconShape="square"
              pType="secondary"
              pIconType="medium"
            />
            <PEntity 
              pContent="Support Client" 
              pIconName="buildingSupport" 
              pType="primary"
              pIconType="medium"
            />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemples d\'utilisation dans des listes d\'entités réelles.',
      },
    },
  },
}
