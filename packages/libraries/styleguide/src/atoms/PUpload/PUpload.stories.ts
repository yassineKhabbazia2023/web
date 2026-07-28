import type { Meta, StoryObj } from '@storybook/vue3-vite'
import { ref } from 'vue'
import PUpload from './PUpload.vue'
import { setAxiosInstance } from '../../utils/axiosInstanceInit'
import type { PUploadedFile } from './PUploadTypes'

const meta: Meta<typeof PUpload> = {
  title: 'Atoms/PUpload',
  component: PUpload,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Zone de dépôt mono-fichier. Le v-model porte le fichier en attente (File | null) ; un document déjà persisté est fourni via pUploadedFile et remplace la zone de dépôt.',
      },
    },
  },
  decorators: [
    () => ({ template: '<div style="min-width: 600px;"><story /></div>' }),
  ],
}

export default meta
export type Story = StoryObj<typeof meta>

export const EmptyDropZone: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const selectedFile = ref<File | null>(null)
      return { selectedFile }
    },
    template: `
      <PUpload
        v-model="selectedFile"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const WithLabel: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const selectedFile = ref<File | null>(null)
      return { selectedFile }
    },
    template: `
      <PUpload
        v-model="selectedFile"
        pLabel="Pièce d'identité"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const WithAcceptedExtensions: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const selectedFile = ref<File | null>(null)
      return { selectedFile }
    },
    template: `
      <PUpload
        v-model="selectedFile"
        pAccept=".jpg"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPG"
      />
    `,
  }),
}

export const WithMaxFileSize: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const selectedFile = ref<File | null>(null)
      return { selectedFile }
    },
    template: `
      <PUpload
        v-model="selectedFile"
        :pMaxFileSize="0.5"
        pTextLimitSize="0,5 Mo"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="Tous formats"
      />
    `,
  }),
}

export const PendingFileSelected: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const selectedFile = ref<File | null>(new File(['content'], 'carte-identite.pdf', { type: 'application/pdf' }))
      return { selectedFile }
    },
    template: `
      <PUpload
        v-model="selectedFile"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const UploadedFile: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const selectedFile = ref<File | null>(null)
      const uploadedFile: PUploadedFile = { id: '1', fileName: 'carte-identite.pdf' }
      return { selectedFile, uploadedFile }
    },
    template: `
      <PUpload
        v-model="selectedFile"
        :pUploadedFile="uploadedFile"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const UploadedFileNotDeletable: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const selectedFile = ref<File | null>(null)
      const uploadedFile: PUploadedFile = { id: '1', fileName: 'carte-identite.pdf' }
      return { selectedFile, uploadedFile }
    },
    template: `
      <PUpload
        v-model="selectedFile"
        :pUploadedFile="uploadedFile"
        :pCanDeleteUploadedFile="false"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const Disabled: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      const selectedFile = ref<File | null>(null)
      return { selectedFile }
    },
    template: `
      <PUpload
        v-model="selectedFile"
        pDisabled
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
      />
    `,
  }),
}

export const RemoteDelete: Story = {
  render: () => ({
    components: { PUpload },
    setup() {
      // Fake app-provided axios instance: resolves after a delay so the
      // deleting spinner is visible on the persisted line.
      setAxiosInstance({
        delete: () => new Promise((resolve) => {
          setTimeout(resolve, 1500)
        }),
      })
      const selectedFile = ref<File | null>(null)
      const uploadedFile = ref<PUploadedFile | undefined>({ id: '1', fileName: 'carte-identite.pdf' })
      const onUploadedFileDeleted = () => {
        uploadedFile.value = undefined
      }
      return { selectedFile, uploadedFile, onUploadedFileDeleted }
    },
    template: `
      <PUpload
        v-model="selectedFile"
        :pUploadedFile="uploadedFile"
        pCanRemoteDelete
        pRemoteDeleteUrl="/documents"
        pTextLimitSize="5 Mo"
        pPrefixLabelFileLine="Déposer le fichier ou"
        pSuffixLabelFileLine="parcourir l'ordinateur"
        pAuthorizedFileFormat="JPEG, PNG ou PDF"
        @uploaded-file-deleted="onUploadedFileDeleted"
      />
    `,
  }),
}
