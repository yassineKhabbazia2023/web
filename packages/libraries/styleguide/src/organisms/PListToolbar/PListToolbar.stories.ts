import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PListToolbar from './PListToolbar.vue'
import PButton from '../../atoms/PButton'
import PInput from '../../atoms/PInput'
import PActiveFiltersBar from '../../molecules/PActiveFiltersBar'
import type { ActiveFilterItem } from '../../molecules/PActiveFiltersBar/PActiveFiltersBarTypes'

const meta: Meta<typeof PListToolbar> = {
  title: 'Organisms/PListToolbar',
  component: PListToolbar,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Barre d\'outils au-dessus d\'une liste : recherche + actions (slots) et une barre de résultats avec bouton Filtrer, Réinitialiser et sélection (bakés, via events). Le sticky est géré par le consommateur.',
      },
    },
  },
  argTypes: {
    pFilterLabel: { control: 'text', description: 'Label du bouton Filtrer' },
    pFilterCount: { control: 'number', description: 'Compteur de filtres actifs (0 masque la pastille et le bouton Réinitialiser)' },
    pResetLabel: { control: 'text', description: 'Label du bouton Réinitialiser' },
    pDeselectLabel: { control: 'text', description: 'Label du bouton Désélectionner' },
    pSelectedCount: { control: 'number', description: 'Nombre d\'éléments sélectionnés (>0 affiche le fond vert, le compteur et Désélectionner)' },
    pHasResultsBar: { control: 'boolean', description: 'Affiche la barre de résultats' },
  },
  args: {
    pFilterLabel: 'Filtrer',
    pFilterCount: 0,
    pResetLabel: 'Réinitialiser',
    pDeselectLabel: 'Désélectionner',
    pSelectedCount: 0,
    pHasResultsBar: true,
  },
}

export default meta
export type Story = StoryObj<typeof meta>

const components = { PListToolbar, PButton, PInput }

const SEARCH_SLOT = '<template #search><PInput placeholder="Rechercher" pPrefixIconName="search" /></template>'
const ACTIONS_SLOT = '<template #actions><PButton pType="primary" pSize="small">Gérer les accès</PButton></template>'
const SUMMARY_SLOT = '<template #summary><span><b>128</b> dossiers</span></template>'
const SELECTION_SLOT = '<template #selection><span>2 dossiers sélectionnés</span></template>'

const withAllSlots = (args: Record<string, unknown>) => ({
  components,
  setup: () => ({ args }),
  template: `
    <PListToolbar v-bind="args" @open-filters="() => {}" @clear-filters="() => {}" @clear-selection="() => {}">
      ${SEARCH_SLOT}
      ${ACTIONS_SLOT}
      ${SUMMARY_SLOT}
      ${SELECTION_SLOT}
    </PListToolbar>
  `,
})

// No filters and no selection: only the search, actions and the summary + Filter button.
export const Default: Story = {
  render: withAllSlots,
}

// Active filters: the count pastille and the Reset button appear next to Filter.
export const WithActiveFilters: Story = {
  args: { pFilterCount: 3 },
  render: withAllSlots,
}

// Active selection: green background, the selection counter and the Deselect button appear.
export const WithSelection: Story = {
  args: { pSelectedCount: 2 },
  render: withAllSlots,
}

// Filters and selection combined.
export const WithFiltersAndSelection: Story = {
  args: { pFilterCount: 3, pSelectedCount: 2 },
  render: withAllSlots,
}

// No actions slot: the leading actions divider is not rendered.
export const WithoutActions: Story = {
  render: (args) => ({
    components,
    setup: () => ({ args }),
    template: `
      <PListToolbar v-bind="args" @open-filters="() => {}" @clear-filters="() => {}" @clear-selection="() => {}">
        ${SEARCH_SLOT}
        ${SUMMARY_SLOT}
        ${SELECTION_SLOT}
      </PListToolbar>
    `,
  }),
}

// Results bar hidden: only the header row (search + actions) is rendered.
export const WithoutResultsBar: Story = {
  args: { pHasResultsBar: false },
  render: withAllSlots,
}

// Applied filters: chips rendered between the summary and the Filter button, with overflow past 4.
export const WithAppliedFilters: Story = {
  args: { pFilterCount: 9 },
  render: (args) => ({
    components: { PListToolbar, PInput, PActiveFiltersBar },
    setup: () => {
      const appliedFilters: ActiveFilterItem[] = Array.from({ length: 9 }, (_, index) => ({
        pCode: `filter-${index}`,
        pContent: `Filtre ${index + 1}`,
        pColor: 'default',
      }))
      return { args, appliedFilters }
    },
    template: `
      <PListToolbar v-bind="args" @open-filters="() => {}" @clear-filters="() => {}" @clear-selection="() => {}">
        ${SEARCH_SLOT}
        ${SUMMARY_SLOT}
        <template #filters>
          <PActiveFiltersBar :pFilters="appliedFilters" />
        </template>
      </PListToolbar>
    `,
  }),
}
