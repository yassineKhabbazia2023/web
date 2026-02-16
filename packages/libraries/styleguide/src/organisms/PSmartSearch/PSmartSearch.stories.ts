import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PSmartSearch from './PSmartSearch.vue'
import type { PSmartSearchProps } from './PSmartSearch.types'

const meta: Meta<typeof PSmartSearch> = {
  title: 'Organisms/PSmartSearch',
  component: PSmartSearch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `A smart search component that supports both classic search and AI-powered search modes.
        Toggle between modes using the integrated switch.

        **Slots:**
        - \`header\`: Content for the AI mode header
        - \`disclaimer\`: Content for the AI mode disclaimer`,
      },
    },
  },
  argTypes: {
    pSearch: {
      control: 'text',
      description: 'Current search value',
    },
    pAiEnabled: {
      control: 'boolean',
      description: 'Whether AI search mode is enabled',
    },
    pPlaceholder: {
      control: 'text',
      description: 'Placeholder text for classic search mode',
    },
    pAiPlaceholder: {
      control: 'text',
      description: 'Placeholder text for AI search mode',
    },
    pSwitchLabel: {
      control: 'text',
      description: 'Label displayed next to the switch in classic mode',
    },
    pDisabled: {
      control: 'boolean',
      description: 'Whether the component is disabled',
    },
    pClearable: {
      control: 'boolean',
      description: 'Whether to show clear button in classic mode',
    },
    pMinLength: {
      control: 'number',
      description: 'Minimum length required for search validation',
    },
    pShowSmartSearchToggle: {
      control: 'boolean',
      description: 'Whether to show the smart search toggle switch. When false, the component stays in classic mode without the toggle.',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PSmartSearchProps>

const headerStyle = `
  color: black;
  margin: 0 0 8px 0;
  font-size: 14px;
`

const disclaimerStyle = `
  margin-top: 8px;
  font-size: 12px;
  color: #889BA8;
  text-align: center;
`

export const Default: Story = {
  render: (args) => ({
    components: { PSmartSearch },
    setup() {
      const searchValue = ref('')
      const aiEnabled = ref(false)

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
      }

      const onUpdateAiEnabled = (value: boolean) => {
        aiEnabled.value = value
      }

      const onSearch = (value: string) => {
        alert(`AI Search submitted: ${value}`)
      }

      return {
        args,
        searchValue,
        aiEnabled,
        onUpdateSearch,
        onUpdateAiEnabled,
        onSearch,
        headerStyle,
        disclaimerStyle,
      }
    },
    template: `
      <div style="padding: 20px; width: 600px;">
        <PSmartSearch
          v-bind="args"
          :pSearch="searchValue"
          :pAiEnabled="aiEnabled"
          @update:p-search="onUpdateSearch"
          @update:p-ai-enabled="onUpdateAiEnabled"
          @search="onSearch"
        >
          <template #header>
            <div :style="headerStyle">
              Recherche intelligente activée
            </div>
          </template>
          <template #disclaimer>
            <p :style="disclaimerStyle">
              Vérifiez la pertinence avant de proposer au client. Le contenu généré par l'IA peut être incorrect.
            </p>
          </template>
        </PSmartSearch>
        <div style="margin-top: 16px; padding: 12px; background: #f5f5f5; border-radius: 4px;">
          <p><strong>Search value:</strong> "{{ searchValue }}"</p>
          <p><strong>AI mode:</strong> {{ aiEnabled ? 'Enabled' : 'Disabled' }}</p>
        </div>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Renseignez un ou plusieurs mots-clés',
    pAiPlaceholder: 'Recherche intelligente : Renseignez un mot clé, une phrase, ou votre besoin "je cherche ..."',
    pSwitchLabel: 'recherche intelligente',
    pClearable: true,
    pMinLength: 3,
    pSearchInvalidMessage: 'Minimum 3 caractères',
  },
}

export const ClassicMode: Story = {
  render: (args) => ({
    components: { PSmartSearch },
    setup() {
      const searchValue = ref('')
      const aiEnabled = ref(false)

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
      }

      const onUpdateAiEnabled = (value: boolean) => {
        aiEnabled.value = value
      }

      return {
        args,
        searchValue,
        aiEnabled,
        onUpdateSearch,
        onUpdateAiEnabled,
        headerStyle,
        disclaimerStyle,
      }
    },
    template: `
      <div style="padding: 20px; width: 600px;">
        <h3 style="margin-bottom: 16px;">Classic Search Mode</h3>
        <PSmartSearch
          v-bind="args"
          :pSearch="searchValue"
          :pAiEnabled="aiEnabled"
          @update:p-search="onUpdateSearch"
          @update:p-ai-enabled="onUpdateAiEnabled"
        >
          <template #header>
            <div :style="headerStyle">Recherche intelligente activée</div>
          </template>
          <template #disclaimer>
            <p :style="disclaimerStyle">Le contenu généré par l'IA peut être incorrect.</p>
          </template>
        </PSmartSearch>
        <div style="margin-top: 16px;">
          <strong>Current value:</strong> "{{ searchValue }}"
        </div>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Renseignez un ou plusieurs mots-clés',
    pClearable: true,
    pMinLength: 3,
    pSearchInvalidMessage: 'Minimum 3 caractères',
  },
}

export const AiModeEnabled: Story = {
  render: (args) => ({
    components: { PSmartSearch },
    setup() {
      const searchValue = ref('')
      const aiEnabled = ref(true)

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
      }

      const onUpdateAiEnabled = (value: boolean) => {
        aiEnabled.value = value
      }

      const onSearch = (value: string) => {
        alert(`AI Search: ${value}`)
      }

      return {
        args,
        searchValue,
        aiEnabled,
        onUpdateSearch,
        onUpdateAiEnabled,
        onSearch,
        headerStyle,
        disclaimerStyle,
      }
    },
    template: `
      <div style="padding: 20px; width: 600px;">
        <h3 style="margin-bottom: 16px;">AI Search Mode</h3>
        <PSmartSearch
          v-bind="args"
          :pSearch="searchValue"
          :pAiEnabled="aiEnabled"
          @update:p-search="onUpdateSearch"
          @update:p-ai-enabled="onUpdateAiEnabled"
          @search="onSearch"
        >
          <template #header>
            <div :style="headerStyle">Recherche intelligente activée</div>
          </template>
          <template #disclaimer>
            <p :style="disclaimerStyle">
              Vérifiez la pertinence avant de proposer au client. Le contenu généré par l'IA peut être incorrect.
            </p>
          </template>
        </PSmartSearch>
        <div style="margin-top: 16px;">
          <strong>Current value:</strong> "{{ searchValue }}"
        </div>
      </div>
    `,
  }),
  args: {
    pAiPlaceholder: 'Recherche intelligente : Renseignez un mot clé, une phrase, ou votre besoin "je cherche ..."',
  },
}

export const AiModeWithoutHeader: Story = {
  render: (args) => ({
    components: { PSmartSearch },
    setup() {
      const searchValue = ref('')
      const aiEnabled = ref(true)

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
      }

      const onUpdateAiEnabled = (value: boolean) => {
        aiEnabled.value = value
      }

      const onSearch = (value: string) => {
        alert(`AI Search: ${value}`)
      }

      return {
        args,
        searchValue,
        aiEnabled,
        onUpdateSearch,
        onUpdateAiEnabled,
        onSearch,
        disclaimerStyle,
      }
    },
    template: `
      <div style="padding: 20px; width: 600px;">
        <h3 style="margin-bottom: 16px;">AI Mode Without Header</h3>
        <PSmartSearch
          v-bind="args"
          :pSearch="searchValue"
          :pAiEnabled="aiEnabled"
          @update:p-search="onUpdateSearch"
          @update:p-ai-enabled="onUpdateAiEnabled"
          @search="onSearch"
        >
          <template #disclaimer>
            <p :style="disclaimerStyle">Le contenu généré par l'IA peut être incorrect.</p>
          </template>
        </PSmartSearch>
      </div>
    `,
  }),
  args: {
    pAiPlaceholder: 'Ask anything...',
  },
}

export const Disabled: Story = {
  render: (args) => ({
    components: { PSmartSearch },
    setup() {
      const searchValue = ref('Some search text')

      return {
        args,
        searchValue,
        headerStyle,
        disclaimerStyle,
      }
    },
    template: `
      <div style="padding: 20px; width: 600px;">
        <h3 style="margin-bottom: 16px;">Disabled State - Classic Mode</h3>
        <PSmartSearch
          v-bind="args"
          :pSearch="searchValue"
          :pAiEnabled="false"
          pDisabled
        >
          <template #header>
            <div :style="headerStyle">Recherche intelligente activée</div>
          </template>
        </PSmartSearch>

        <h3 style="margin: 32px 0 16px;">Disabled State - AI Mode</h3>
        <PSmartSearch
          v-bind="args"
          :pSearch="searchValue"
          :pAiEnabled="true"
          pDisabled
        >
          <template #header>
            <div :style="headerStyle">Recherche intelligente activée</div>
          </template>
          <template #disclaimer>
            <p :style="disclaimerStyle">Vérifiez la pertinence avant de proposer au client.</p>
          </template>
        </PSmartSearch>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Renseignez un ou plusieurs mots-clés',
    pAiPlaceholder: 'Recherche intelligente...',
  },
}

export const WithoutSmartSearchToggle: Story = {
  render: (args) => ({
    components: { PSmartSearch },
    setup() {
      const searchValue = ref('')

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
      }

      return {
        args,
        searchValue,
        onUpdateSearch,
      }
    },
    template: `
      <div style="padding: 20px; width: 600px;">
        <h3 style="margin-bottom: 16px;">Classic Mode Only (Smart Search Toggle Hidden)</h3>
        <p style="margin-bottom: 16px; color: #666;">
          When pShowSmartSearchToggle is false, the toggle switch is hidden and the component stays in classic search mode.
          This is useful when the smart search feature is controlled by a feature flag.
        </p>
        <PSmartSearch
          v-bind="args"
          :pSearch="searchValue"
          @update:p-search="onUpdateSearch"
        />
        <div style="margin-top: 16px;">
          <strong>Current value:</strong> "{{ searchValue }}"
        </div>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Renseignez un ou plusieurs mots-clés',
    pShowSmartSearchToggle: false,
    pClearable: true,
    pMinLength: 3,
    pSearchInvalidMessage: 'Minimum 3 caractères',
  },
}

export const CustomLabels: Story = {
  render: (args) => ({
    components: { PSmartSearch },
    setup() {
      const searchValue = ref('')
      const aiEnabled = ref(false)

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
      }

      const onUpdateAiEnabled = (value: boolean) => {
        aiEnabled.value = value
      }

      const onSearch = (value: string) => {
        alert(`Search: ${value}`)
      }

      const customHeaderStyle = `
        background-color: #2C2FD6;
        color: white;
        padding: 8px 16px;
        font-size: 14px;
        border-radius: 8px 8px 0 0;
      `

      return {
        args,
        searchValue,
        aiEnabled,
        onUpdateSearch,
        onUpdateAiEnabled,
        onSearch,
        customHeaderStyle,
        disclaimerStyle,
      }
    },
    template: `
      <div style="padding: 20px; width: 600px;">
        <h3 style="margin-bottom: 16px;">Custom Labels (English)</h3>
        <PSmartSearch
          v-bind="args"
          :pSearch="searchValue"
          :pAiEnabled="aiEnabled"
          @update:p-search="onUpdateSearch"
          @update:p-ai-enabled="onUpdateAiEnabled"
          @search="onSearch"
        >
          <template #header>
            <div :style="customHeaderStyle">Smart search enabled</div>
          </template>
          <template #disclaimer>
            <p :style="disclaimerStyle">
              Verify relevance before presenting to the client. AI-generated content may be incorrect.
            </p>
          </template>
        </PSmartSearch>
      </div>
    `,
  }),
  args: {
    pPlaceholder: 'Enter one or more keywords',
    pAiPlaceholder: 'Smart search: Enter a keyword, phrase, or describe what you are looking for...',
    pSwitchLabel: 'smart search',
    pClearable: true,
    pSearchInvalidMessage: 'Minimum 3 characters required',
  },
}
