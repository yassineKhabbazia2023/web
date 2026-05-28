import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PSwitch from './PSwitch.vue'
import { ref } from 'vue'

const meta: Meta<typeof PSwitch> = {
  title: 'Atoms/PSwitch',
  component: PSwitch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant switch/interrupteur basé sur Element Plus avec personnalisation.',
      },
    },
  },
  argTypes: {
    pDisabled: {
      control: 'boolean',
      description: 'État désactivé du switch',
    },
    pLoading: {
      control: 'boolean',
      description: 'État de chargement du switch',
    },
    pActiveText: {
      control: 'text',
      description: 'Texte affiché quand le switch est activé',
    },
    pInactiveText: {
      control: 'text',
      description: 'Texte affiché quand le switch est désactivé',
    },
  },
  args: {
    pDisabled: false,
    pLoading: false,
    pSize: 'default',
    pActiveText: '',
    pInactiveText: '',
    pInlinePrompt: false,
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PSwitch },
    setup() {
      const switchValue = ref(false)
      return { args, switchValue }
    },
    template: '<PSwitch v-bind="args" v-model="switchValue" />',
  }),
  parameters: {
    docs: {
      description: {
        story: 'Switch par défaut avec état réactif.',
      },
    },
  },
}

// With text labels
export const WithTextLabels: Story = {
  render: () => ({
    components: { PSwitch },
    setup() {
      const onOffValue = ref(true)
      const yesNoValue = ref(false)
      const customValue = ref(true)
      return { onOffValue, yesNoValue, customValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 20px; align-items: flex-start;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <PSwitch 
            v-model="onOffValue" 
            pActiveText="ON" 
            pInactiveText="OFF"
          />
          <span>Switch ON/OFF</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <PSwitch 
            v-model="yesNoValue" 
            pActiveText="OUI" 
            pInactiveText="NON"
          />
          <span>Switch OUI/NON</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Switch avec différents textes et labels.',
      },
    },
  },
}

// Different states
export const States: Story = {
  render: () => ({
    components: { PSwitch },
    setup() {
      const normalOff = ref(false)
      const normalOn = ref(true)
      const disabledOff = ref(false)
      const disabledOn = ref(true)
      const loadingValue = ref(false)
      return { normalOff, normalOn, disabledOff, disabledOn, loadingValue }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; align-items: flex-start;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <PSwitch v-model="normalOff" />
          <span>Normal - Désactivé</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <PSwitch v-model="normalOn" />
          <span>Normal - Activé</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <PSwitch v-model="disabledOff" :pDisabled="true" />
          <span>Désactivé - Off</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <PSwitch v-model="disabledOn" :pDisabled="true" />
          <span>Désactivé - On</span>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <PSwitch v-model="loadingValue" :pLoading="true" />
          <span>En chargement</span>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Différents états du switch : normal, désactivé, chargement.',
      },
    },
  },
}

// Real world examples
export const RealWorldExamples: Story = {
  render: () => ({
    components: { PSwitch },
    setup() {
      const notifications = ref(true)
      const darkMode = ref(false)
      const autoSave = ref(true)
      const publicProfile = ref(false)
      const twoFactor = ref(true)
      return { notifications, darkMode, autoSave, publicProfile, twoFactor }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div>
          <h3 style="margin-bottom: 16px;">Paramètres de notification</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 300px;">
              <span>Notifications push</span>
              <PSwitch v-model="notifications" />
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; width: 300px;">
              <span>Mode sombre</span>
              <PSwitch v-model="darkMode" />
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; width: 300px;">
              <span>Sauvegarde automatique</span>
              <PSwitch v-model="autoSave" />
            </div>
          </div>
        </div>
        
        <div>
          <h3 style="margin-bottom: 16px;">Confidentialité</h3>
          <div style="display: flex; flex-direction: column; gap: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; width: 300px;">
              <span>Profil public</span>
              <PSwitch 
                v-model="publicProfile" 
                pActiveText="Public" 
                pInactiveText="Privé"
              />
            </div>
          </div>
        </div>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Exemples d\'utilisation dans des paramètres réels.',
      },
    },
  },
}
