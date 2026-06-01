import type { Meta, StoryObj } from '@storybook/vue3-vite'
import WorkspaceIntroWidget from './WorkspaceIntro.widget.vue'

const meta: Meta<typeof WorkspaceIntroWidget> = {
  title: 'Libraries/Widgets/Grid/WorkspaceIntro',
  component: WorkspaceIntroWidget,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Widget d\'accueil du prospect, affiche un bandeau de bienvenue RYDGE Conseil avec un call-to-action principal.',
      },
    },
  },
  argTypes: {
    tagText: {
      control: 'text',
      description: 'Texte du tag (par défaut résolu via i18n : widgets.workspaceIntro.tag).',
    },
    title: {
      control: 'text',
      description: 'Titre principal (par défaut résolu via i18n : widgets.workspaceIntro.title).',
    },
    description: {
      control: 'text',
      description: 'Paragraphe descriptif (par défaut résolu via i18n : widgets.workspaceIntro.description).',
    },
    primaryLabel: {
      control: 'text',
      description: 'Libellé du bouton primaire (par défaut widgets.workspaceIntro.primaryAction).',
    },
    'onWorkspace-intro-cta': {
      action: 'workspace-intro-cta',
      description: 'Émis au clic sur le bouton primaire.',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const render: Story['render'] = (args) => ({
  components: { WorkspaceIntroWidget },
  setup() {
    return { args }
  },
  template: `
    <div style="max-width: 815px;">
      <WorkspaceIntroWidget v-bind="args" />
    </div>
  `,
})

export const Default: Story = {
  render,
  parameters: {
    docs: {
      description: {
        story: 'Rendu par défaut, identique à la maquette Figma (textes issus de l\'i18n fr-FR).',
      },
    },
  },
}

export const LongContent: Story = {
  render,
  args: {
    title: 'Bienvenue dans votre espace RYDGE Conseil — un titre volontairement très long pour valider le comportement du wrap multi-ligne',
    description: 'Ceci est une description particulièrement longue qui sert à vérifier que le widget conserve un rendu correct quand le contenu dépasse la hauteur attendue : le bouton doit descendre proprement sous le texte.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Contenu textuel volumineux pour valider le wrap du titre et de la description.',
      },
    },
  },
}

export const CustomLabels: Story = {
  render,
  args: {
    tagText: 'Onboarding premium',
    title: 'Démarrez votre accompagnement sur-mesure',
    description: 'Configuration personnalisée des libellés via les props dédiées.',
    primaryLabel: 'Configurer mon profil',
  },
  parameters: {
    docs: {
      description: {
        story: 'Les quatre props textuelles permettent de surcharger les valeurs par défaut issues de l\'i18n.',
      },
    },
  },
}
