import type { Meta, StoryObj } from '@storybook/vue3-vite'
import type { UploadFile } from 'element-plus'
import { ref } from 'vue'
import PUpload from './PUpload.vue'
import { PUploadType } from './PUpload.enums'
import PButton from '../PButton/PButton.vue'
import PIcon from '../PIcon/PIcon.vue'

const buildUploadFile = (name: string, uid: number, size: number): UploadFile => ({
  name,
  uid,
  size,
  status: 'success',
  percentage: 100,
})

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
  decorators: [
    () => ({ template: '<div style="min-width: 600px;"><story /></div>' }),
  ],
}

export default meta
export type Story = StoryObj<typeof meta>

export const ButtonUpload: Story = {
  render: () => ({
    components: { PUpload, PButton, PIcon },
    template: `
      <div style="display: flex; justify-content: center;">
        <PUpload pMultiple :pDisabled="false" :pDrag="false">
          <PButton type="primary" size="small">
            <PIcon class="el-button__icon--left" pName="upload" />
            Déposer un document
          </PButton>
        </PUpload>
      </div>
    `,
  }),
}

export const FileLine: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const uploadDisabled = ref(false)
      return { uploadDisabled, PUploadType }
    },
    template: `
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        :pUploadType="PUploadType.FILE_LINE"
        pTextLimitSize="5MB"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pColorFileLine="persian"
        :pDisabled="uploadDisabled"
      />
    `,
  }),
}

export const FileLineSingleFileUploaded: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const initialFiles: UploadFile[] = [
        buildUploadFile('carte-identite.pdf', 1, 256_000),
      ]
      return { initialFiles, PUploadType }
    },
    template: `
      <PUpload
        pDrag
        pShowFileList
        :pUploadType="PUploadType.FILE_LINE"
        pTextLimitSize="5MB"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pColorFileLine="persian"
        :pInitialFiles="initialFiles"
      />
    `,
  }),
}

export const FileLineSingleFileWithAcceptedExtensions: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      return { PUploadType }
    },
    template: `
      <PUpload
        pDrag
        pShowFileList
        :pUploadType="PUploadType.FILE_LINE"
        pTextLimitSize="5MB"
        pAccept=".jpg"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPG"
        pColorFileLine="persian"
      />
    `,
  }),
}

export const FileLineWithLabel: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const uploadDisabled = ref(false)
      return { uploadDisabled, PUploadType }
    },
    template: `
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        :pUploadType="PUploadType.FILE_LINE"
        pLabel="Pièce d'identité"
        pTextLimitSize="5MB"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pColorFileLine="persian"
        :pDisabled="uploadDisabled"
      />
    `,
  }),
}

export const DraggerWithMaxFileSize: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      return { PUploadType }
    },
    template: `
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        :pUploadType="PUploadType.DRAGGER"
        pTextLimitSize="0,5 Mo"
        :pMaxFileSize="0.5"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="Tous formats"
        pColorFileLine="persian"
      />
    `,
  }),
}

export const Dragger: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const uploadDisabled = ref(false)
      return { uploadDisabled, PUploadType }
    },
    template: `
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        :pUploadType="PUploadType.DRAGGER"
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

export const DraggerWithAcceptedExtensions: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      return { PUploadType }
    },
    template: `
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        :pUploadType="PUploadType.DRAGGER"
        pTextLimitSize="1GB"
        pAccept=".jpeg, .jpg, .png, .pdf, .xls"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG, PDF ou XLS"
        pColorFileLine="persian"
      />
    `,
  }),
}

export const DraggerWithSingleFile: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const initialFiles: UploadFile[] = [
        buildUploadFile('carte-identite.pdf', 1, 256_000),
      ]
      return { initialFiles, PUploadType }
    },
    template: `
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        :pUploadType="PUploadType.DRAGGER"
        pTextLimitSize="1GB"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG, PDF ou XLS"
        pColorFileLine="persian"
        :pInitialFiles="initialFiles"
      />
    `,
  }),
}

export const DraggerWithMultipleFiles: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const initialFiles: UploadFile[] = [
        buildUploadFile('carte-identite.pdf', 1, 256_000),
        buildUploadFile('justificatif-domicile.png', 2, 512_000),
        buildUploadFile('rib.pdf', 3, 128_000),
      ]
      return { initialFiles, PUploadType }
    },
    template: `
      <PUpload
        pMultiple
        pDrag
        pShowFileList
        :pUploadType="PUploadType.DRAGGER"
        pTextLimitSize="1GB"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG, PDF ou XLS"
        pColorFileLine="persian"
        :pInitialFiles="initialFiles"
      />
    `,
  }),
}
