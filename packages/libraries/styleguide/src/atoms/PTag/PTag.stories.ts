import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PTag from './PTag.vue'

const meta: Meta<typeof PTag> = {
  title: 'Atoms/PTag',
  component: PTag,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant d\'étiquette basé sur Element Plus avec couleurs et icônes personnalisées.',
      },
    },
  },
  argTypes: {
    pColor: {
      control: 'select',
      options: [
        '',
        'success',
        'warning',
        'danger',
        'info',
        'persian',
        'fuschia',
        'cyan',
        'amethyste',
        'blue-pulse',
        'gray-100',
        'gray-300',
        'gray-500',
        'gray-900',
        'plain',
        'outline',
      ],
      description: 'Couleur de l\'étiquette',
    },
    pSize: {
      control: 'select',
      options: ['large', 'default', 'small', ''],
      description: 'Taille de l\'étiquette',
    },
    pContent: {
      control: 'text',
      description: 'Contenu textuel de l\'étiquette',
    },
    pIconLeftName: {
      control: 'select',
      options: ['house', 'person', 'star', 'check', 'x', 'infoCircle', 'exclamationTriangle'],
      description: 'Icône à gauche',
    },
    pIconRightName: {
      control: 'select',
      options: ['house', 'person', 'star', 'check', 'x', 'infoCircle', 'exclamationTriangle'],
      description: 'Icône à droite',
    },
    pRound: {
      control: 'boolean',
      description: 'Bordures arrondies',
    },
    pClosable: {
      control: 'boolean',
      description: 'Affiche un bouton de fermeture',
    },
    pDisableTransitions: {
      control: 'boolean',
      description: 'Désactive les transitions',
    },
  },
  args: {
    pColor: '',
    pSize: 'default',
    pContent: 'Étiquette',
    pIconLeftName: undefined,
    pIconRightName: undefined,
    pRound: false,
    pClosable: false,
    pDisableTransitions: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PTag },
    setup() {
      return { args }
    },
    template: '<PTag v-bind="args" />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Étiquette par défaut.',
      },
    },
  },
}

// Different colors
export const Colors: Story = {
  render: () => ({
    components: { PTag },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <PTag pContent="Défaut" pColor="" />
        <PTag pContent="Succès" pColor="success" />
        <PTag pContent="Avertissement" pColor="warning" />
        <PTag pContent="Danger" pColor="danger" />
        <PTag pContent="Info" pColor="info" />
        <PTag pContent="Persian" pColor="persian" />
        <PTag pContent="Fuschia" pColor="fuschia" />
        <PTag pContent="Cyan" pColor="cyan" />
        <PTag pContent="Amethyste" pColor="amethyste" />
        <PTag pContent="Blue Pulse" pColor="blue-pulse" />
        <PTag pContent="Plain" pColor="plain" />
        <PTag pContent="Outline" pColor="outline" />
        <PTag pContent="Gray-100" pColor="gray-100" />
        <PTag pContent="Gray-300" pColor="gray-300" />
        <PTag pContent="Gray-500" pColor="gray-500" />
        <PTag pContent="Gray-900" pColor="gray-900" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différentes couleurs d\'étiquettes disponibles.',
      },
    },
  },
}

// Different sizes
export const Sizes: Story = {
  render: () => ({
    components: { PTag },
    template: `
      <div style="display: flex; align-items: center; gap: 16px;">
        <PTag pContent="Petit" pColor="info" pSize="small" />
        <PTag pContent="Normal" pColor="info" pSize="default" />
        <PTag pContent="Grand" pColor="info" pSize="large" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différentes tailles d\'étiquettes.',
      },
    },
  },
}

// With icons
export const WithIcons: Story = {
  render: () => ({
    components: { PTag },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <PTag pContent="Avec icône gauche" pColor="success" pIconLeftName="check" />
        <PTag pContent="Avec icône droite" pColor="info" pIconRightName="infoCircle" />
        <PTag pContent="Deux icônes" pColor="warning" pIconLeftName="exclamationTriangle" pIconRightName="x" />
        <PTag pContent="Utilisateur" pColor="blue-pulse" pIconLeftName="person" />
        <PTag pContent="Favoris" pColor="fuschia" pIconLeftName="star" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Étiquettes avec icônes à gauche et/ou à droite.',
      },
    },
  },
}

// Closable tags
export const Closable: Story = {
  render: () => ({
    components: { PTag },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <PTag pContent="Fermable" pColor="info" pClosable />
        <PTag pContent="Avec icône" pColor="success" pIconLeftName="check" pClosable />
        <PTag pContent="Arrondi" pColor="warning" pRound pClosable />
        <PTag pContent="Dark fermable" pColor="danger" pClosable />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Étiquettes avec bouton de fermeture.',
      },
    },
  },
}

// Round tags
export const Round: Story = {
  render: () => ({
    components: { PTag },
    template: `
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <PTag pContent="Arrondi" pColor="info" pRound />
        <PTag pContent="Succès" pColor="success" pRound />
        <PTag pContent="Danger" pColor="danger" pRound />
        <PTag pContent="Avec icône" pColor="blue-pulse" pIconLeftName="star" pRound />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Étiquettes avec bordures arrondies.',
      },
    },
  },
}

// Interactive test
export const InteractiveTest: Story = {
  render: (args) => ({
    components: { PTag },
    setup() {
      const handleClose = () => {
        alert('Tag fermé !')
      }
      return { args, handleClose }
    },
    template: `
      <div data-testid="tag-container">
        <PTag 
          v-bind="args" 
          data-testid="test-tag"
          pContent="Test Tag"
          pColor="info"
          pClosable
          @close="handleClose"
        />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Étiquette interactive avec gestion de l\'événement de fermeture.',
      },
    },
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => ({
    components: { PTag },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 16px;">Couleurs principales</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <PTag pContent="Défaut" pColor="" />
            <PTag pContent="Succès" pColor="success" />
            <PTag pContent="Avertissement" pColor="warning" />
            <PTag pContent="Danger" pColor="danger" />
            <PTag pContent="Info" pColor="info" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Couleurs personnalisées</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <PTag pContent="Persian" pColor="persian" />
            <PTag pContent="Fuschia" pColor="fuschia" />
            <PTag pContent="Cyan" pColor="cyan" />
            <PTag pContent="Amethyste" pColor="amethyste" />
            <PTag pContent="Blue Pulse" pColor="blue-pulse" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Effets</h3>
          <div style="display: flex; gap: 12px;">
            <PTag pContent="Light" pColor="info" />
            <PTag pContent="Dark" pColor="info" />
            <PTag pContent="Plain" pColor="info" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Tailles</h3>
          <div style="display: flex; align-items: center; gap: 12px;">
            <PTag pContent="Normal" pColor="info" pSize="default" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Avec icônes</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            <PTag pContent="Succès" pColor="success" pIconLeftName="check" />
            <PTag pContent="Info" pColor="info" pIconRightName="infoCircle" />
            <PTag pContent="Utilisateur" pColor="blue-pulse" pIconLeftName="person" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Options</h3>
          <div style="display: flex; flex-wrap: wrap; gap: 12px;">
            <PTag pContent="Arrondi" pColor="info" pRound />
            <PTag pContent="Fermable" pColor="warning" pClosable />
            <PTag pContent="Complet" pColor="success" pIconLeftName="check" pRound pClosable />
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Aperçu complet de toutes les variantes du composant PTag.',
      },
    },
  },
}
