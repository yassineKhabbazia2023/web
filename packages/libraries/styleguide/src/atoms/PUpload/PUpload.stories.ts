import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PUpload from './PUpload.vue'
import PButton from '../PButton/PButton.vue'
import PIcon from '../PIcon/PIcon.vue'

const meta: Meta<typeof PUpload> = {
  title: 'Atoms/PUpload',
  component: PUpload as unknown as any,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Zone de dépôt de fichiers, avec variantes (ligne et dragger).',
      },
    },
  },
}

export default meta
export type Story = StoryObj<typeof meta>

export const ButtonUpload: Story = {
  render: () => ({
    components: { PUpload, PButton, PIcon },
    template: `
      <PUpload pMultiple :pDisabled="false" :pDrag="false">
        <PButton type="primary" size="small">
          <PIcon class="el-button__icon--left" pName="upload" />
          Déposer un document
        </PButton>
      </PUpload>
    `,
  }),
}

export const FileLine: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const uploadDisabled = ref(false)
      return { uploadDisabled }
    },
    template: `
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        pUploadType="file-line"
        pTextLimitSize="5MB"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pColorFileLine="persian"
        :pDisabled="uploadDisabled"
      />
    `,
  }),
}

export const Dragger: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const uploadDisabled = ref(false)
      return { uploadDisabled }
    },
    template: `
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        pUploadType="dragger"
        pTextLimitSize="1GB"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG, PDF ou XLS"
        pColorFileLine="persian"
        :pDisabled="uploadDisabled"
      />
    `,
  }),
}
