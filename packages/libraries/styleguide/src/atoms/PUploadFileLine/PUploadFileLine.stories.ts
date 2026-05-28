import type { Meta, StoryObj } from '@storybook/vue3-vite'
import PUploadFileLine from './PUploadFileLine.vue'
import type { UploadFile } from 'element-plus'

const meta: Meta<typeof PUploadFileLine> = {
  title: 'Atoms/PUploadFileLine',
  component: PUploadFileLine as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Ligne de fichier uploadé avec statut et action bouton.',
      },
    },
  },
  decorators: [
    () => ({ template: '<div style="min-width: 600px;"><story /></div>' }),
  ],
}

export default meta
export type Story = StoryObj<typeof meta>

const wrapperStyle = 'padding: 16px; margin: 16px; display: flex; flex-direction: column; gap: 16px;'

export const Ready: Story = {
  render: () => ({
    components: { PUploadFileLine },
    setup() {
      const file: UploadFile = { name: 'carte-identite.pdf', status: 'ready', uid: 1 }
      return { file }
    },
    template: `
      <div style="${wrapperStyle}">
        <PUploadFileLine
          pIconName="filetypePdf"
          :pFile="file"
          :pStatus="file.status"
          pHasButton
          pButtonIconName="trash"
          pTitleButton="Supprimer le document"
        />
        <PUploadFileLine
          pIsMultiLine
          pIconName="filetypePdf"
          :pFile="file"
          :pStatus="file.status"
          pHasButton
          pButtonIconName="trash"
          pTitleButton="Supprimer le document"
        />
      </div>
    `,
  }),
}

export const Success: Story = {
  render: () => ({
    components: { PUploadFileLine },
    setup() {
      const file: UploadFile = { name: 'justificatif-domicile.png', status: 'success', uid: 1 }
      return { file }
    },
    template: `
      <div style="${wrapperStyle}">
        <PUploadFileLine
          pIconName="filetypePng"
          :pFile="file"
          :pStatus="file.status"
          pHasButton
          pButtonIconName="trash"
          pTitleButton="Supprimer le document"
        />
        <PUploadFileLine
          pIsMultiLine
          pIconName="filetypePng"
          :pFile="file"
          :pStatus="file.status"
          pHasButton
          pButtonIconName="trash"
          pTitleButton="Supprimer le document"
        />
      </div>
    `,
  }),
}

export const Uploading: Story = {
  render: () => ({
    components: { PUploadFileLine },
    setup() {
      const file: UploadFile = { name: 'rib.pdf', status: 'uploading', uid: 1 }
      return { file }
    },
    template: `
      <div style="${wrapperStyle}">
        <PUploadFileLine
          pIconName="filetypePdf"
          :pFile="file"
          :pStatus="file.status"
        />
        <PUploadFileLine
          pIsMultiLine
          pIconName="filetypePdf"
          :pFile="file"
          :pStatus="file.status"
        />
      </div>
    `,
  }),
}

export const Fail: Story = {
  render: () => ({
    components: { PUploadFileLine },
    setup() {
      const file: UploadFile = { name: 'document-corrompu.pdf', status: 'fail', uid: 1 }
      return { file }
    },
    template: `
      <div style="${wrapperStyle}">
        <PUploadFileLine
          pIconName="filetypePdf"
          :pFile="file"
          :pStatus="file.status"
        />
        <PUploadFileLine
          pIsMultiLine
          pIconName="filetypePdf"
          :pFile="file"
          :pStatus="file.status"
        />
      </div>
    `,
  }),
}
