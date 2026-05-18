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
  },
  {
    documentId: '2',
    documentName: 'report-annual.docx',
    documentDepositDate: '02/04/2024',
  },
  {
    documentId: '3',
    documentName: 'screenshot-2024.png',
    documentDepositDate: '12/05/2024',
  },
  {
    documentId: '4',
    documentName: 'spreadsheet.xlsx',
    documentDepositDate: '21/05/2024',
  },
  {
    documentId: '5',
    documentName: 'unknown-file.zzz',
    documentDepositDate: '01/06/2024',
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
      },
      {
        documentId: '2',
        documentName: 'report-annual.docx',
        documentDepositDate: '02/04/2024',
        options: [
          { iconName: 'eye', event: 'preview' },
          { iconName: 'download', event: 'download' },
        ],
      },
      {
        documentId: '3',
        documentName: 'screenshot-2024.png',
        documentDepositDate: '12/05/2024',
        options: [
          { iconName: 'trash', event: 'delete' },
        ],
      },
    ],
    pStripe: false,
  },
}
