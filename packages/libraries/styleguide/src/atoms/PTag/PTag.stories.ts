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
        'blue-pulse',
        'blue',
        'danger',
        'dark-blue',
        'dark-green',
        'disabled',
        'gray',
        'green',
        'info',
        'light-blue',
        'light-gray',
        'light-green',
        'lighter-gray',
        'orange',
        'outline-green',
        'persian',
        'purple',
        'red',
        'success',
        'tranquil',
        'warning',
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
      <h4 style="margin: 16px 0;">Couleurs fonctionnelles :</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <PTag pContent="Succès" pColor="success" />
        <PTag pContent="Avertissement" pColor="warning" />
        <PTag pContent="Danger" pColor="danger" />
        <PTag pContent="Info" pColor="info" />
        <PTag pContent="Disabled" pColor="disabled" />
      </div>
      <h4 style="margin: 16px 0;">Couleurs disponibles :</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
        <PTag pContent="Red" pColor="red" />
        <PTag pContent="Orange" pColor="orange" />
        <PTag pContent="Défaut" pColor="" />
        <PTag pContent="Light-Green" pColor="light-green" />
        <PTag pContent="Green" pColor="green" />
        <PTag pContent="Dark-Green" pColor="dark-green" />
        <PTag pContent="Outline-Green" pColor="outline-green" />
        <PTag pContent="Tranquil" pColor="tranquil" />
        <PTag pContent="Light-Blue" pColor="light-blue" />
        <PTag pContent="Blue" pColor="blue" />
        <PTag pContent="Dark-Blue" pColor="dark-blue" />
        <PTag pContent="Purple" pColor="purple" />
        <PTag pContent="Lighter-Gray" pColor="lighter-gray" />
        <PTag pContent="Light-Gray" pColor="light-gray" />
        <PTag pContent="Gray" pColor="gray" />
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
