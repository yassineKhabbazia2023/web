import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PRadio from './PRadio.vue'
import { ref } from 'vue'

const meta: Meta<typeof PRadio> = {
  title: 'Atoms/PRadio',
  component: PRadio,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant radio button basé sur Element Plus avec personnalisation.',
      },
    },
  },
  argTypes: {
    pLabel: {
      control: 'text',
      description: 'Valeur du radio button',
    },
    pDisabled: {
      control: 'boolean',
      description: 'État désactivé du radio button',
    },
    pName: {
      control: 'text',
      description: 'Nom du groupe de radio buttons',
    },
  },
  args: {
    pLabel: 'option1',
    pDisabled: false,
    pBorder: false,
    pSize: 'default',
    pName: undefined,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PRadio },
    setup() {
      const radioValue = ref('option1')
      return { args, radioValue }
    },
    template: '<PRadio v-bind="args" v-model="radioValue">Option par défaut</PRadio>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Radio button par défaut avec du texte dans le slot.',
      },
    },
  },
}

// Radio group
export const RadioGroup: Story = {
  render: () => ({
    components: { PRadio },
    setup() {
      const selectedValue = ref('option2')
      return { selectedValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <h3>Choisissez une option :</h3>
        <PRadio pLabel="option1" v-model="selectedValue" pName="example-group">
          Option 1 - Basique
        </PRadio>
        <PRadio pLabel="option2" v-model="selectedValue" pName="example-group">
          Option 2 - Standard (sélectionnée)
        </PRadio>
        <PRadio pLabel="option3" v-model="selectedValue" pName="example-group">
          Option 3 - Premium
        </PRadio>
        <PRadio pLabel="option4" v-model="selectedValue" pName="example-group" :pDisabled="true">
          Option 4 - Indisponible
        </PRadio>
        <p style="margin-top: 16px; color: #666;">
          Valeur sélectionnée : {{ selectedValue }}
        </p>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Groupe de radio buttons avec une valeur pré-sélectionnée.',
      },
    },
  },
}

// States
export const States: Story = {
  render: () => ({
    components: { PRadio },
    setup() {
      const stateValue = ref('selected')
      const disabledSelectedValue = ref('disabled-selected')
      return { stateValue, disabledSelectedValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <h3>Différents états :</h3>
        <PRadio pLabel="unselected" v-model="stateValue" pName="state-group">
          Non sélectionné
        </PRadio>
        <PRadio pLabel="selected" v-model="stateValue" pName="state-group">
          Sélectionné
        </PRadio>
        <PRadio pLabel="disabled-unselected" v-model="stateValue" :pDisabled="true" pName="state-group">
          Désactivé non sélectionné
        </PRadio>
        <PRadio pLabel="disabled-selected" v-model="disabledSelectedValue" :pDisabled="true" pName="state-group-disabled">
          Désactivé sélectionné
        </PRadio>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents états des radio buttons : normal, sélectionné, désactivé.',
      },
    },
  },
}

// Real world examples
export const RealWorldExamples: Story = {
  render: () => ({
    components: { PRadio },
    setup() {
      const paymentMethod = ref('card')
      const deliveryOption = ref('standard')
      const newsletter = ref('monthly')
      return { paymentMethod, deliveryOption, newsletter }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 32px;">
        <div>
          <h3 style="margin-bottom: 16px;">Fréquence newsletter</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <PRadio 
              pLabel="weekly" 
              v-model="newsletter" 
              pName="newsletter"
            >
              Hebdomadaire
            </PRadio>
            <PRadio 
              pLabel="monthly" 
              v-model="newsletter" 
              pName="newsletter"
            >
              Mensuelle
            </PRadio>
            <PRadio 
              pLabel="never" 
              v-model="newsletter" 
              pName="newsletter"
            >
              Jamais
            </PRadio>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemples d\'utilisation dans des formulaires réels.',
      },
    },
  },
}
