import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PFileCard from './PFileCard.vue'
import PButton from '../../atoms/PButton'
import PIcon from '../../atoms/PIcon'
import type { PFileCardProps } from './PFileCardTypes'

const meta: Meta<typeof PFileCard> = {
  title: 'Molecules/PFileCard',
  component: PFileCard,
  parameters: {
    docs: {
      description: {
        component: 'A file card component that displays file information with customizable icon and action buttons.',
      },
    },
  },
  argTypes: {
    pName: {
      control: 'text',
      description: 'Name of the file',
      table: {
        type: { summary: 'string' },
      },
    },
    pFormat: {
      control: 'text',
      description: 'File format/extension',
      table: {
        type: { summary: 'string' },
      },
    },
    pSize: {
      control: 'text',
      description: 'File size display',
      table: {
        type: { summary: 'string' },
      },
    },
    pHasIcon: {
      control: 'boolean',
      description: 'Whether to show the file icon slot',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    pHasButton: {
      control: 'boolean',
      description: 'Whether to show the action buttons slot',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<PFileCardProps>

export const Default: Story = {
  render: (args) => ({
    components: { PFileCard, PButton, PIcon },
    setup() {
      const handleDownload = () => {
        console.log('Download clicked')
      }

      const handleView = () => {
        console.log('View clicked')
      }

      return {
        args,
        handleDownload,
        handleView,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFileCard v-bind="args">
          <template #icon>
            <PIcon pName="filetypePdf" />
          </template>
          <template #buttons>
            <PButton
              class="el-button--icon"
              pType="white"
              @click="handleDownload"
            >
              <PIcon pName="download" />
            </PButton>
            <PButton
              class="el-button--icon"
              pType="white"
              @click="handleView"
            >
              <PIcon pName="eye" />
            </PButton>
          </template>
        </PFileCard>
      </div>
    `,
  }),
  args: {
    pName: 'mandat-1000308253-12248236612-signature.pdf',
    pFormat: 'PDF',
    pSize: '25KB',
    pHasIcon: true,
    pHasButton: true,
  },
}

export const WithoutIcon: Story = {
  render: (args) => ({
    components: { PFileCard, PButton, PIcon },
    setup() {
      const handleDownload = () => {
        console.log('Download clicked')
      }

      const handleView = () => {
        console.log('View clicked')
      }

      return {
        args,
        handleDownload,
        handleView,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFileCard v-bind="args">
          <template #buttons>
            <PButton
              class="el-button--icon"
              pType="white"
              @click="handleDownload"
            >
              <PIcon pName="download" />
            </PButton>
            <PButton
              class="el-button--icon"
              pType="white"
              @click="handleView"
            >
              <PIcon pName="eye" />
            </PButton>
          </template>
        </PFileCard>
      </div>
    `,
  }),
  args: {
    pName: 'mandat-1000308253-12248236612-signature.png',
    pFormat: 'PNG',
    pSize: '45KB',
    pHasIcon: false,
    pHasButton: true,
  },
}

export const WithoutButtons: Story = {
  render: (args) => ({
    components: { PFileCard, PIcon },
    setup() {
      return {
        args,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFileCard v-bind="args">
          <template #icon>
            <PIcon pName="filetypeDocx" />
          </template>
        </PFileCard>
      </div>
    `,
  }),
  args: {
    pName: 'document-important.docx',
    pFormat: 'DOCX',
    pSize: '120KB',
    pHasIcon: true,
    pHasButton: false,
  },
}

export const MinimalCard: Story = {
  render: (args) => ({
    components: { PFileCard },
    setup() {
      return {
        args,
      }
    },
    template: `
      <div style="padding: 20px;">
        <PFileCard v-bind="args" />
      </div>
    `,
  }),
  args: {
    pName: 'simple-file.txt',
    pFormat: 'TXT',
    pSize: '2KB',
    pHasIcon: false,
    pHasButton: false,
  },
}

export const DifferentFileTypes: Story = {
  render: () => ({
    components: { PFileCard, PButton, PIcon },
    setup() {
      const handleAction = (action: string, fileName: string) => {
        console.log(`${action} action for ${fileName}`)
      }

      return {
        handleAction,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Different File Types</h3>
        <div style="display: grid; gap: 16px; max-width: 400px;">
          <div>
            <h4>PDF File</h4>
            <PFileCard
              pName="contract-final.pdf"
              pFormat="PDF"
              pSize="1.2MB"
              :pHasIcon="true"
              :pHasButton="true"
            >
              <template #icon>
                <PIcon pName="filetypePdf" />
              </template>
              <template #buttons>
                <PButton
                  class="el-button--icon"
                  pType="white"
                  @click="handleAction('download', 'contract-final.pdf')"
                >
                  <PIcon pName="download" />
                </PButton>
                <PButton
                  class="el-button--icon"
                  pType="white"
                  @click="handleAction('view', 'contract-final.pdf')"
                >
                  <PIcon pName="eye" />
                </PButton>
              </template>
            </PFileCard>
          </div>

          <div>
            <h4>Image File</h4>
            <PFileCard
              pName="screenshot-2024.png"
              pFormat="PNG"
              pSize="890KB"
              :pHasIcon="true"
              :pHasButton="true"
            >
              <template #icon>
                <PIcon pName="filetypePng" />
              </template>
              <template #buttons>
                <PButton
                  class="el-button--icon"
                  pType="white"
                  @click="handleAction('download', 'screenshot-2024.png')"
                >
                  <PIcon pName="download" />
                </PButton>
                <PButton
                  class="el-button--icon"
                  pType="white"
                  @click="handleAction('view', 'screenshot-2024.png')"
                >
                  <PIcon pName="eye" />
                </PButton>
              </template>
            </PFileCard>
          </div>

          <div>
            <h4>Word Document</h4>
            <PFileCard
              pName="report-2024-annual.docx"
              pFormat="DOCX"
              pSize="245KB"
              :pHasIcon="true"
              :pHasButton="true"
            >
              <template #icon>
                <PIcon pName="filetypeDocx" />
              </template>
              <template #buttons>
                <PButton
                  class="el-button--icon"
                  pType="white"
                  @click="handleAction('download', 'report-2024-annual.docx')"
                >
                  <PIcon pName="download" />
                </PButton>
                <PButton
                  class="el-button--icon"
                  pType="white"
                  @click="handleAction('edit', 'report-2024-annual.docx')"
                >
                  <PIcon pName="pencilSquare" />
                </PButton>
              </template>
            </PFileCard>
          </div>
        </div>
      </div>
    `,
  }),
  args: {},
}
