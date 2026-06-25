import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PAlert from './PAlert.vue'

const meta: Meta<typeof PAlert> = {
  title: 'Atoms/PAlert',
  component: PAlert,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Composant d\'alerte avec différents types de messages et option de fermeture.',
      },
    },
  },
  argTypes: {
    pType: {
      control: 'select',
      options: ['main', 'success', 'warning', 'danger', 'information'],
      description: 'Type d\'alerte qui détermine la couleur et l\'icône',
    },
    pIconName: {
      control: 'select',
      options: [
        undefined,
        'infoCircle',
        'checkCircle',
        'exclamationTriangle',
        'xCircle',
        'lock',
        'bell',
        'star',
        'shield',
      ],
      description: 'Icône personnalisée qui remplace celle du type (optionnel)',
    },
    pIconSize: {
      control: 'text',
      description: 'Taille de l\'icône en pixels (16 par défaut)',
    },
    pClosable: {
      control: 'boolean',
      description: 'Afficher le bouton de fermeture',
    },
  },
  args: {
    pType: 'main',
    pIconName: undefined,
    pIconSize: '16',
    pClosable: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PAlert },
    setup() {
      return { args }
    },
    template: `
      <PAlert v-bind="args">
        Message d'alerte par défaut avec informations importantes.
      </PAlert>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Alerte par défaut avec le type "main".',
      },
    },
  },
}

// Alert types
export const AlertTypes: Story = {
  render: () => ({
    components: { PAlert },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <PAlert pType="main">
          <template #bold-text>Information :</template>
          Voici un message d'information standard.
        </PAlert>
        
        <PAlert pType="success">
          <template #bold-text>Succès :</template>
          L'opération s'est déroulée avec succès !
        </PAlert>
        
        <PAlert pType="warning">
          <template #bold-text>Attention :</template>
          Veuillez vérifier les informations saisies.
        </PAlert>
        
        <PAlert pType="danger">
          <template #bold-text>Erreur :</template>
          Une erreur est survenue lors du traitement.
        </PAlert>
        
        <PAlert pType="information">
          <template #bold-text>Info :</template>
          Cette fonctionnalité sera bientôt disponible.
        </PAlert>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents types d\'alertes avec leurs couleurs et icônes respectives.',
      },
    },
  },
}

// Custom icon
export const CustomIcon: Story = {
  render: () => ({
    components: { PAlert },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <PAlert pType="success" pIconName="lock">
          <template #bold-text>Compte sécurisé :</template>
          Une icône explicite remplace celle du type (ici un cadenas sur une alerte de succès).
        </PAlert>

        <PAlert pType="main" pIconName="bell">
          <template #bold-text>Notification :</template>
          Vous avez de nouvelles notifications à consulter.
        </PAlert>

        <PAlert pType="information" pIconName="star">
          <template #bold-text>Nouveauté :</template>
          Découvrez les dernières fonctionnalités mises à votre disposition.
        </PAlert>

        <PAlert pType="warning" pIconName="shield">
          <template #bold-text>Protection :</template>
          Activez la protection renforcée pour sécuriser votre compte.
        </PAlert>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'L\'icône fournie via `pIconName` remplace toujours celle déterminée par le type d\'alerte.',
      },
    },
  },
}

// Icon sizes
export const IconSizes: Story = {
  render: () => ({
    components: { PAlert },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <PAlert pType="information" pIconSize="16">
          <template #bold-text>16px :</template>
          Taille d'icône par défaut.
        </PAlert>

        <PAlert pType="information" pIconSize="24">
          <template #bold-text>24px :</template>
          Icône agrandie pour plus de visibilité.
        </PAlert>

        <PAlert pType="information" pIconSize="32">
          <template #bold-text>32px :</template>
          Grande icône pour les messages mis en avant.
        </PAlert>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'La taille de l\'icône est configurable via `pIconSize` (16px par défaut).',
      },
    },
  },
}

// Closable alerts
export const ClosableAlerts: Story = {
  render: () => ({
    components: { PAlert },
    setup() {
      const alerts = ref({
        success: true,
        warning: true,
        danger: true,
      })

      const closeAlert = (type: keyof typeof alerts.value) => {
        alerts.value[type] = false
      }

      const resetAlerts = () => {
        alerts.value.success = true
        alerts.value.warning = true
        alerts.value.danger = true
      }

      return { alerts, closeAlert, resetAlerts }
    },
    template: `
      <div>
        <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px;">
          <PAlert 
            v-if="alerts.success"
            pType="success" 
            pClosable
            @close="closeAlert('success')"
          >
            <template #bold-text>Succès :</template>
            Cette alerte peut être fermée en cliquant sur le X.
          </PAlert>
          
          <PAlert 
            v-if="alerts.warning"
            pType="warning" 
            pClosable
            @close="closeAlert('warning')"
          >
            <template #bold-text>Attention :</template>
            Message d'avertissement fermable.
          </PAlert>
          
          <PAlert 
            v-if="alerts.danger"
            pType="danger" 
            pClosable
            @close="closeAlert('danger')"
          >
            <template #bold-text>Erreur :</template>
            Alerte d'erreur que l'utilisateur peut fermer.
          </PAlert>
          
          <div v-if="!alerts.success && !alerts.warning && !alerts.danger" 
               style="padding: 20px; text-align: center; background: #f5f5f5; border-radius: 4px;">
            Toutes les alertes ont été fermées.
          </div>
        </div>
        
        <button 
          @click="resetAlerts"
          style="padding: 8px 16px; background: #409EFF; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Réafficher toutes les alertes
        </button>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Alertes avec bouton de fermeture et gestion des événements.',
      },
    },
  },
}

// Long content
export const LongContent: Story = {
  render: () => ({
    components: { PAlert },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <PAlert pType="information" pClosable>
          <template #bold-text>Information détaillée :</template>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </PAlert>
        
        <PAlert pType="warning">
          <template #bold-text>Avertissement important :</template>
          Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. 
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, 
          totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </PAlert>
        
        <PAlert pType="danger">
          <template #bold-text>Erreur critique :</template>
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
          <br><br>
          <strong>Actions recommandées :</strong>
          <ul style="margin: 8px 0 0 20px;">
            <li>Vérifiez votre connexion réseau</li>
            <li>Contactez l'administrateur système</li>
            <li>Réessayez dans quelques minutes</li>
          </ul>
        </PAlert>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Alertes avec contenu long et formatage complexe.',
      },
    },
  },
}

// Usage examples
export const UsageExamples: Story = {
  render: () => ({
    components: { PAlert },
    setup() {
      const formAlert = ref(false)
      const networkAlert = ref(false)

      const showFormAlert = () => {
        formAlert.value = true
        setTimeout(() => {
          formAlert.value = false
        }, 3000)
      }

      const toggleNetworkAlert = () => {
        networkAlert.value = !networkAlert.value
      }

      return {
        formAlert,
        networkAlert,
        showFormAlert,
        toggleNetworkAlert,
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div>
          <h4 style="margin-bottom: 12px;">Validation de formulaire</h4>
          <div style="margin-bottom: 12px;">
            <button 
              @click="showFormAlert"
              style="padding: 8px 16px; background: #67C23A; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              Simuler validation réussie
            </button>
          </div>
          <PAlert 
            v-if="formAlert"
            pType="success" 
            pClosable
            @close="formAlert = false"
          >
            <template #bold-text>Formulaire validé :</template>
            Vos données ont été enregistrées avec succès.
          </PAlert>
        </div>
        
        <div>
          <h4 style="margin-bottom: 12px;">Statut de connexion</h4>
          <div style="margin-bottom: 12px;">
            <button 
              @click="toggleNetworkAlert"
              style="padding: 8px 16px; background: #E6A23C; color: white; border: none; border-radius: 4px; cursor: pointer;"
            >
              {{ networkAlert ? 'Résoudre' : 'Simuler' }} problème réseau
            </button>
          </div>
          <PAlert 
            v-if="networkAlert"
            pType="warning"
          >
            <template #bold-text>Connexion instable :</template>
            Votre connexion réseau semble instable. Certaines fonctionnalités peuvent être limitées.
          </PAlert>
        </div>
        
        <div>
          <h4 style="margin-bottom: 12px;">Messages système</h4>
          <PAlert pType="information">
            <template #bold-text>Maintenance programmée :</template>
            Une maintenance est prévue le 15 décembre de 02h00 à 04h00. 
            Les services pourraient être temporairement indisponibles.
          </PAlert>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemples d\'utilisation pratiques des alertes dans une interface.',
      },
    },
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => ({
    components: { PAlert },
    setup() {
      const showClosable = ref(true)

      return { showClosable }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 16px;">Types d'alertes</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <PAlert pType="main">Message informatif standard</PAlert>
            <PAlert pType="success">Message de succès</PAlert>
            <PAlert pType="warning">Message d'avertissement</PAlert>
            <PAlert pType="danger">Message d'erreur</PAlert>
            <PAlert pType="information">Message d'information</PAlert>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Avec contenu enrichi</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <PAlert pType="success" pClosable>
              <template #bold-text>Opération réussie :</template>
              Votre demande a été traitée avec succès.
            </PAlert>
            
            <PAlert pType="warning">
              <template #bold-text>Configuration requise :</template>
              Veuillez configurer vos paramètres avant de continuer.
            </PAlert>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Alertes fermables</h3>
          <PAlert 
            v-if="showClosable"
            pType="information" 
            pClosable
            @close="showClosable = false"
          >
            <template #bold-text>Astuce :</template>
            Cette alerte peut être fermée en cliquant sur le bouton X.
          </PAlert>
          <button 
            v-if="!showClosable"
            @click="showClosable = true"
            style="padding: 6px 12px; background: #409EFF; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;"
          >
            Réafficher l'alerte
          </button>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Aperçu complet de toutes les variantes du composant PAlert.',
      },
    },
  },
}
