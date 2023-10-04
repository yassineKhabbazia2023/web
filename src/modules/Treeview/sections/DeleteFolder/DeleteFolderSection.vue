<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <DeleteFolderConfirmationPopup
    :isDeleteFolderPopupVisible="isPopupVisible"
    :title="t('popup.title')"
    :folderName="selectedFolder.name"
    :confirmButtonContent="t('popup.controls.confirm')"
    :cancelButtonContent="t('popup.controls.cancel')"
    :isConfirmButtonLoading="isDeleteInProgress"
    @confirm-delete-folder="handleConfirmDeleteFolder"
    @cancel-delete-folder="handleCancelDeleteFolder"
  />
</template>
<script setup lang="ts">
import { ref, inject, toRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DeleteFolderConfirmationPopup
  from '@/modules/Treeview/components/popups/Delete'
import { type DeleteFolderSectionProps }
  from '@/modules/Treeview/sections/DeleteFolder/DeleteFolderSectionTypes'

import { DeleteFolder } from '@/services/Folder'
import { PICheck, PIExclamationTriangle } from '@kpmg/styleguide'
import { type ToastPluginFunc } from '@/modules/common/Types/toastPluginTypes'

// Definitions
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const toastPlugin = inject('toast') as unknown as ToastPluginFunc

const emit = defineEmits([
  'on-delete-folder-completed',
  'on-close-delete-folder'
])

const props = defineProps<DeleteFolderSectionProps>()

const isPopupVisible = ref(props.isDeleteFolderPopupVisible)

const isDeleteInProgress = ref(false)

// Actions
const closeDeletePopup = () => {
  isPopupVisible.value = false
}
const handleCancelDeleteFolder = () => {
  closeDeletePopup()
  emit('on-close-delete-folder')
}
// eslint-disable-next-line vitest/require-hook
watch(toRef(props, 'isDeleteFolderPopupVisible'), (newVal) => {
  isPopupVisible.value = newVal
})

const handleConfirmDeleteFolder = async () => {
  try {
    isDeleteInProgress.value = true
    await DeleteFolder(
      props.serviceId,
      props.entityId,
      props.selectedFolder.id,
      false
    )

    closeDeletePopup()
    emit('on-delete-folder-completed', props.selectedFolder)
    triggerSuccessNotification()
    isDeleteInProgress.value = false
  } catch (err: any) {
    triggerErrorNotification()
    isDeleteInProgress.value = false
  }
}

// Notifications

const triggerErrorNotification = () => {
  toastPlugin({
    message: t('notifications.error'),
    icon: PIExclamationTriangle,
    customClass: 'error',
    showClose: true,
    position: 'bottom-right'
  })
}

const triggerSuccessNotification = () => {
  toastPlugin({
    message: t('notifications.success', { folderName: props.selectedFolder.name }),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right'
  })
}
</script>
<i18n lang="yaml">
en-US:
  popup:
    title: 'Supprimer ce dossier ?'
    controls:
      confirm: 'Confirmer'
      cancel: 'Annuler'
  notifications:
    error: 'Connexion au serveur interrompue.'
    success: 'Dossier "{folderName}" supprimé.'

fr-FR:
  popup:
    title: 'Supprimer ce dossier ?'
    controls:
      confirm: 'Confirmer'
      cancel: 'Annuler'
  notifications:
    error: 'Connexion au serveur interrompue.'
    success: 'Dossier "{folderName}" supprimé.'
</i18n>
