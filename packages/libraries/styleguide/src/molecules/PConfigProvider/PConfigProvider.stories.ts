import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import fr from 'element-plus/es/locale/lang/fr'
import PConfigProvider from './PConfigProvider.vue'
import PButton from '../../atoms/PButton'
import PTable from '../../atoms/PTable'
import PPagination from '../../atoms/PPagination'
import PCheckbox from '../../atoms/PCheckbox'
import type { PConfigProviderProps } from './PConfigProviderTypes'

const meta: Meta<typeof PConfigProvider> = {
  title: 'Molecules/PConfigProvider',
  component: PConfigProvider,
  parameters: {
    docs: {
      description: {
        component: 'A configuration provider component that sets up global configuration for Element Plus components within its scope.',
      },
    },
  },
  argTypes: {
    pLocale: {
      control: 'select',
      options: ['fr', 'en'],
      description: 'Locale configuration for internationalization',
      table: {
        type: { summary: 'Language' },
      },
    },
    pSize: {
      control: 'select',
      options: ['large', 'default', 'small'],
      description: 'Global component size',
      table: {
        type: { summary: "'large' | 'default' | 'small'" },
        defaultValue: { summary: "'default'" },
      },
    },
    pZIndex: {
      control: 'number',
      description: 'Global z-index configuration',
      table: {
        type: { summary: 'number' },
      },
    },
    pNamespace: {
      control: 'text',
      description: 'CSS namespace prefix',
      table: {
        type: { summary: 'string' },
      },
    },
    pButton: {
      control: 'object',
      description: 'Button component configuration',
      table: {
        type: { summary: '{ autoInsertSpace?: boolean }' },
      },
    },
    pMessage: {
      control: 'object',
      description: 'Message component configuration',
      table: {
        type: { summary: '{ max: number }' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PConfigProviderProps>

export const BasicUsage: Story = {
  render: (args) => ({
    components: { PConfigProvider, PButton, PTable, PPagination },
    setup() {
      const language = ref('fr')
      const locale = computed(() => {
        if (args.pLocale) {
          return args.pLocale
        }
        return language.value === 'fr' ? fr : en
      })

      const toggle = () => {
        language.value = language.value === 'fr' ? 'en' : 'fr'
      }

      return {
        args: { ...args, pLocale: locale },
        toggle,
      }
    },
    template: `
      <div>
        <PButton @click="toggle" style="margin-bottom: 16px;">
          Switch Language
        </PButton>
        <br>
        <PConfigProvider v-bind="args">
          <PTable style="margin-bottom: 8px;" :pData="[]" />
          <PPagination :pTotal="100" />
        </PConfigProvider>
      </div>
    `,
  }),
  args: {},
}

export const ButtonConfiguration: Story = {
  render: (args) => ({
    components: { PConfigProvider, PButton, PCheckbox },
    setup() {
      const configButton = reactive({
        autoInsertSpace: true,
      })

      return {
        args: { ...args, pButton: configButton },
        configButton,
      }
    },
    template: `
      <div>
        <div style="margin-bottom: 16px;">
          <PCheckbox v-model="configButton.autoInsertSpace">
            autoInsertSpace
          </PCheckbox>
        </div>
        <PConfigProvider v-bind="args">
          <PButton>Click</PButton>
        </PConfigProvider>
      </div>
    `,
  }),
  args: {
    pButton: { autoInsertSpace: true },
  },
}

export const MessageConfiguration: Story = {
  render: (args) => ({
    components: { PConfigProvider, PButton },
    setup() {
      const configMessage = reactive({
        max: 3,
      })

      const open = () => {
        ElMessage('This is a message.')
      }

      return {
        args: { ...args, pMessage: configMessage },
        open,
      }
    },
    template: `
      <div>
        <PConfigProvider v-bind="args">
          <PButton @click="open">OPEN MESSAGE</PButton>
        </PConfigProvider>
      </div>
    `,
  }),
  args: {
    pMessage: { max: 3 },
  },
}

export const SizeConfiguration: Story = {
  render: (args) => ({
    components: { PConfigProvider, PButton },
    setup() {
      return { args }
    },
    template: `
      <div>
        <h4>Size: {{ args.pSize }}</h4>
        <PConfigProvider v-bind="args">
          <div style="display: flex; gap: 8px; flex-wrap: wrap;">
            <PButton>Default Button</PButton>
            <PButton pType="primary">Primary Button</PButton>
            <PButton pType="success">Success Button</PButton>
            <PButton pType="warning">Warning Button</PButton>
            <PButton pType="danger">Danger Button</PButton>
          </div>
        </PConfigProvider>
      </div>
    `,
  }),
  args: {
    pSize: 'large',
  },
}

export const LocaleConfiguration: Story = {
  render: (args) => ({
    components: { PConfigProvider, PPagination },
    setup() {
      return { args }
    },
    template: `
      <div>
        <h4>Current Locale: {{ args.pLocale?.name || 'default' }}</h4>
        <PConfigProvider v-bind="args">
          <PPagination :pTotal="100" :pPageSize="10" :pCurrentPage="1" />
        </PConfigProvider>
      </div>
    `,
  }),
  args: {
    pLocale: fr,
  },
}

export const ZIndexConfiguration: Story = {
  render: (args) => ({
    components: { PConfigProvider, PButton },
    setup() {
      const showTooltip = ref(false)

      return {
        args,
        showTooltip,
      }
    },
    template: `
      <div>
        <h4>Z-Index: {{ args.pZIndex }}</h4>
        <PConfigProvider v-bind="args">
          <PButton @click="showTooltip = !showTooltip">
            Toggle Tooltip (Z-Index: {{ args.pZIndex }})
          </PButton>
        </PConfigProvider>
        <div v-if="showTooltip" 
             :style="{ position: 'fixed', top: '50px', left: '50px', background: 'black', color: 'white', padding: '8px', zIndex: args.pZIndex }">
          Tooltip with custom z-index
        </div>
      </div>
    `,
  }),
  args: {
    pZIndex: 2000,
  },
}

export const NamespaceConfiguration: Story = {
  render: (args) => ({
    components: { PConfigProvider, PButton },
    setup() {
      return { args }
    },
    template: `
      <div>
        <h4>Namespace: {{ args.pNamespace || 'default (el)' }}</h4>
        <PConfigProvider v-bind="args">
          <PButton>Button with custom namespace</PButton>
        </PConfigProvider>
      </div>
    `,
  }),
  args: {
    pNamespace: 'pulse',
  },
}
