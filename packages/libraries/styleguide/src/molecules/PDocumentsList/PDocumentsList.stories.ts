import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PDocumentsList from './PDocumentsList.vue'
import type { DocumentsListItem, PDocumentsListProps } from './PDocumentsListTypes'

const meta: Meta<typeof PDocumentsList> = {
  title: 'Molecules/PDocumentsList',
  component: PDocumentsList,
  parameters: {
    docs: {
      description: {
        component:
          'A table listing documents with an extension icon, deposit date and an actions column (download by default).',
      },
    },
  },
  argTypes: {
    pData: {
      control: 'object',
      description: 'Array of documents to display',
    },
    pStripe: {
      control: 'boolean',
      description: 'Whether the rows are striped',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    pVisibleColumns: {
      control: 'object',
      description: 'Columns to display, in their fixed order (all columns by default)',
    },
    pSelectable: {
      control: 'boolean',
      description: 'Whether a leading selection column (with a select-all header checkbox) is displayed',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PDocumentsListProps>

const baseData: DocumentsListItem[] = [
  {
    documentId: '1',
    documentName: 'contract-final.pdf',
    documentDepositDate: '15/03/2024',
    documentDepositedBy: 'Marie Dupont',
    documentDepositedByInitials: 'MD',
  },
  {
    documentId: '2',
    documentName: 'report-annual.docx',
    documentDepositDate: '02/04/2024',
    documentDepositedBy: 'Jean Martin',
    documentDepositedByInitials: 'JM',
  },
  {
    documentId: '3',
    documentName: 'screenshot-2024.png',
    documentDepositDate: '12/05/2024',
    documentDepositedBy: 'Marie Dupont',
    documentDepositedByInitials: 'MD',
  },
  {
    documentId: '4',
    documentName: 'spreadsheet.xlsx',
    documentDepositDate: '21/05/2024',
    documentDepositedBy: 'Paul Bernard',
    documentDepositedByInitials: 'PB',
  },
  {
    documentId: '5',
    documentName: 'unknown-file.zzz',
    documentDepositDate: '01/06/2024',
    documentDepositedBy: 'Jean Martin',
    documentDepositedByInitials: 'JM',
  },
]

export const Default: Story = {
  render: (args) => ({
    components: { PDocumentsList },
    setup() {
      const onDownload = (documentId: string) => {
        console.log('Download document', documentId)
      }
      return { args, onDownload }
    },
    template: `
      <PDocumentsList v-bind="args" @download="onDownload" />
    `,
  }),
  args: {
    pData: baseData,
    pStripe: false,
  },
}

export const Striped: Story = {
  render: (args) => ({
    components: { PDocumentsList },
    setup() {
      const onDownload = (documentId: string) => {
        console.log('Download document', documentId)
      }
      return { args, onDownload }
    },
    template: `
      <PDocumentsList v-bind="args" @download="onDownload" />
    `,
  }),
  args: {
    pData: baseData,
    pStripe: true,
  },
}

export const WithCustomOptions: Story = {
  render: (args) => ({
    components: { PDocumentsList },
    setup() {
      const onDownload = (documentId: string) => {
        console.log('Download document', documentId)
      }
      const onOption = (event: string, documentId: string) => {
        console.log('Option', event, 'for document', documentId)
      }
      return { args, onDownload, onOption }
    },
    template: `
      <PDocumentsList
        v-bind="args"
        @download="onDownload"
        @option="onOption"
      />
    `,
  }),
  args: {
    pData: [
      {
        documentId: '1',
        documentName: 'contract-final.pdf',
        documentDepositDate: '15/03/2024',
        documentDepositedBy: 'Marie Dupont',
        documentDepositedByInitials: 'MD',
      },
      {
        documentId: '2',
        documentName: 'report-annual.docx',
        documentDepositDate: '02/04/2024',
        documentDepositedBy: 'Jean Martin',
        documentDepositedByInitials: 'JM',
        options: [
          { iconName: 'eye', event: 'preview' },
          { iconName: 'download', event: 'download' },
        ],
      },
      {
        documentId: '3',
        documentName: 'screenshot-2024.png',
        documentDepositDate: '12/05/2024',
        documentDepositedBy: 'Paul Bernard',
        documentDepositedByInitials: 'PB',
        options: [
          { iconName: 'trash', event: 'delete' },
        ],
      },
    ],
    pStripe: false,
  },
}

export const Selectable: Story = {
  render: (args) => ({
    components: { PDocumentsList },
    setup() {
      const onDownload = (documentId: string) => {
        console.log('Download document', documentId)
      }
      const onSelectionChange = (selected: DocumentsListItem[]) => {
        console.log('Selection changed', selected.map(document => document.documentId))
      }
      return { args, onDownload, onSelectionChange }
    },
    template: `
      <PDocumentsList
        v-bind="args"
        @download="onDownload"
        @selection-change="onSelectionChange"
      />
    `,
  }),
  args: {
    pData: baseData,
    pStripe: false,
    pSelectable: true,
  },
}

export const WithVisibleColumns: Story = {
  render: (args) => ({
    components: { PDocumentsList },
    setup() {
      const onDownload = (documentId: string) => {
        console.log('Download document', documentId)
      }
      return { args, onDownload }
    },
    template: `
      <PDocumentsList v-bind="args" @download="onDownload" />
    `,
  }),
  args: {
    pData: baseData,
    pStripe: false,
    pVisibleColumns: ['name', 'depositDate', 'options'],
  },
}

export const WithEllipsis: Story = {
  render: (args) => ({
    components: { PDocumentsList },
    setup() {
      return { args }
    },
    template: `
      <PDocumentsList v-bind="args" />
    `,
  }),
  args: {
    pData: [
      {
        documentId: '1',
        documentName: 'compte-rendu-assemblee-generale-extraordinaire-approbation-des-comptes-annuels-2024.pdf',
        documentDepositDate: '15/03/2024',
        documentDepositedBy: 'Marie Dupont',
        documentDepositedByInitials: 'MD',
      },
      {
        documentId: '2',
        documentName: 'attestation-de-vigilance-urssaf-premier-trimestre-2024-entreprise-dupont-et-associes.docx',
        documentDepositDate: '02/04/2024',
        documentDepositedBy: 'Jean Martin',
        documentDepositedByInitials: 'JM',
      },
      {
        documentId: '3',
        documentName: 'capture-ecran-tableau-de-bord-analytique-performances-commerciales-mai-2024-version-finale.png',
        documentDepositDate: '12/05/2024',
        documentDepositedBy: 'Marie Dupont',
        documentDepositedByInitials: 'MD',
      },
      {
        documentId: '4',
        documentName: 'tableau-previsionnel-tresorerie-consolidee-groupe-exercice-2024-2025-revision-definitive.xlsx',
        documentDepositDate: '21/05/2024',
        documentDepositedBy: 'Paul Bernard',
        documentDepositedByInitials: 'PB',
      },
      {
        documentId: '5',
        documentName: 'archive-complete-justificatifs-comptables-factures-fournisseurs-premier-semestre-2024.zip',
        documentDepositDate: '01/06/2024',
        documentDepositedBy: 'Jean Martin',
        documentDepositedByInitials: 'JM',
      },
    ],
    pStripe: false,
  },
}
