import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PTitle from './PTitle.vue'
import { pulseGeneratedIcons } from '../PIcon/components/constants'
import { AppColors } from '../../utils/AppColorsEnum'

const meta: Meta<typeof PTitle> = {
  title: 'Atoms/PTitle',
  component: PTitle,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant titre avec icône personnalisable.',
      },
    },
  },
  argTypes: {
    pTitle: {
      control: 'text',
      description: 'Texte du titre',
    },
    pIconName: {
      control: 'select',
      options: pulseGeneratedIcons.map(icon => icon.name),
      description: 'Nom de l\'icône à afficher',
    },
    pIconSize: {
      control: 'text',
      description: 'Taille de l\'icône',
    },
    pIconColor: {
      control: 'select',
      options: Object.values(AppColors),
      description: 'Couleur de l\'icône',
    },
  },
  args: {
    pTitle: 'Titre par défaut',
    pIconName: 'pulse',
    pIconSize: '28',
    pIconColor: AppColors.JUNGLE_400,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Titre par défaut avec icône Pulse.',
      },
    },
  },
}

// Different titles
export const DifferentTitles: Story = {
  render: () => ({
    components: { PTitle },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <PTitle pTitle="Tableau de bord" />
        <PTitle pTitle="Paramètres de compte" />
        <PTitle pTitle="Historique des transactions" />
        <PTitle pTitle="Notifications et alertes" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents exemples de titres.',
      },
    },
  },
}

// Different icons
export const DifferentIcons: Story = {
  render: () => ({
    components: { PTitle },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <PTitle pTitle="Accueil" pIconName="house" />
        <PTitle pTitle="Paramètres" pIconName="gear" />
        <PTitle pTitle="Utilisateurs" pIconName="person" />
        <PTitle pTitle="Statistiques" pIconName="barChart" />
        <PTitle pTitle="Notifications" pIconName="bell" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Titres avec différentes icônes.',
      },
    },
  },
}

// Different colors
export const DifferentColors: Story = {
  render: () => ({
    components: { PTitle },
    setup() {
      return { AppColors }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <PTitle pTitle="Couleur primaire" pIconName="pulse" :pIconColor="AppColors.JUNGLE_400" />
        <PTitle pTitle="Couleur secondaire" pIconName="pulse" :pIconColor="AppColors.BLACK_ROCK_900" />
        <PTitle pTitle="Couleur succès" pIconName="check" :pIconColor="AppColors.TEXT_SUCCESS" />
        <PTitle pTitle="Couleur avertissement" pIconName="exclamationTriangle" :pIconColor="AppColors.TEXT_WARNING" />
        <PTitle pTitle="Couleur erreur" pIconName="x" :pIconColor="AppColors.TEXT_ERROR" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Titres avec différentes couleurs d\'icônes.',
      },
    },
  },
}

// Real world examples
export const RealWorldExamples: Story = {
  render: () => ({
    components: { PTitle },
    setup() {
      return { AppColors }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <PTitle pTitle="Mon portefeuille" pIconName="wallet2" :pIconColor="AppColors.JUNGLE_400" />
          <p style="margin-top: 8px; color: #666;">Gérez vos comptes et transactions</p>
        </div>

        <div>
          <PTitle pTitle="Historique" pIconName="clockHistory" :pIconColor="AppColors.BLACK_ROCK_900" />
          <p style="margin-top: 8px; color: #666;">Consultez vos opérations passées</p>
        </div>

        <div>
          <PTitle pTitle="Alertes actives" pIconName="bell" :pIconColor="AppColors.TEXT_WARNING" pIconSize="24" />
          <p style="margin-top: 8px; color: #666;">3 nouvelles notifications</p>
        </div>

        <div>
          <PTitle pTitle="Support" pIconName="questionCircle" :pIconColor="AppColors.TEXT_INFORMATION_PRIMARY" />
          <p style="margin-top: 8px; color: #666;">Besoin d'aide ? Contactez-nous</p>
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
