import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PDocumentDisplay from './PDocumentDisplay.vue'
import type { PDocumentDisplayProps } from './PDocumentDisplayTypes'
import type { FileExtension } from '@pulse/toolbox/types'

const meta: Meta<typeof PDocumentDisplay> = {
  title: 'Molecules/PDocumentDisplay',
  component: PDocumentDisplay,
  parameters: {
    docs: {
      description: {
        component: 'A document display component for previewing various document types including images, PDFs, and other supported formats.',
      },
    },
    layout: 'fullscreen',
  },
  argTypes: {
    pSrc: {
      control: 'text',
      description: 'Document source URL, Blob, or DocumentPreviewResponse',
      table: {
        type: { summary: 'string | Blob | DocumentPreviewResponse' },
      },
    },
    pDocumentExtension: {
      control: 'select',
      options: [
        'bmp', 'csv', 'doc', 'dot', 'docx', 'dotx', 'docm', 'dotm', 'gif', 'jfif', 'jpe', 'jpeg', 'jpg',
        'msg', 'mp4', 'pdf', 'ppt', 'pptx', 'pot', 'pps', 'ppa', 'ppam', 'png', 'rtf', 'sql', 'tif',
        'tiff', 'txt', 'vsdx', 'xsl', 'xls', 'xlsx', 'xltx', 'xlsm', 'xltm', 'xlam', 'xlsb', 'zip',
        'rar', 'xml', 'pbix', 'ods', 'one', 'onea', 'onetoc', 'onetoc2', 'onetmp', 'onepkg', 'webp',
        'svg', 'ico', 'cur', 'heic', 'md', 'raw',
      ],
      description: 'Document file extension type',
      table: {
        type: { summary: 'FileExtension' },
      },
    },
    pIsLoading: {
      control: 'boolean',
      description: 'Show loading state',
      table: {
        type: { summary: 'boolean' },
      },
    },
    errorMsgTitle: {
      control: 'text',
      description: 'Error message title when preview is unavailable',
      table: {
        type: { summary: 'string' },
      },
    },
    errorMsgText: {
      control: 'text',
      description: 'Error message text when preview is unavailable',
      table: {
        type: { summary: 'string' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PDocumentDisplayProps>

export const ImageDocument: Story = {
  render: (args) => ({
    components: { PDocumentDisplay },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 100vh;">
        <PDocumentDisplay v-bind="args" style="height: 100%;" />
      </div>
    `,
  }),
  args: {
    pSrc: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    pIsLoading: false,
    pDocumentExtension: 'pdf' as FileExtension,
    errorMsgTitle: 'Aperçu indisponible',
    errorMsgText: 'Le format de document n\'est pas supporté',
  },
}

export const LoadingState: Story = {
  render: (args) => ({
    components: { PDocumentDisplay },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 100vh;">
        <PDocumentDisplay v-bind="args" style="height: 100%;" />
      </div>
    `,
  }),
  args: {
    pSrc: 'https://picsum.photos/id/237/200/300',
    pIsLoading: true,
    pDocumentExtension: 'jpeg' as FileExtension,
    errorMsgTitle: 'Aperçu indisponible',
    errorMsgText: 'Le format de document n\'est pas supporté',
  },
}

export const UnsupportedFormat: Story = {
  render: (args) => ({
    components: { PDocumentDisplay },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 100vh;">
        <PDocumentDisplay v-bind="args" style="height: 100%;" />
      </div>
    `,
  }),
  args: {
    pSrc: 'https://picsum.photos/id/237/200/300',
    pIsLoading: false,
    pDocumentExtension: 'raw' as FileExtension,
    errorMsgTitle: 'Aperçu indisponible',
    errorMsgText: 'Le format de document n\'est pas supporté',
  },
}

export const PdfDocument: Story = {
  render: (args) => ({
    components: { PDocumentDisplay },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 100vh;">
        <PDocumentDisplay v-bind="args" style="height: 100%;" />
      </div>
    `,
  }),
  args: {
    pSrc: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf',
    pIsLoading: false,
    pDocumentExtension: 'pdf' as FileExtension,
    errorMsgTitle: 'PDF Preview Unavailable',
    errorMsgText: 'The PDF document could not be loaded',
  },
}

export const PngImage: Story = {
  render: (args) => ({
    components: { PDocumentDisplay },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 100vh;">
        <PDocumentDisplay v-bind="args" style="height: 100%;" />
      </div>
    `,
  }),
  args: {
    pSrc: 'https://picsum.photos/id/237/200/300',
    pIsLoading: false,
    pDocumentExtension: 'png' as FileExtension,
    errorMsgTitle: 'Image Preview Unavailable',
    errorMsgText: 'The image could not be loaded',
  },
}

export const SmallContainer: Story = {
  render: (args) => ({
    components: { PDocumentDisplay },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 400px; width: 600px; border: 2px dashed #ccc; margin: 20px;">
        <h3 style="margin: 0 0 10px 0; text-align: center;">Small Container (400x600)</h3>
        <PDocumentDisplay v-bind="args" style="height: calc(100% - 40px);" />
      </div>
    `,
  }),
  args: {
    pSrc: 'https://picsum.photos/id/237/200/300',
    pIsLoading: false,
    pDocumentExtension: 'jpeg' as FileExtension,
    errorMsgTitle: 'Preview Unavailable',
    errorMsgText: 'Document cannot be displayed',
  },
}

export const CustomErrorMessages: Story = {
  render: (args) => ({
    components: { PDocumentDisplay },
    setup() {
      return { args }
    },
    template: `
      <div style="height: 100vh;">
        <PDocumentDisplay v-bind="args" style="height: 100%;" />
      </div>
    `,
  }),
  args: {
    pSrc: 'https://example.com/nonexistent-document.doc',
    pIsLoading: false,
    pDocumentExtension: 'doc' as FileExtension,
    errorMsgTitle: 'Document Access Denied',
    errorMsgText: 'You do not have permission to view this document or it may not exist.',
  },
}

export const MultipleExtensionSupport: Story = {
  render: (args) => ({
    components: { PDocumentDisplay },
    setup() {
      return { args }
    },
    template: `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; padding: 20px;">
        <div style="border: 1px solid #ddd; height: 200px;">
          <h4 style="margin: 0; padding: 10px; background: #f5f5f5;">JPEG Image</h4>
          <PDocumentDisplay 
            :pSrc="'https://picsum.photos/id/237/200/300'"
            :pIsLoading="false"
            pDocumentExtension="jpeg"
            errorMsgTitle="JPEG Error"
            errorMsgText="Cannot load JPEG image"
            style="height: calc(100% - 50px);"
          />
        </div>
        <div style="border: 1px solid #ddd; height: 200px;">
          <h4 style="margin: 0; padding: 10px; background: #f5f5f5;">PNG Image</h4>
          <PDocumentDisplay 
            :pSrc="'https://picsum.photos/id/237/200/300'"
            :pIsLoading="false"
            pDocumentExtension="png"
            errorMsgTitle="PNG Error"
            errorMsgText="Cannot load PNG image"
            style="height: calc(100% - 50px);"
          />
        </div>
        <div style="border: 1px solid #ddd; height: 200px;">
          <h4 style="margin: 0; padding: 10px; background: #f5f5f5;">Unsupported (RAW)</h4>
          <PDocumentDisplay 
            :pSrc="'https://example.com/document.raw'"
            :pIsLoading="false"
            pDocumentExtension="raw"
            errorMsgTitle="Unsupported Format"
            errorMsgText="RAW format is not supported for preview"
            style="height: calc(100% - 50px);"
          />
        </div>
      </div>
    `,
  }),
  args: {},
}
