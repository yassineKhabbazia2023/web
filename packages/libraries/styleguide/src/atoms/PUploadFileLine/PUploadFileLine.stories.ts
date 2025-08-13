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
}

export default meta
export type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => ({
    components: { PUploadFileLine },
    setup() {
      const fileList: UploadFile[] = [
        { name: 'Nom du document.pdf', status: 'success', uid: 1 },
        { name: 'Image.jpeg', status: 'uploading', uid: 2 },
        { name: 'Test.GIF', status: 'fail', uid: 3 },
      ]
      return { fileList }
    },
    template: `
      <div style="padding: 16px; margin: 16px;">
        <PUploadFileLine pIconName="filetypePdf" :pFile="fileList[0]" :pStatus="fileList[0].status" pHasButton pButtonIconName="trash" pTitleButton="Supprimer le document" />
        <PUploadFileLine :pFile="fileList[1]" :pStatus="fileList[1].status" pIconName="filetypePdf" />
        <PUploadFileLine :pFile="fileList[2]" :pStatus="fileList[2].status" pIconName="filetypePdf" pHasButton pButtonIconName="trash" pTitleButton="Supprimer le document" />
      </div>
    `,
  }),
}
