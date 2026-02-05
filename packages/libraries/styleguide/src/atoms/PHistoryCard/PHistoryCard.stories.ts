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
    pDateColor: {
      control: 'select',
      options: ['dark-blue', 'green', 'red', 'orange', 'info', 'success', 'warning', 'danger'],
      description: 'The color of the date tag',
    },
    pTime: {
      control: 'text',
      description: 'The time of the history event (optional)',
    },
    pType: {
      control: 'text',
      description: 'The type of the history event',
    },
    pDescription: {
      control: 'text',
      description: 'Additional description tag (optional)',
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
    pHasAccordion: {
      control: 'boolean',
      description: 'Enable accordion mode to show/hide details',
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

export const WithTimeAndDescription: Story = {
  args: {
    pDate: '15/01/2024',
    pTime: '10:30',
    pType: 'Modification',
    pDescription: 'Comptabilité',
    pEntity: 'Entreprise ABC',
    pEntityIconName: 'building',
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
            <span style="font-weight: bold;">Jean DUPONT</span>
            a modifié les paramètres de l'entité.
          </template>
          <template #action>
            <PTooltip pContent="Voir les détails">
              <PButton pSize="default" pIconOnly>
                <PIcon pName="eye" />
              </PButton>
            </PTooltip>
          </template>
        </PHistoryCard>
      </div>
    `,
  }),
}

export const WithCustomDateColor: Story = {
  args: {
    pDate: '01/01/2024',
    pDateColor: 'green',
    pType: 'Validation',
    pEntity: 'Dossier validé',
    pEntityIconName: 'checkCircle',
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
            Le dossier a été validé avec succès.
          </template>
        </PHistoryCard>
      </div>
    `,
  }),
}

export const WithAccordion: Story = {
  args: {
    pDate: '10/02/2024',
    pTime: '14:45',
    pType: 'Dépôt',
    pDescription: 'GED Sociale',
    pEntity: 'Société XYZ',
    pEntityIconName: 'shop',
    pHasAccordion: true,
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
            <span style="font-weight: bold;">Marie MARTIN</span>
            a déposé 3 documents dans la GED.
          </template>
          <template #details>
            <div style="padding: 12px 0;">
              <p style="margin-bottom: 8px;"><strong>Documents déposés :</strong></p>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Bulletin de paie - Janvier 2024.pdf</li>
                <li>Contrat de travail - CDI.pdf</li>
                <li>Attestation employeur.pdf</li>
              </ul>
            </div>
          </template>
        </PHistoryCard>
      </div>
    `,
  }),
}

export const WithAccordionAndAction: Story = {
  args: {
    pDate: '25/03/2024',
    pTime: '09:15',
    pType: 'Import',
    pDescription: 'Comptabilité',
    pEntity: 'Cabinet Comptable',
    pEntityIconName: 'building',
    pHasAccordion: true,
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
            <span style="font-weight: bold;">Pierre DURAND</span>
            a importé les écritures comptables du mois.
          </template>
          <template #action>
            <PTooltip pContent="Télécharger">
              <PButton pSize="default" pIconOnly>
                <PIcon pName="download" />
              </PButton>
            </PTooltip>
          </template>
          <template #details>
            <div style="padding: 12px 0;">
              <p style="margin-bottom: 8px;"><strong>Résumé de l'import :</strong></p>
              <ul style="margin: 0; padding-left: 20px;">
                <li>245 écritures importées</li>
                <li>Total débit : 125 430,00 EUR</li>
                <li>Total crédit : 125 430,00 EUR</li>
                <li>Période : Mars 2024</li>
              </ul>
            </div>
          </template>
        </PHistoryCard>
      </div>
    `,
  }),
}

export const FullExample: Story = {
  args: {
    pDate: '18/04/2024',
    pDateColor: 'success',
    pTime: '16:30',
    pType: 'Validation',
    pDescription: 'Bilan annuel',
    pEntity: 'Groupe Industriel SA',
    pEntityIconName: 'building',
    pHasAccordion: true,
  },
  render: (args) => ({
    components: { PHistoryCard, PButton, PIcon, PTooltip },
    setup() {
      return { args }
    },
    template: `
      <div style="width: 800px; padding: 24px;">
        <PHistoryCard v-bind="args">
          <template #text>
            <span style="font-weight: bold;">Sophie BERNARD</span>
            a validé le bilan annuel 2023 de l'entreprise.
          </template>
          <template #action>
            <PTooltip pContent="Voir le document">
              <PButton pSize="default" pIconOnly>
                <PIcon pName="eye" />
              </PButton>
            </PTooltip>
          </template>
          <template #details>
            <div style="padding: 12px 0;">
              <p style="margin-bottom: 12px;"><strong>Détails de la validation :</strong></p>
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0;">Chiffre d'affaires</td>
                  <td style="padding: 8px 0; text-align: right;">2 450 000 EUR</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0;">Résultat net</td>
                  <td style="padding: 8px 0; text-align: right;">185 000 EUR</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0;">Capitaux propres</td>
                  <td style="padding: 8px 0; text-align: right;">750 000 EUR</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">Effectif moyen</td>
                  <td style="padding: 8px 0; text-align: right;">45 salariés</td>
                </tr>
              </table>
            </div>
          </template>
        </PHistoryCard>
      </div>
    `,
  }),
}
