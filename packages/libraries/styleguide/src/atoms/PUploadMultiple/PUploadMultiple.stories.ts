import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PUploadMultiple from './PUploadMultiple.vue'
import PButton from '../PButton/PButton.vue'
import PIcon from '../PIcon/PIcon.vue'
import { setAxiosInstance } from '../../utils/axiosInstanceInit'
import type { PUploadedFile } from '../PUpload/PUploadTypes'

const meta: Meta<typeof PUploadMultiple> = {
  title: 'Atoms/PUploadMultiple',
  component: PUploadMultiple,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Zone de dépôt multi-fichiers. Le v-model porte la sélection en attente (File[]) ; les documents déjà persistés sont fournis via pUploadedFiles et affichés en tête de liste. La zone de dépôt disparaît quand pMaxFiles est atteint.',
      },
    },
  },
  decorators: [
    () => ({ template: '<div style="min-width: 600px;"><story /></div>' }),
  ],
}

export default meta
export type Story = StoryObj<typeof meta>

export const DropZone: Story = {
  render: () => ({
    components: { PUploadMultiple },
    setup() {
      const selectedFiles = ref<File[]>([])
      return { selectedFiles }
    },
    template: `
      <PUploadMultiple
        v-model="selectedFiles"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer les fichiers ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const WithUploadedFiles: Story = {
  render: () => ({
    components: { PUploadMultiple },
    setup() {
      const selectedFiles = ref<File[]>([])
      const uploadedFiles: PUploadedFile[] = [
        { id: '1', fileName: 'carte-identite.pdf' },
        { id: '2', fileName: 'justificatif-domicile.png' },
      ]
      return { selectedFiles, uploadedFiles }
    },
    template: `
      <PUploadMultiple
        v-model="selectedFiles"
        :pUploadedFiles="uploadedFiles"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer les fichiers ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const WithMaxFiles: Story = {
  render: () => ({
    components: { PUploadMultiple },
    setup() {
      const selectedFiles = ref<File[]>([])
      const uploadedFiles: PUploadedFile[] = [
        { id: '1', fileName: 'carte-identite.pdf' },
      ]
      return { selectedFiles, uploadedFiles }
    },
    template: `
      <div>
        <p style="margin-bottom: 8px;">
          Cap total de 3 fichiers (1 déjà persisté) : la zone disparaît une fois le cap atteint,
          et un dépôt excédentaire déclenche un toast d'erreur.
        </p>
        <PUploadMultiple
          v-model="selectedFiles"
          :pUploadedFiles="uploadedFiles"
          :pMaxFiles="3"
          pTextLimitSize="5 Mo"
          pPrefixLabelFileLine="Déposer les fichiers ou"
          pSuffixLabelFileLine="parcourir l'ordinateur"
          pAuthorizedFileFormat="JPEG, PNG ou PDF"
        />
      </div>
    `,
  }),
}

export const WithAcceptedExtensionsAndMaxFileSize: Story = {
  render: () => ({
    components: { PUploadMultiple },
    setup() {
      const selectedFiles = ref<File[]>([])
      return { selectedFiles }
    },
    template: `
      <PUploadMultiple
        v-model="selectedFiles"
        pAccept=".jpeg, .jpg, .png, .pdf"
        :pMaxFileSize="0.5"
        pTextLimitSize="0,5 Mo"
        pPrefixLabelFileLine="Déposer les fichiers ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const PickerWithButton: Story = {
  render: () => ({
    components: { PUploadMultiple, PButton, PIcon },
    setup() {
      const selectedFiles = ref<File[]>([])
      return { selectedFiles }
    },
    template: `
      <div style="display: flex; justify-content: center;">
        <PUploadMultiple v-model="selectedFiles">
          <PButton type="primary" size="small">
            <PIcon class="el-button__icon--left" pName="upload" />
            Déposer un document
          </PButton>
        </PUploadMultiple>
      </div>
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { PUploadMultiple },
    setup() {
      const selectedFiles = ref<File[]>([])
      return { selectedFiles }
    },
    template: `
      <PUploadMultiple
        v-model="selectedFiles"
        pDisabled
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer les fichiers ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const RemoteDelete: Story = {
  render: () => ({
    components: { PUploadMultiple },
    setup() {
      // Fake app-provided axios instance: resolves after a delay so the
      // deleting spinner is visible on the targeted line.
      setAxiosInstance({
        delete: () => new Promise((resolve) => {
          setTimeout(resolve, 1500)
        }),
      })
      const selectedFiles = ref<File[]>([])
      const uploadedFiles = ref<PUploadedFile[]>([
        { id: '1', fileName: 'carte-identite.pdf' },
        { id: '2', fileName: 'justificatif-domicile.png' },
      ])
      const onUploadedFileDeleted = (deletedFileId: string | number) => {
        uploadedFiles.value = uploadedFiles.value.filter((uploadedFile) => uploadedFile.id !== deletedFileId)
      }
      return { selectedFiles, uploadedFiles, onUploadedFileDeleted }
    },
    template: `
      <PUploadMultiple
        v-model="selectedFiles"
        :pUploadedFiles="uploadedFiles"
        pCanRemoteDelete
        pRemoteDeleteUrl="/documents"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer les fichiers ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
        @uploaded-file-deleted="onUploadedFileDeleted"
      />
    `,
  }),
}
