import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PText from './PText.vue'
import { pulseGeneratedIcons } from '../PIcon/components/constants'

// Extract all icon names from pulseGeneratedIcons
const allIconNames = pulseGeneratedIcons.map(icon => icon.name)

const meta: Meta<typeof PText> = {
  title: 'Atoms/PText',
  component: PText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant de texte avec différents styles, icônes et états.',
      },
    },
  },
  argTypes: {
    pContent: {
      control: 'text',
      description: 'Contenu textuel à afficher',
    },
    pType: {
      control: 'select',
      options: ['primary', 'secondary', 'drag'],
      description: 'Type de style du composant',
    },
    pIconName: {
      control: 'select',
      options: [undefined, ...allIconNames],
      description: 'Nom de l\'icône à afficher',
    },
    pBold: {
      control: 'boolean',
      description: 'Texte en gras',
    },
    selected: {
      control: 'boolean',
      description: 'État sélectionné',
    },
    disabled: {
      control: 'boolean',
      description: 'État désactivé',
    },
    pIsUnderlinedOnHover: {
      control: 'boolean',
      description: 'Soulignement au survol',
    },
  },
  args: {
    pContent: 'Texte par défaut',
    pType: 'primary',
    pIconName: undefined,
    pBold: false,
    selected: false,
    disabled: false,
    pIsUnderlinedOnHover: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PText },
    setup() {
      return { args }
    },
    template: '<PText v-bind="args" />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Composant PText par défaut avec du texte simple.',
      },
    },
  },
}

// Different types
export const Types: Story = {
  render: () => ({
    components: { PText },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 300px;">
        <PText pType="primary" pContent="Type primary - Texte principal" />
        <PText pType="secondary" pContent="Type secondary - Texte secondaire" />
        <PText pType="drag" pContent="Type drag - Texte pour drag & drop" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents types de styles disponibles.',
      },
    },
  },
}

// With icons
export const WithIcons: Story = {
  render: () => ({
    components: { PText },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 300px;">
        <PText pType="primary" pIconName="house" pContent="Accueil" />
        <PText pType="primary" pIconName="person" pContent="Profil utilisateur" />
        <PText pType="secondary" pIconName="gear" pContent="Paramètres" />
        <PText pType="secondary" pIconName="bell" pContent="Notifications" />
        <PText pType="drag" pIconName="folder" pContent="Dossier à déplacer" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Composants PText avec différentes icônes.',
      },
    },
  },
}

// Different states
export const States: Story = {
  render: () => ({
    components: { PText },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 300px;">
        <PText pType="primary" pContent="État normal" />
        <PText pType="primary" pContent="État sélectionné" :selected="true" />
        <PText pType="primary" pContent="État désactivé" :disabled="true" />
        <PText pType="secondary" pContent="Secondaire normal" />
        <PText pType="secondary" pContent="Secondaire sélectionné" :selected="true" />
        <PText pType="secondary" pContent="Secondaire désactivé" :disabled="true" />
        <PText pType="drag" pContent="Drag normal" />
        <PText pType="drag" pContent="Drag désactivé" :disabled="true" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents états du composant : normal, sélectionné, désactivé.',
      },
    },
  },
}

// Text formatting
export const TextFormatting: Story = {
  render: () => ({
    components: { PText },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 400px;">
        <PText pType="primary" pContent="Texte normal" />
        <PText pType="primary" pContent="Texte en gras" :pBold="true" />
        <PText pType="primary" pContent="Texte avec soulignement au survol" :pIsUnderlinedOnHover="true" />
        <PText pType="primary" pContent="Gras + soulignement" :pBold="true" :pIsUnderlinedOnHover="true" />
        <PText pType="primary" pContent="Texte très long qui sera tronqué avec des points de suspension pour montrer le comportement overflow" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Options de formatage du texte et gestion de l\'overflow.',
      },
    },
  },
}

// Interactive examples
export const Interactive: Story = {
  render: () => ({
    components: { PText },
    template: `
      <div style="display: flex; flex-direction: column; gap: 8px; width: 300px;">
        <PText 
          pType="primary" 
          pIconName="search" 
          pContent="Rechercher..." 
          :pIsUnderlinedOnHover="true"
          @p-text-content-clicked="handleClick('Recherche')"
        />
        <PText 
          pType="secondary" 
          pIconName="gear" 
          pContent="Paramètres" 
          :pIsUnderlinedOnHover="true"
          @p-text-content-clicked="handleClick('Paramètres')"
        />
        <PText 
          pType="primary" 
          pIconName="star" 
          pContent="Favoris" 
          :selected="true"
          @p-text-content-clicked="handleClick('Favoris')"
        />
      </div>
    `,
    methods: {
      handleClick(action: string) {
        alert(`Clic sur: ${action}`)
      },
    },
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemples interactifs avec gestion des clics.',
      },
    },
  },
}
