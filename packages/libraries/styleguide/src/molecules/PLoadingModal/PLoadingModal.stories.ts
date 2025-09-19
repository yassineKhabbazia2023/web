import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PLoadingModal from './PLoadingModal.vue'
import PButton from '../../atoms/PButton'

const meta: Meta<typeof PLoadingModal> = {
  title: 'Molecules/PLoadingModal',
  component: PLoadingModal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Modale de chargement non fermable avec loader centré. Utilisé pendant les opérations asynchrones.',
      },
    },
  },
  tags: ['!autodocs'],
  argTypes: {},
  args: {},
}

export default meta
type Story = StoryObj<typeof meta>

// Always visible story for documentation
export const AlwaysVisible: Story = {
  render: () => ({
    components: { PLoadingModal },
    template: '<PLoadingModal />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Modale de chargement toujours visible pour la documentation.',
      },
    },
  },
}

// Default story with trigger button
export const Default: Story = {
  render: () => ({
    components: { PLoadingModal, PButton },
    setup() {
      const showLoading = ref(false)

      const triggerLoading = async () => {
        showLoading.value = true
        // Simulate async operation
        await new Promise(resolve => setTimeout(resolve, 3000))
        showLoading.value = false
      }

      return { showLoading, triggerLoading }
    },
    template: `
      <div>
        <PButton
          pType="primary"
          @click="triggerLoading"
          :disabled="showLoading"
        >
          {{ showLoading ? 'Chargement en cours...' : 'Déclencher le chargement' }}
        </PButton>
        <PLoadingModal v-if="showLoading" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Utilisation typique avec un bouton qui déclenche un chargement de 3 secondes.',
      },
    },
  },
}

// With context story showing real usage scenario
export const WithContext: Story = {
  render: () => ({
    components: { PLoadingModal, PButton },
    setup() {
      const isLoading = ref(false)
      const message = ref('')

      const simulateAsyncAction = async (action: string, duration: number) => {
        isLoading.value = true
        message.value = `${action} en cours...`

        await new Promise(resolve => setTimeout(resolve, duration))

        isLoading.value = false
        message.value = `${action} terminé !`

        // Clear message after 2 seconds
        setTimeout(() => {
          message.value = ''
        }, 2000)
      }

      return { isLoading, message, simulateAsyncAction }
    },
    template: `
      <div style="text-align: center;">
        <div style="margin-bottom: 16px; display: flex; gap: 12px; justify-content: center;">
          <PButton
            pType="primary"
            @click="simulateAsyncAction('Sauvegarde', 2000)"
            :disabled="isLoading"
          >
            Sauvegarder
          </PButton>
          <PButton
            pType="default"
            @click="simulateAsyncAction('Chargement des données', 4000)"
            :disabled="isLoading"
          >
            Charger les données
          </PButton>
          <PButton
            pType="success"
            @click="simulateAsyncAction('Envoi', 1500)"
            :disabled="isLoading"
          >
            Envoyer
          </PButton>
        </div>

        <div v-if="message" style="margin-top: 16px; padding: 8px; background: #f5f5f5; border-radius: 4px;">
          {{ message }}
        </div>

        <PLoadingModal v-if="isLoading" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Exemple d\'utilisation dans un contexte réel avec différentes actions asynchrones.',
      },
    },
  },
}
