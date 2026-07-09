import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PTableNoData from './p-table-no-data.vue'
import PTable from '../PTable/PTable.vue'
import PTableColumn from '../PTableColumn/PTableColumn.vue'
import { pulseGeneratedIcons } from '../PIcon/components/constants'

const meta: Meta<typeof PTableNoData> = {
  title: 'Atoms/PTableNoData',
  component: PTableNoData,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Contenu affiché dans le slot vide d\'un PTable lorsqu\'aucune donnée n\'est disponible.',
      },
    },
  },
  argTypes: {
    pEmptyText: {
      control: 'text',
      description: 'Texte affiché lorsqu\'aucune donnée n\'est disponible',
    },
    pIconName: {
      control: 'select',
      options: pulseGeneratedIcons.map(icon => icon.name),
      description: 'Nom de l\'icône affichée à gauche du texte',
    },
    pActionLabel: {
      control: 'text',
      description: 'Libellé du CTA optionnel ; masqué si non renseigné, émet `action-click` au clic',
    },
  },
  args: {
    pEmptyText: 'Aucune donnée',
    pIconName: 'infoCircle',
    pActionLabel: 'Ajouter',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default story
export const Default: Story = {
  render: (args) => ({
    components: { PTableNoData },
    setup() {
      return { args }
    },
    template: `
      <div style="min-width: 600px;">
        <PTableNoData v-bind="args" />
      </div>
    `,
  }),
  parameters: {
    docs: {
      description: {
        story: 'Composant de message vide affiché seul.',
      },
    },
  },
}

// Different icons
export const WithIcons: Story = {
  render: () => ({
    components: { PTableNoData },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; min-width: 600px;">
        <PTableNoData pIconName="infoCircle" pEmptyText="Aucune donnée" />
        <PTableNoData pIconName="search" pEmptyText="Aucun résultat pour cette recherche" />
        <PTableNoData pIconName="folder" pEmptyText="Aucun document disponible" />
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Message vide avec différentes icônes selon le contexte.',
      },
    },
  },
}

// With an optional CTA that emits action-click
export const WithAction: Story = {
  render: () => ({
    components: { PTableNoData },
    setup() {
      const clickCount = ref(0)
      const onActionClick = (): void => {
        clickCount.value += 1
      }

      return { clickCount, onActionClick }
    },
    template: `
      <div style="display: flex; flex-direction: column; gap: 16px; min-width: 600px;">
        <PTableNoData
          pEmptyText="Aucun document déposé"
          pIconName="folder"
          pActionLabel="Déposer un document"
          @action-click="onActionClick"
        />
        <p style="text-align: center;">Clics sur le CTA : {{ clickCount }}</p>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'Message vide avec un CTA optionnel (`pActionLabel`) qui émet `action-click` au clic.',
      },
    },
  },
}

// Usage inside an empty PTable via the pEmptyText / pEmptyIconName props
export const InEmptyTable: Story = {
  render: () => ({
    components: { PTable, PTableColumn },
    template: `
      <div style="min-width: 600px;">
        <PTable
          :pData="[]"
          pEmptyText="Aucune donnée à afficher"
          pEmptyIconName="search"
        >
          <PTableColumn pProp="date" pLabel="Date" pWidth="180" />
          <PTableColumn pProp="name" pLabel="Nom" pWidth="180" />
          <PTableColumn pProp="address" pLabel="Adresse" />
        </PTable>
      </div>
    `,
  }),
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story: 'PTable sans données : le message vide est alimenté via les props `pEmptyText` / `pEmptyIconName`.',
      },
    },
  },
}
