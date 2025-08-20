import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PTimeline from './PTimeline.vue'
import PTimelineItem from '../../atoms/PTimelineItem'
import PHistoryCard from '../../atoms/PHistoryCard'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import PTooltip from '../../atoms/PTooltip'

const meta: Meta<typeof PTimeline> = {
  title: 'Molecules/Timeline',
  component: PTimeline,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Timeline component for displaying chronological events and history cards.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof PTimeline>

export const Default: Story = {
  render: () => ({
    components: { PTimeline, PTimelineItem, PHistoryCard, PButton, PIcon, PTooltip },
    template: `
      <PTimeline>
        <PTimelineItem pSize="normal">
          <PHistoryCard
            pDate="03/03/2024"
            pType="Délégation"
            pEntityIconName="shop"
            pEntity="Restaurant Le Grand Bleu"
          >
            <template #text>
              <span class="font-bold">Corinne CAMPISCIANNO</span>
              a délégué le dossier à
              <span class="font-bold"> Ouassim HAYANI.</span>
            </template>
            <template #action>
              <PTooltip pContent="Supprimer la délégation">
                <PButton pSize="default" pIconOnly>
                  <PIcon pName="trash" />
                </PButton>
              </PTooltip>
            </template>
          </PHistoryCard>
        </PTimelineItem>
        <PTimelineItem pSize="normal">
          <PHistoryCard
            pDate="02/03/2024"
            pType="Création"
            pEntityIconName="building"
            pEntity="Société ABC"
          >
            <template #text>
              Le dossier a été créé par
              <span class="font-bold">Jean DUPONT.</span>
            </template>
          </PHistoryCard>
        </PTimelineItem>
        <PTimelineItem pSize="normal">
          <PHistoryCard
            pDate="01/03/2024"
            pType="Validation"
            pEntityIconName="check"
            pEntity="Service Validation"
          >
            <template #text>
              Le dossier a été validé par
              <span class="font-bold">Marie MARTIN.</span>
            </template>
          </PHistoryCard>
        </PTimelineItem>
      </PTimeline>
    `,
  }),
}

export const SingleItem: Story = {
  render: () => ({
    components: { PTimeline, PTimelineItem, PHistoryCard },
    template: `
      <PTimeline>
        <PTimelineItem pSize="normal">
          <PHistoryCard
            pDate="03/03/2024"
            pType="Information"
            pEntityIconName="infoCircle"
            pEntity="System"
          >
            <template #text>
              Dossier en cours de traitement.
            </template>
          </PHistoryCard>
        </PTimelineItem>
      </PTimeline>
    `,
  }),
}

export const WithActions: Story = {
  render: () => ({
    components: { PTimeline, PTimelineItem, PHistoryCard, PButton, PIcon, PTooltip },
    template: `
      <PTimeline>
        <PTimelineItem pSize="normal">
          <PHistoryCard
            pDate="03/03/2024"
            pType="Assignation"
            pEntityIconName="person"
            pEntity="Équipe Support"
          >
            <template #text>
              Dossier assigné à l'équipe support.
            </template>
            <template #action>
              <div class="flex gap-2">
                <PTooltip pContent="Modifier l'assignation">
                  <PButton pSize="default" pIconOnly>
                    <PIcon pName="pencilSquare" />
                  </PButton>
                </PTooltip>
                <PTooltip pContent="Supprimer l'assignation">
                  <PButton pSize="default" pIconOnly>
                    <PIcon pName="trash" />
                  </PButton>
                </PTooltip>
              </div>
            </template>
          </PHistoryCard>
        </PTimelineItem>
        <PTimelineItem pSize="normal">
          <PHistoryCard
            pDate="02/03/2024"
            pType="Commentaire"
            pEntityIconName="envelope"
            pEntity="Utilisateur"
          >
            <template #text>
              Commentaire ajouté par l'utilisateur.
            </template>
            <template #action>
              <PTooltip pContent="Répondre">
                <PButton pSize="default" pIconOnly>
                  <PIcon pName="arrowReturnLeft" />
                </PButton>
              </PTooltip>
            </template>
          </PHistoryCard>
        </PTimelineItem>
      </PTimeline>
    `,
  }),
}
