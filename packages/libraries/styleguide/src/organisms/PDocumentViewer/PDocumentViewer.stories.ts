import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PDocumentViewer from './PDocumentViewer.vue'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import PUpload from '../../atoms/PUpload'
import PDocumentDisplay from '../../molecules/PDocumentDisplay'
import type { PDocumentViewerProps } from './PDocumentViewerTypes'

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
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof PDocumentViewer>

export const Default: Story = {
  render: (args: PDocumentViewerProps) => ({
    components: { PDocumentViewer, PButton, PIcon, PUpload, PDocumentDisplay },
    setup() {
      const isDrawerOpened = ref(false)
      const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')
      const extension = ref('jpeg')

      const openViewer = () => {
        isDrawerOpened.value = true
      }

      const handleFilesSelected = (data: File[]) => {
        url.value = URL.createObjectURL(data[0])
        extension.value = 'pdf'
      }

      return {
        args,
        isDrawerOpened,
        url,
        extension,
        openViewer,
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
            <PUpload
              pMultiple
              :pDisabled="false"
              :pDrag="false"
              @files-selected="handleFilesSelected"
            >
              <PButton type="primary" size="small">
                <PIcon class="el-button__icon--left" pName="upload" />
                Upload PDF Document
              </PButton>
            </PUpload>
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

export const SingleDocument: Story = {
  render: (args: PDocumentViewerProps) => ({
    components: { PDocumentViewer, PButton, PIcon, PDocumentDisplay },
    setup() {
      const isDrawerOpened = ref(false)
      const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')

      const openViewer = () => {
        isDrawerOpened.value = true
      }

      return {
        args,
        isDrawerOpened,
        url,
        openViewer,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PButton @click="openViewer">
          View Single Document
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
            <PIcon pName="filetypePng" />
          </template>
          <template #media>
            <PDocumentDisplay
              :pSrc="url"
              :pIsLoading="false"
              :pDocumentExtension="'jpeg'"
              errorMsgTitle="Preview unavailable"
              errorMsgText="Document format not supported"
            />
          </template>
          <template #content>
            <div>
              <h4>Document Details</h4>
              <p><strong>Filename:</strong> single-image.jpeg</p>
              <p><strong>Size:</strong> 245 KB</p>
              <p><strong>Created:</strong> March 15, 2024</p>
              <p><strong>Owner:</strong> john.doe@example.com</p>
            </div>
          </template>
        </PDocumentViewer>
      </div>
    `,
  }),
  args: {
    pSize: '80%',
    pDirection: 'rtl',
    pShowClose: false,
    pDestroyOnClose: true,
    pTitleDocument: 'single-image.jpeg',
    pActiveDocument: 1,
    pTotalDocuments: 1,
    pHasIcon: true,
    pHasPagination: false,
    pShowCloseButton: true,
    pShowPreviousDocument: false,
    pShowNextDocument: false,
  },
}

export const LeftDrawer: Story = {
  render: (args: PDocumentViewerProps) => ({
    components: { PDocumentViewer, PButton, PIcon, PDocumentDisplay },
    setup() {
      const isDrawerOpened = ref(false)
      const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')

      const openViewer = () => {
        isDrawerOpened.value = true
      }

      return {
        args,
        isDrawerOpened,
        url,
        openViewer,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PButton @click="openViewer">
          Open Left Drawer
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
              :pDocumentExtension="'jpeg'"
              errorMsgTitle="Preview unavailable"
              errorMsgText="Document format not supported"
            />
          </template>
          <template #content>
            <div>
              <h4>Document Information</h4>
              <p>This viewer opens from the left side of the screen.</p>
              <p><strong>Navigation:</strong> Use the arrow buttons to navigate between documents.</p>
            </div>
          </template>
        </PDocumentViewer>
      </div>
    `,
  }),
  args: {
    pSize: '60%',
    pDirection: 'ltr',
    pShowClose: false,
    pDestroyOnClose: true,
    pTitleDocument: 'document-from-left.pdf',
    pActiveDocument: 3,
    pTotalDocuments: 10,
    pHasIcon: true,
    pHasPagination: true,
    pShowCloseButton: true,
    pShowPreviousDocument: true,
    pShowNextDocument: true,
  },
}

export const WithoutNavigation: Story = {
  render: (args: PDocumentViewerProps) => ({
    components: { PDocumentViewer, PButton, PIcon, PDocumentDisplay },
    setup() {
      const isDrawerOpened = ref(false)
      const url = ref('https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg')

      const openViewer = () => {
        isDrawerOpened.value = true
      }

      return {
        args,
        isDrawerOpened,
        url,
        openViewer,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PButton @click="openViewer">
          View Document (No Navigation)
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
            <PIcon pName="filetypeDocx" />
          </template>
          <template #media>
            <PDocumentDisplay
              :pSrc="url"
              :pIsLoading="false"
              :pDocumentExtension="'jpeg'"
              errorMsgTitle="Preview unavailable"
              errorMsgText="Document format not supported"
            />
          </template>
          <template #content>
            <div>
              <h4>Document Details</h4>
              <p>This viewer has no navigation controls and shows only the current document.</p>
              <p><strong>Document Type:</strong> Word Document</p>
              <p><strong>Status:</strong> Read Only</p>
            </div>
          </template>
        </PDocumentViewer>
      </div>
    `,
  }),
  args: {
    pSize: '50%',
    pDirection: 'rtl',
    pShowClose: false,
    pDestroyOnClose: true,
    pTitleDocument: 'readonly-document.docx',
    pActiveDocument: 1,
    pTotalDocuments: 1,
    pHasIcon: false,
    pHasPagination: false,
    pShowCloseButton: true,
    pShowPreviousDocument: false,
    pShowNextDocument: false,
  },
}
