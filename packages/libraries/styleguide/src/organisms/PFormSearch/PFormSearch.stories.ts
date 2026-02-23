import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PFormSearch from './PFormSearch.vue'
import { PFormSearchProps } from './PFormSearch.types'
import { DEBOUNCE_TIMING } from '@pulse/toolbox'

const meta: Meta<typeof PFormSearch> = {
  title: 'Organisms/PFormSearch',
  component: PFormSearch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A search form component with debounced input, validation, and customizable styling.',
      },
    },
  },
  argTypes: {
    pSearch: {
      control: 'text',
      description: 'Current search value',
      table: {
        type: { summary: 'string' },
      },
    },
    pPlaceholder: {
      control: 'text',
      description: 'Placeholder text for the search input',
      table: {
        type: { summary: 'string' },
      },
    },
    pAutofocus: {
      control: 'boolean',
      description: 'Whether to autofocus the input',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pMinLength: {
      control: 'number',
      description: 'Minimum length required for search',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '3' },
      },
    },
    pSize: {
      control: 'select',
      options: ['large', 'default', 'small'],
      description: 'Size of the search input',
      table: {
        type: { summary: "'large' | 'default' | 'small'" },
        defaultValue: { summary: 'default' },
      },
    },
    pClearable: {
      control: 'boolean',
      description: 'Whether to show clear button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pDebounceDelay: {
      control: 'number',
      description: 'Debounce delay in milliseconds',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '100' },
      },
    },
    pSearchInvalidMessage: {
      control: 'text',
      description: 'Message shown when search is invalid',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PFormSearchProps>

export const Default: Story = {
  render: (args) => ({
    components: { PFormSearch },
    setup() {
      const searchValue = ref('')

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
        console.log('Search updated:', value)
      }

      return {
        args,
        searchValue,
        onUpdateSearch,
      }
    },
    template: `
      <div style="padding: 20px; width: 400px;">
        <PFormSearch
          v-bind="args"
          :pSearch="searchValue"
          @update:p-search="onUpdateSearch"
        />
        <div style="margin-top: 16px;">
          <strong>Current search value:</strong> "{{ searchValue }}"
        </div>
      </div>
    `,
  }),
  args: {
    pSearch: '',
    pPlaceholder: 'veuillez saisir la valeur de recherche',
    pAutofocus: false,
    pMinLength: 3,
    pSize: 'default',
    pClearable: false,
    pSearchInvalidMessage: 'Minimum 3 caractères',
  },
}

export const WithClearButton: Story = {
  render: (args) => ({
    components: { PFormSearch },
    setup() {
      const searchValue = ref('search query')

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
        console.log('Search updated:', value)
      }

      return {
        args,
        searchValue,
        onUpdateSearch,
      }
    },
    template: `
      <div style="padding: 20px; width: 400px;">
        <PFormSearch
          v-bind="args"
          :pSearch="searchValue"
          @update:p-search="onUpdateSearch"
        />
        <div style="margin-top: 16px;">
          <strong>Current search value:</strong> "{{ searchValue }}"
        </div>
      </div>
    `,
  }),
  args: {
    pSearch: 'search query',
    pPlaceholder: 'Search with clear button',
    pAutofocus: false,
    pMinLength: 2,
    pSize: 'default',
    pClearable: true,
    pSearchInvalidMessage: 'Please enter at least 2 characters',
  },
}

export const AutofocusEnabled: Story = {
  render: (args) => ({
    components: { PFormSearch },
    setup() {
      const searchValue = ref('')

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
        console.log('Search updated:', value)
      }

      return {
        args,
        searchValue,
        onUpdateSearch,
      }
    },
    template: `
      <div style="padding: 20px; width: 400px;">
        <p style="margin-bottom: 16px;">This search input will be automatically focused when the story loads.</p>
        <PFormSearch
          v-bind="args"
          :pSearch="searchValue"
          @update:p-search="onUpdateSearch"
        />
        <div style="margin-top: 16px;">
          <strong>Current search value:</strong> "{{ searchValue }}"
        </div>
      </div>
    `,
  }),
  args: {
    pSearch: '',
    pPlaceholder: 'Automatically focused search',
    pAutofocus: true,
    pMinLength: 1,
    pSize: 'default',
    pClearable: true,
    pSearchInvalidMessage: 'At least 1 character required',
  },
}

export const DifferentSizes: Story = {
  render: () => ({
    components: { PFormSearch },
    setup() {
      const searchValueLarge = ref('')
      const searchValueDefault = ref('')
      const searchValueSmall = ref('')

      const onUpdateSearchLarge = (value: string) => {
        searchValueLarge.value = value
      }

      const onUpdateSearchDefault = (value: string) => {
        searchValueDefault.value = value
      }

      const onUpdateSearchSmall = (value: string) => {
        searchValueSmall.value = value
      }

      return {
        searchValueLarge,
        searchValueDefault,
        searchValueSmall,
        onUpdateSearchLarge,
        onUpdateSearchDefault,
        onUpdateSearchSmall,
      }
    },
    template: `
      <div style="padding: 20px; width: 500px;">
        <h3>Different Search Input Sizes</h3>
        
        <div style="margin-bottom: 20px;">
          <h4>Large Size</h4>
          <PFormSearch
            :pSearch="searchValueLarge"
            pPlaceholder="Large search input"
            pSize="large"
            :pMinLength="2"
            pSearchInvalidMessage="Minimum 2 characters"
            :pClearable="true"
            @update:p-search="onUpdateSearchLarge"
          />
        </div>

        <div style="margin-bottom: 20px;">
          <h4>Default Size</h4>
          <PFormSearch
            :pSearch="searchValueDefault"
            pPlaceholder="Default search input"
            pSize="default"
            :pMinLength="2"
            pSearchInvalidMessage="Minimum 2 characters"
            :pClearable="true"
            @update:p-search="onUpdateSearchDefault"
          />
        </div>

        <div style="margin-bottom: 20px;">
          <h4>Small Size</h4>
          <PFormSearch
            :pSearch="searchValueSmall"
            pPlaceholder="Small search input"
            pSize="small"
            :pMinLength="2"
            pSearchInvalidMessage="Minimum 2 characters"
            :pClearable="true"
            @update:p-search="onUpdateSearchSmall"
          />
        </div>

        <div style="margin-top: 16px; font-size: 14px;">
          <p><strong>Large:</strong> "{{ searchValueLarge }}"</p>
          <p><strong>Default:</strong> "{{ searchValueDefault }}"</p>
          <p><strong>Small:</strong> "{{ searchValueSmall }}"</p>
        </div>
      </div>
    `,
  }),
  args: {},
}

export const CustomDebounce: Story = {
  render: (args) => ({
    components: { PFormSearch },
    setup() {
      const searchValue = ref('')
      const searchCount = ref(0)

      const onUpdateSearch = (value: string) => {
        searchValue.value = value
        searchCount.value++
        console.log('Search updated:', value, 'Count:', searchCount.value)
      }

      return {
        args,
        searchValue,
        searchCount,
        onUpdateSearch,
      }
    },
    template: `
      <div style="padding: 20px; width: 400px;">
        <p style="margin-bottom: 16px;">This search has a longer debounce delay (1000ms) - type quickly to see the effect.</p>
        <PFormSearch
          v-bind="args"
          :pSearch="searchValue"
          @update:p-search="onUpdateSearch"
        />
        <div style="margin-top: 16px;">
          <p><strong>Current search value:</strong> "{{ searchValue }}"</p>
          <p><strong>Update count:</strong> {{ searchCount }}</p>
          <p style="font-size: 12px; color: #666;">
            Try typing quickly - the update count will only increment after you stop typing for 1 second.
          </p>
        </div>
      </div>
    `,
  }),
  args: {
    pSearch: '',
    pPlaceholder: 'Search with 1000ms debounce',
    pAutofocus: false,
    pMinLength: 1,
    pSize: 'default',
    pClearable: true,
    pDebounceDelay: DEBOUNCE_TIMING.SLOW,
    pSearchInvalidMessage: 'Please enter at least 1 character',
  },
}
