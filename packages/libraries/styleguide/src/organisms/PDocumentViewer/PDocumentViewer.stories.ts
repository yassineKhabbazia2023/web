import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PDocumentViewer from './PDocumentViewer.vue'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import PUploadMultiple from '../../atoms/PUploadMultiple'
import PDocumentDisplay from '../../molecules/PDocumentDisplay'
import { PDocumentViewerProps } from './PDocumentViewerTypes'

const meta: Meta<typeof PDocumentViewer> = {
  title: 'Organisms/PDocumentViewer',
  component: PDocumentViewer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A document viewer component that displays documents in a drawer with navigation controls and document information.',
      },
    },
  },
  argTypes: {
    modelValue: {
      control: 'boolean',
      description: 'Whether the document viewer is visible',
      table: {
        type: { summary: 'boolean' },
      },
    },
    pSize: {
      control: 'text',
      description: 'Size of the drawer',
      table: {
        type: { summary: 'string | number' },
        defaultValue: { summary: '100%' },
      },
    },
    pDirection: {
      control: 'select',
      options: ['rtl', 'ltr', 'ttb', 'btt'],
      description: 'Direction of the drawer',
      table: {
        type: { summary: "'rtl' | 'ltr' | 'ttb' | 'btt'" },
        defaultValue: { summary: 'rtl' },
      },
    },
    pShowClose: {
      control: 'boolean',
      description: 'Whether to show the close button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    pDestroyOnClose: {
      control: 'boolean',
      description: 'Whether to destroy the drawer when closed',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pTitleDocument: {
      control: 'text',
      description: 'Title of the document',
      table: {
        type: { summary: 'string' },
      },
    },
    pActiveDocument: {
      control: 'number',
      description: 'Index of the active document',
      table: {
        type: { summary: 'string | number' },
      },
    },
    pTotalDocuments: {
      control: 'number',
      description: 'Total number of documents',
      table: {
        type: { summary: 'string | number' },
      },
    },
    pHasIcon: {
      control: 'boolean',
      description: 'Whether to show the document icon',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pHasPagination: {
      control: 'boolean',
      description: 'Whether to show pagination controls',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pShowCloseButton: {
      control: 'boolean',
      description: 'Whether to show the close button in header',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pShowPreviousDocument: {
      control: 'boolean',
      description: 'Whether to show the previous document button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pShowNextDocument: {
      control: 'boolean',
      description: 'Whether to show the next document button',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  tags: ['!autodocs'],
}

export default meta
type Story = StoryObj<PDocumentViewerProps>

export const Default: Story = {
  render: (args) => ({
    components: { PDocumentViewer, PButton, PIcon, PUploadMultiple, PDocumentDisplay },
    setup() {
      const isDrawerOpened = ref(false)
      const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
      const extension = ref('jpeg')

      const openViewer = () => {
        isDrawerOpened.value = true
      }

      const pickedFiles = ref<File[]>([])

      const handleFilesSelected = (data: File[]) => {
        if (data.length === 0) {
          return
        }
        url.value = URL.createObjectURL(data[0])
        extension.value = 'pdf'
        pickedFiles.value = []
      }

      return {
        args,
        isDrawerOpened,
        url,
        extension,
        openViewer,
        pickedFiles,
        handleFilesSelected,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PButton @click="openViewer">
          Open Document Viewer
        </PButton>

        <PDocumentViewer
          v-model="isDrawerOpened"
          :pSize="args.pSize"
          :pDirection="args.pDirection"
          :pShowClose="args.pShowClose"
          :pDestroyOnClose="args.pDestroyOnClose"
          :pTitleDocument="args.pTitleDocument"
          :pActiveDocument="args.pActiveDocument"
          :pTotalDocuments="args.pTotalDocuments"
          :pHasIcon="args.pHasIcon"
          :pHasPagination="args.pHasPagination"
          :pShowCloseButton="args.pShowCloseButton"
          :pShowPreviousDocument="args.pShowPreviousDocument"
          :pShowNextDocument="args.pShowNextDocument"
        >
          <template #iconDocument>
            <PIcon pName="filetypePdf" />
          </template>
          <template #media>
            <PDocumentDisplay
              :pSrc="url"
              :pIsLoading="false"
              :pDocumentExtension="extension"
              errorMsgTitle="Aperçu indisponible"
              errorMsgText="Le format de document n'est pas supporté"
            />
          </template>
          <template #content>
            <div style="margin-bottom: 16px;">
              You can find here document details such as owner email, creation date, file size, etc.
              Please upload a PDF file to visualize the document properly.
            </div>
            <PUploadMultiple
              v-model="pickedFiles"
              :pDisabled="false"
              @update:model-value="handleFilesSelected"
            >
              <PButton type="primary" size="small">
                <PIcon class="el-button__icon--left" pName="upload" />
                Upload PDF Document
              </PButton>
            </PUploadMultiple>
          </template>
        </PDocumentViewer>
      </div>
    `,
  }),
  args: {
    pSize: '100%',
    pDirection: 'rtl',
    pShowClose: false,
    pDestroyOnClose: true,
    pTitleDocument: 'Facture-achat_20643228.jpeg',
    pActiveDocument: 5,
    pTotalDocuments: 25,
    pHasIcon: true,
    pHasPagination: true,
    pShowCloseButton: true,
    pShowPreviousDocument: true,
    pShowNextDocument: true,
  },
}

