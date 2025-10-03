import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PHistoryCard from './PHistoryCard.vue'
import PButton from '../PButton'
import PIcon from '../PIcon'
import PTooltip from '../PTooltip'

const meta: Meta<typeof PHistoryCard> = {
  title: 'Atoms/PHistoryCard',
  component: PHistoryCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A history card component for displaying activity and timeline information.',
      },
    },
  },
  argTypes: {
    pDate: {
      control: 'text',
      description: 'The date of the history event',
    },
    pType: {
      control: 'text',
      description: 'The type of the history event',
    },
    pEntityIconName: {
      control: 'text',
      description: 'The icon name for the entity',
    },
    pEntity: {
      control: 'text',
      description: 'The entity name or description',
    },
    pTooltipEntityContent: {
      control: 'text',
      description: 'Tooltip content for the entity',
    },
  },
  args: {
    pDate: '03/03/2024',
    pType: 'Délégation',
    pEntityIconName: 'shop',
    pEntity: 'Restaurant Le Grand Bleu',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => ({
    components: { PHistoryCard, PButton, PIcon, PTooltip },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 700px; padding: 24px;">
        <PHistoryCard v-bind="args">
          <template #text>
            <span style="font-weight: bold;">Corinne CAMPISCIANNO</span>
            a délégué le dossier à
            <span style="font-weight: bold;"> Ouassim HAYANI.</span>
          </template>
          <template #action>
            <PTooltip pContent="Supprimer la délégation">
              <PButton
                pSize="default"
                pIconOnly
              >
                <PIcon pName="trash" />
              </PButton>
            </PTooltip>
          </template>
        </PHistoryCard>
      </div>
    `,
  }),
}

export const WithEntityTooltip: Story = {
  args: {
    pEntity: '3 dossiers',
    pTooltipEntityContent: 'Bateau, Voiture, Moto',
  },
  render: (args) => ({
    components: { PHistoryCard, PButton, PIcon, PTooltip },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 700px; padding: 24px;">
        <PHistoryCard v-bind="args">
          <template #text>
            <span style="font-weight: bold;">Corinne CAMPISCIANNO</span>
            a délégué le dossier à
            <span style="font-weight: bold;"> Ouassim HAYANI.</span>
          </template>
          <template #action>
            <PTooltip pContent="Supprimer la délégation">
              <PButton
                pSize="default"
                pIconOnly
              >
                <PIcon pName="trash" />
              </PButton>
            </PTooltip>
          </template>
        </PHistoryCard>
      </div>
    `,
  }),
}

export const WithoutAction: Story = {
  args: {
    pDate: '20/05/2024',
    pType: 'Création',
    pEntity: 'Nouveau projet',
    pEntityIconName: 'folder',
  },
  render: (args) => ({
    components: { PHistoryCard },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 700px; padding: 24px;">
        <PHistoryCard v-bind="args">
          <template #text>
            Un nouveau projet a été créé
          </template>
        </PHistoryCard>
      </div>
    `,
  }),
}
