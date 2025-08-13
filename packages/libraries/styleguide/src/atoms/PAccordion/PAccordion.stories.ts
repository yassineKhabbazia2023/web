import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PAccordion from './PAccordion.vue'

const meta: Meta<typeof PAccordion> = {
  title: 'Atoms/PAccordion',
  component: PAccordion,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Composant d\'accordéon avec en-tête cliquable et contenu repliable.',
      },
    },
  },
  argTypes: {
    pIsOpen: {
      control: 'boolean',
      description: 'État d\'ouverture de l\'accordéon',
    },
    pHasHeader: {
      control: 'boolean',
      description: 'Afficher l\'en-tête cliquable',
    },
    pHeaderCssClass: {
      control: 'text',
      description: 'Classes CSS personnalisées pour l\'en-tête',
    },
  },
  args: {
    pIsOpen: false,
    pHasHeader: true,
    pHeaderCssClass: '',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PAccordion },
    setup() {
      const isOpen = ref(args.pIsOpen)

      const handleOpen = () => {
        isOpen.value = true
      }

      const handleClose = () => {
        isOpen.value = false
      }

      return {
        args,
        isOpen,
        handleOpen,
        handleClose,
      }
    },
    template: `
      <PAccordion 
        v-bind="args"
        :pIsOpen="isOpen"
        @open="handleOpen"
        @close="handleClose"
      >
        <template #header>
          <h3 style="margin: 0; padding: 12px;">Section Accordéon</h3>
        </template>
        <div style="padding: 16px; background: #f9f9f9; border-top: 1px solid #e0e0e0;">
          <p>Contenu de l'accordéon qui peut être affiché ou masqué.</p>
          <p>Ce contenu est visible uniquement lorsque l'accordéon est ouvert.</p>
        </div>
      </PAccordion>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Accordéon par défaut avec en-tête cliquable et contenu repliable.',
      },
    },
  },
}

// Open state
export const OpenState: Story = {
  render: () => ({
    components: { PAccordion },
    setup() {
      const isOpen = ref(true)

      const handleOpen = () => {
        isOpen.value = true
      }

      const handleClose = () => {
        isOpen.value = false
      }

      return {
        isOpen,
        handleOpen,
        handleClose,
      }
    },
    template: `
      <PAccordion 
        :pIsOpen="isOpen"
        @open="handleOpen"
        @close="handleClose"
      >
        <template #header>
          <h3 style="margin: 0; padding: 12px;">Accordéon Ouvert</h3>
        </template>
        <div style="padding: 16px; background: #f0f8ff; border-top: 1px solid #b0d4f1;">
          <h4>Contenu visible</h4>
          <p>Cet accordéon est ouvert par défaut pour montrer le contenu déployé.</p>
          <ul>
            <li>Élément de liste 1</li>
            <li>Élément de liste 2</li>
            <li>Élément de liste 3</li>
          </ul>
        </div>
      </PAccordion>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Accordéon affiché dans son état ouvert.',
      },
    },
  },
}

// Without header
export const WithoutHeader: Story = {
  render: () => ({
    components: { PAccordion },
    setup() {
      const isOpen = ref(true)

      return { isOpen }
    },
    template: `
      <div>
        <p style="margin-bottom: 16px;">Accordéon sans en-tête (toujours visible) :</p>
        <PAccordion 
          :pIsOpen="isOpen"
          :pHasHeader="false"
        >
          <div style="padding: 16px; background: #fff3cd; border: 1px solid #ffeaa7;">
            <h4>Contenu toujours visible</h4>
            <p>Ce contenu est affiché en permanence car l'accordéon n'a pas d'en-tête interactif.</p>
          </div>
        </PAccordion>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Accordéon sans en-tête, utilisé comme simple conteneur.',
      },
    },
  },
}

// Custom header styles
export const CustomHeaderStyles: Story = {
  render: () => ({
    components: { PAccordion },
    setup() {
      const isOpen1 = ref(false)
      const isOpen2 = ref(false)
      const isOpen3 = ref(false)

      const handleOpen1 = () => {
        isOpen1.value = true
      }
      const handleClose1 = () => {
        isOpen1.value = false
      }
      const handleOpen2 = () => {
        isOpen2.value = true
      }
      const handleClose2 = () => {
        isOpen2.value = false
      }
      const handleOpen3 = () => {
        isOpen3.value = true
      }
      const handleClose3 = () => {
        isOpen3.value = false
      }

      return {
        isOpen1,
        isOpen2,
        isOpen3,
        handleOpen1,
        handleClose1,
        handleOpen2,
        handleClose2,
        handleOpen3,
        handleClose3,
      }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <PAccordion 
          :pIsOpen="isOpen1"
          pHeaderCssClass="background--primary color--white padding--12"
          @open="handleOpen1"
          @close="handleClose1"
        >
          <template #header>
            <h3 style="margin: 0;">En-tête Primary</h3>
          </template>
          <div style="padding: 16px; background: #e3f2fd;">
            <p>Contenu avec en-tête de couleur primary.</p>
          </div>
        </PAccordion>
        
        <PAccordion 
          :pIsOpen="isOpen2"
          pHeaderCssClass="background--success color--white padding--12"
          @open="handleOpen2"
          @close="handleClose2"
        >
          <template #header>
            <h3 style="margin: 0;">En-tête Success</h3>
          </template>
          <div style="padding: 16px; background: #e8f5e8;">
            <p>Contenu avec en-tête de couleur success.</p>
          </div>
        </PAccordion>
        
        <PAccordion 
          :pIsOpen="isOpen3"
          pHeaderCssClass="background--warning color--dark padding--12"
          @open="handleOpen3"
          @close="handleClose3"
        >
          <template #header>
            <h3 style="margin: 0;">En-tête Warning</h3>
          </template>
          <div style="padding: 16px; background: #fff8e1;">
            <p>Contenu avec en-tête de couleur warning.</p>
          </div>
        </PAccordion>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Accordéons avec différents styles d\'en-tête personnalisés.',
      },
    },
  },
}

// Multiple accordions
export const MultipleAccordions: Story = {
  render: () => ({
    components: { PAccordion },
    setup() {
      const openStates = ref({
        faq1: false,
        faq2: false,
        faq3: false,
        faq4: false,
      })

      const toggle = (key: keyof typeof openStates.value) => {
        openStates.value[key] = !openStates.value[key]
      }

      return { openStates, toggle }
    },
    template: `
      <div style="max-width: 600px;">
        <h3 style="margin-bottom: 20px;">Questions Fréquentes</h3>
        
        <div style="border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <PAccordion 
            :pIsOpen="openStates.faq1"
            pHeaderCssClass="padding--16 border-bottom--1 border-color--light"
            @open="() => toggle('faq1')"
            @close="() => toggle('faq1')"
          >
            <template #header>
              <h4 style="margin: 0;">Comment utiliser ce composant ?</h4>
            </template>
            <div style="padding: 16px; background: #fafafa;">
              <p>Ce composant s'utilise en passant les props nécessaires et en gérant les événements d'ouverture et de fermeture.</p>
              <code style="background: #f0f0f0; padding: 4px; border-radius: 4px;">
                &lt;PAccordion :pIsOpen="isOpen" @open="handleOpen" @close="handleClose"&gt;
              </code>
            </div>
          </PAccordion>
          
          <PAccordion 
            :pIsOpen="openStates.faq2"
            pHeaderCssClass="padding--16 border-bottom--1 border-color--light"
            @open="() => toggle('faq2')"
            @close="() => toggle('faq2')"
          >
            <template #header>
              <h4 style="margin: 0;">Quelles sont les props disponibles ?</h4>
            </template>
            <div style="padding: 16px; background: #fafafa;">
              <ul>
                <li><strong>pIsOpen</strong> : État d'ouverture (boolean)</li>
                <li><strong>pHasHeader</strong> : Afficher l'en-tête (boolean, optionnel)</li>
                <li><strong>pHeaderCssClass</strong> : Classes CSS pour l'en-tête (string, optionnel)</li>
              </ul>
            </div>
          </PAccordion>
          
          <PAccordion 
            :pIsOpen="openStates.faq3"
            pHeaderCssClass="padding--16 border-bottom--1 border-color--light"
            @open="() => toggle('faq3')"
            @close="() => toggle('faq3')"
          >
            <template #header>
              <h4 style="margin: 0;">Comment personnaliser l'apparence ?</h4>
            </template>
            <div style="padding: 16px; background: #fafafa;">
              <p>Vous pouvez utiliser la prop <code>pHeaderCssClass</code> pour ajouter des classes CSS personnalisées à l'en-tête.</p>
              <p>Le contenu peut être stylisé directement dans le slot par défaut.</p>
            </div>
          </PAccordion>
          
          <PAccordion 
            :pIsOpen="openStates.faq4"
            pHeaderCssClass="padding--16"
            @open="() => toggle('faq4')"
            @close="() => toggle('faq4')"
          >
            <template #header>
              <h4 style="margin: 0;">Quels événements sont émis ?</h4>
            </template>
            <div style="padding: 16px; background: #fafafa;">
              <ul>
                <li><strong>@open</strong> : Émis lors de l'ouverture de l'accordéon</li>
                <li><strong>@close</strong> : Émis lors de la fermeture de l'accordéon</li>
              </ul>
            </div>
          </PAccordion>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemple d\'utilisation avec plusieurs accordéons en FAQ.',
      },
    },
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => ({
    components: { PAccordion },
    setup() {
      const states = ref({
        basic: false,
        opened: true,
        styled: false,
        noHeader: true,
      })

      const toggle = (key: keyof typeof states.value) => {
        states.value[key] = !states.value[key]
      }

      return { states, toggle }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 16px;">États de base</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <PAccordion 
              :pIsOpen="states.basic"
              @open="() => toggle('basic')"
              @close="() => toggle('basic')"
            >
              <template #header>
                <span style="padding: 8px;">Accordéon fermé</span>
              </template>
              <div style="padding: 12px; background: #f5f5f5;">
                Contenu caché par défaut
              </div>
            </PAccordion>
            
            <PAccordion 
              :pIsOpen="states.opened"
              @open="() => toggle('opened')"
              @close="() => toggle('opened')"
            >
              <template #header>
                <span style="padding: 8px;">Accordéon ouvert</span>
              </template>
              <div style="padding: 12px; background: #f5f5f5;">
                Contenu visible par défaut
              </div>
            </PAccordion>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Variantes de style</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <PAccordion 
              :pIsOpen="states.styled"
              pHeaderCssClass="background--primary color--white padding--12 border-radius--4"
              @open="() => toggle('styled')"
              @close="() => toggle('styled')"
            >
              <template #header>
                <span>En-tête stylisé</span>
              </template>
              <div style="padding: 12px; background: #e3f2fd; border: 1px solid #1976d2;">
                Contenu avec style coordonné
              </div>
            </PAccordion>
            
            <PAccordion 
              :pIsOpen="states.noHeader"
              :pHasHeader="false"
            >
              <div style="padding: 12px; background: #fff3e0; border: 1px solid #f57c00;">
                Accordéon sans en-tête (toujours visible)
              </div>
            </PAccordion>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Aperçu complet de toutes les variantes du composant PAccordion.',
      },
    },
  },
}
