import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PCheckbox from './PCheckbox.vue'

const meta: Meta<typeof PCheckbox> = {
  title: 'Atoms/PCheckbox',
  component: PCheckbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant checkbox basé sur Element Plus avec style personnalisé.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'État coché de la checkbox',
    },
    pRounded: {
      control: 'boolean',
      description: 'Style arrondi pour la checkbox',
    },
  },
  args: {
    modelValue: false,
    pRounded: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PCheckbox },
    setup() {
      return { args }
    },
    template: '<PCheckbox v-model="args.modelValue" :p-rounded="args.pRounded">Accepter les conditions</PCheckbox>',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Checkbox par défaut avec du texte dans le slot.',
      },
    },
  },
}

// Different states
export const States: Story = {
  render: () => ({
    components: { PCheckbox },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <PCheckbox :model-value="false">Non coché</PCheckbox>
        <PCheckbox :model-value="true">Coché</PCheckbox>
        <PCheckbox :model-value="false" disabled>Désactivé non coché</PCheckbox>
        <PCheckbox :model-value="true" disabled>Désactivé coché</PCheckbox>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents états de la checkbox : normal, coché, désactivé.',
      },
    },
  },
}

// With labels
export const WithLabels: Story = {
  render: () => ({
    components: { PCheckbox },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <PCheckbox>Option 1</PCheckbox>
        <PCheckbox :model-value="true">Option 2</PCheckbox>
        <PCheckbox>Très long texte qui permet de tester le comportement. Dans ce cas particulier la checkbox à droite doit être centrée verticalements et le texte ne doit pas être tronqué.</PCheckbox>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Checkboxes avec différents types de labels.',
      },
    },
  },
}

// Rounded style
export const Rounded: Story = {
  render: () => ({
    components: { PCheckbox },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <PCheckbox :pRounded="false">Checkbox normale</PCheckbox>
        <PCheckbox :pRounded="true">Checkbox arrondie</PCheckbox>
        <PCheckbox :pRounded="true" :model-value="true">Checkbox arrondie cochée</PCheckbox>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Comparaison entre checkbox normale et arrondie.',
      },
    },
  },
}

// Form examples
export const FormExamples: Story = {
  render: () => ({
    components: { PCheckbox },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 12px;">Préférences de notification</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <PCheckbox :model-value="true">Recevoir les notifications par email</PCheckbox>
            <PCheckbox :model-value="false">Recevoir les notifications SMS</PCheckbox>
            <PCheckbox :model-value="true">Notifications push sur mobile</PCheckbox>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 12px;">Conditions légales</h3>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            <PCheckbox :model-value="true">J'accepte les conditions générales d'utilisation</PCheckbox>
            <PCheckbox :model-value="true">J'accepte la politique de confidentialité</PCheckbox>
            <PCheckbox :model-value="false">Je souhaite recevoir la newsletter</PCheckbox>
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
