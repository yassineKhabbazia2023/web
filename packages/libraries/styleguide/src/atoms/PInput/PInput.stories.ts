import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PInput from './PInput.vue'

const meta: Meta<typeof PInput> = {
  title: 'Atoms/PInput',
  component: PInput,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant de champ de saisie basé sur Element Plus avec fonctionnalités étendues.',
      },
    },
  },
  argTypes: {
    pType: {
      control: 'select',
      options: ['text', 'password', 'email', 'number', 'tel', 'url', 'textarea'],
      description: 'Type du champ de saisie',
    },
    pSize: {
      control: 'select',
      options: ['default', 'small'],
      description: 'Taille du champ',
    },
    pPlaceholder: {
      control: 'text',
      description: 'Texte d\'aide affiché dans le champ',
    },
    pDisabled: {
      control: 'boolean',
      description: 'Désactive le champ',
    },
    pClearable: {
      control: 'boolean',
      description: 'Affiche un bouton pour vider le champ',
    },
    pShowPassword: {
      control: 'boolean',
      description: 'Affiche un bouton pour révéler/masquer le mot de passe',
    },
    pReadonly: {
      control: 'boolean',
      description: 'Rend le champ en lecture seule',
    },
    pMaxlength: {
      control: 'number',
      description: 'Nombre maximum de caractères',
    },
    pShowWordLimit: {
      control: 'boolean',
      description: 'Affiche le compteur de caractères',
    },
  },
  args: {
    pType: 'text',
    pSize: 'default',
    pPlaceholder: 'Saisissez votre texte...',
    pDisabled: false,
    pClearable: false,
    pShowPassword: false,
    pReadonly: false,
    pMaxlength: undefined,
    pShowWordLimit: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PInput },
    setup() {
      const value = ref('')
      return { args, value }
    },
    template: '<PInput v-bind="args" v-model="value" />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Champ de saisie par défaut.',
      },
    },
  },
}

// Different types
export const Types: Story = {
  render: () => ({
    components: { PInput },
    setup() {
      const textValue = ref('')
      const emailValue = ref('')
      const passwordValue = ref('')
      const numberValue = ref('')
      return { textValue, emailValue, passwordValue, numberValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
        <PInput v-model="textValue" pType="text" pPlaceholder="Texte" />
        <PInput v-model="emailValue" pType="email" pPlaceholder="Email" />
        <PInput v-model="passwordValue" pType="password" pPlaceholder="Mot de passe" pShowPassword />
        <PInput v-model="numberValue" pType="number" pPlaceholder="Nombre" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents types de champs : texte, email, mot de passe, nombre.',
      },
    },
  },
}

// Different sizes
export const Sizes: Story = {
  render: () => ({
    components: { PInput },
    setup() {
      const value1 = ref('')
      const value2 = ref('')
      const value3 = ref('')
      return { value1, value2, value3 }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
        <PInput v-model="value1" pSize="small" pPlaceholder="Petite taille" />
        <PInput v-model="value2" pSize="default" pPlaceholder="Taille par défaut" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différentes tailles de champs : small, default.',
      },
    },
  },
}

// States
export const States: Story = {
  render: () => ({
    components: { PInput },
    setup() {
      const normalValue = ref('')
      const disabledValue = ref('Champ désactivé')
      const readonlyValue = ref('Champ en lecture seule')
      const clearableValue = ref('Texte effaçable')
      return { normalValue, disabledValue, readonlyValue, clearableValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; width: 300px;">
        <PInput v-model="normalValue" pPlaceholder="Normal" />
        <PInput v-model="disabledValue" pDisabled pPlaceholder="Désactivé" />
        <PInput v-model="readonlyValue" pReadonly pPlaceholder="Lecture seule" />
        <PInput v-model="clearableValue" pClearable pPlaceholder="Effaçable" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents états : normal, désactivé, lecture seule, effaçable.',
      },
    },
  },
}

// With character limit
export const WithCharacterLimit: Story = {
  render: () => ({
    components: { PInput },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div style="width: 300px;">
        <PInput 
          v-model="value" 
          :pMaxlength="50" 
          pShowWordLimit 
          pPlaceholder="Maximum 50 caractères"
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Champ avec limite de caractères et compteur.',
      },
    },
  },
}

// Textarea
export const Textarea: Story = {
  render: () => ({
    components: { PInput },
    setup() {
      const value = ref('')
      return { value }
    },
    template: `
      <div style="width: 300px;">
        <PInput 
          v-model="value" 
          pType="textarea" 
          :pRows="4"
          pPlaceholder="Saisissez votre message..."
        />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Zone de texte multiligne.',
      },
    },
  },
}

// All variants showcase
export const AllVariants: Story = {
  render: () => ({
    components: { PInput },
    setup() {
      const values = ref({
        text: '',
        email: '',
        password: '',
        disabled: 'Désactivé',
        readonly: 'Lecture seule',
        clearable: 'Effaçable',
        limited: '',
        textarea: '',
      })
      return { values }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px; max-width: 600px;">
        <div>
          <h3 style="margin-bottom: 16px;">Types</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <PInput v-model="values.text" pType="text" pPlaceholder="Texte" />
            <PInput v-model="values.email" pType="email" pPlaceholder="Email" />
            <PInput v-model="values.password" pType="password" pPlaceholder="Mot de passe" pShowPassword />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Tailles</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <PInput v-model="values.text" pSize="small" pPlaceholder="Petit" />
            <PInput v-model="values.text" pSize="default" pPlaceholder="Normal" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">États</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <PInput v-model="values.disabled" pDisabled />
            <PInput v-model="values.readonly" pReadonly />
            <PInput v-model="values.clearable" pClearable />
            <PInput v-model="values.limited" :pMaxlength="20" pShowWordLimit pPlaceholder="Max 20 caractères" />
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Textarea</h3>
          <PInput v-model="values.textarea" pType="textarea" :pRows="3" pPlaceholder="Zone de texte" />
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Aperçu complet de toutes les variantes du composant PInput.',
      },
    },
  },
}
