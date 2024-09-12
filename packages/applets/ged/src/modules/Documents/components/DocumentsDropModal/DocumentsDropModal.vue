<template>
  <ConfirmationPopup
    :isPopupVisible="isVisible"
    :title="t('oneMoment')"
    :message="t('uploadingDocuments', { folderName: targetFolderName }, numberOfUploadedFiles)"
    :confirmButtonContent="t('currentlyUploading')"
    cancelButtonContent=""
    isConfirmButtonLoading
    :showClose="false"
    alignCenter
  />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import ConfirmationPopup from '@/modules/common/templates/popups'
import type { DocumentsDropModalProps } from './DocumentsDropModalTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<DocumentsDropModalProps>()

</script>

<i18n lang="yaml">
en-US:
  oneMoment: 'One moment...'
  uploadingDocuments: >
    Document is being uploaded to the "{folderName}" folder |
    Documents are being uploaded to the "{folderName}" folder
  currentlyUploading: 'Uploading'
fr-FR:
  oneMoment: 'Un instant...'
  uploadingDocuments: >
    Le document est en cours de dépôt dans le dossier "{folderName}" |
    Les documents sont en cours de dépôt dans le dossier “{folderName}”.
  currentlyUploading: 'Dépôt en cours'
</i18n>
