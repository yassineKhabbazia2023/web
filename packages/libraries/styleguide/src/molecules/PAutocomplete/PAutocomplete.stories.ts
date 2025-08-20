import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref, onMounted } from 'vue'
import PAutocomplete from './PAutocomplete.vue'
import PIcon from '../../atoms/PIcon'

interface LinkItem {
  value: string
  link: string
}

const meta: Meta<typeof PAutocomplete> = {
  title: 'Molecules/PAutocomplete',
  component: PAutocomplete,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Composant d\'autocomplétion qui permet de rechercher et sélectionner des éléments avec des suggestions.',
      },
    },
  },
  argTypes: {
    pPlaceholder: { control: 'text', description: 'Texte de placeholder' },
    pClearable: { control: 'boolean', description: 'Permet de vider le champ' },
    pDisabled: { control: 'boolean', description: 'Désactive le composant' },
    pValueKey: { control: 'text', description: 'Clé pour accéder à la valeur dans les objets' },
    pDebounce: { control: 'number', description: 'Délai en ms pour le debounce' },
    pPlacement: {
      control: 'select',
      options: ['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end'],
      description: 'Position de la liste des suggestions',
    },
    pTriggerOnFocus: { control: 'boolean', description: 'Déclenche les suggestions au focus' },
    pSelectWhenUnmatched: { control: 'boolean', description: 'Sélectionne la première suggestion si aucune correspondance' },
    pName: { control: 'text', description: 'Attribut name du champ' },
    pLabel: { control: 'text', description: 'Label du champ' },
    pHideLoading: { control: 'boolean', description: 'Cache l\'indicateur de chargement' },
    pPopperClass: { control: 'text', description: 'Classe CSS pour le popper' },
    pTeleported: { control: 'boolean', description: 'Utilise le teleport pour le popper' },
    pHighlightFirstItem: { control: 'boolean', description: 'Met en surbrillance le premier élément' },
    pFitInputWidth: { control: 'boolean', description: 'Ajuste la largeur du popper à celle du champ' },
  },
  args: {
    pPlaceholder: 'Please Input',
    pClearable: true,
    pDisabled: false,
    pValueKey: 'value',
    pDebounce: 300,
    pPlacement: 'bottom-start',
    pTriggerOnFocus: false,
    pSelectWhenUnmatched: false,
    pHideLoading: false,
    pTeleported: true,
    pHighlightFirstItem: false,
    pFitInputWidth: false,
  },
}

export default meta
export type Story = StoryObj<typeof meta>

const createMockData = () => [
  { value: 'vue', link: 'https://github.com/vuejs/vue' },
  { value: 'element', link: 'https://github.com/ElemeFE/element' },
  { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
  { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
  { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
  { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
  { value: 'babel', link: 'https://github.com/babel/babel' },
]

const createFilter = (queryString: string) => {
  return (item: LinkItem) => {
    return item.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
  }
}

// Basic usage
export const Basic: Story = {
  render: (args) => ({
    components: { PAutocomplete, PIcon },
    setup() {
      const state = ref('')
      const links = ref<LinkItem[]>([])

      const querySearch = (queryString: string, cb: (results: LinkItem[]) => void) => {
        const results = queryString
          ? links.value.filter(createFilter(queryString))
          : links.value
        cb(results)
      }

      const handleSelect = (item: any) => {
        console.log('Selected:', item)
      }

      onMounted(() => {
        links.value = createMockData()
      })

      return { args, state, querySearch, handleSelect }
    },
    template: `
      <div style="width: 400px;">
        <PAutocomplete
          v-bind="args"
          v-model="state"
          :pFetchSuggestions="querySearch"
          @select="handleSelect"
        >
          <template #prefix>
            <PIcon pName="search" />
          </template>
        </PAutocomplete>
      </div>
    `,
  }),
}

// With custom template
export const WithCustomTemplate: Story = {
  args: {
    pPlaceholder: 'Search frameworks...',
    pClearable: true,
  },
  render: (args) => ({
    components: { PAutocomplete, PIcon },
    setup() {
      const state = ref('')
      const links = ref<LinkItem[]>([])

      const querySearch = (queryString: string, cb: (results: LinkItem[]) => void) => {
        const results = queryString
          ? links.value.filter(createFilter(queryString))
          : links.value
        cb(results)
      }

      const handleSelect = (item: any) => {
        console.log('Selected:', item)
      }

      onMounted(() => {
        links.value = createMockData()
      })

      return { args, state, querySearch, handleSelect }
    },
    template: `
      <div style="width: 400px;">
        <PAutocomplete
          v-bind="args"
          v-model="state"
          :pFetchSuggestions="querySearch"
          @select="handleSelect"
        >
          <template #prefix>
            <PIcon pName="search" />
          </template>
          <template #default="{ item }">
            <div class="suggestion-item">
              <div class="value" style="font-weight: bold;">
                {{ item.value }}
              </div>
              <span class="link" style="color: #666; font-size: 12px;">
                {{ item.link }}
              </span>
            </div>
          </template>
        </PAutocomplete>
      </div>
    `,
  }),
}

// With trigger on focus
export const TriggerOnFocus: Story = {
  args: {
    pPlaceholder: 'Focus to see suggestions',
    pTriggerOnFocus: true,
    pClearable: true,
  },
  render: (args) => ({
    components: { PAutocomplete, PIcon },
    setup() {
      const state = ref('')
      const links = ref<LinkItem[]>([])

      const querySearch = (queryString: string, cb: (results: LinkItem[]) => void) => {
        const results = queryString
          ? links.value.filter(createFilter(queryString))
          : links.value
        cb(results)
      }

      const handleSelect = (item: any) => {
        console.log('Selected:', item)
      }

      onMounted(() => {
        links.value = createMockData()
      })

      return { args, state, querySearch, handleSelect }
    },
    template: `
      <div style="width: 400px;">
        <PAutocomplete
          v-bind="args"
          v-model="state"
          :pFetchSuggestions="querySearch"
          @select="handleSelect"
        >
          <template #prefix>
            <PIcon pName="search" />
          </template>
        </PAutocomplete>
      </div>
    `,
  }),
}

// Disabled state
export const Disabled: Story = {
  args: {
    pPlaceholder: 'Disabled autocomplete',
    pDisabled: true,
  },
  render: (args) => ({
    components: { PAutocomplete, PIcon },
    setup() {
      const state = ref('Disabled value')
      const querySearch = () => {}

      return { args, state, querySearch }
    },
    template: `
      <div style="width: 400px;">
        <PAutocomplete
          v-bind="args"
          v-model="state"
          :pFetchSuggestions="querySearch"
        >
          <template #prefix>
            <PIcon pName="search" />
          </template>
        </PAutocomplete>
      </div>
    `,
  }),
}
