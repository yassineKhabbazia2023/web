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
import { logger } from '@pulse/core'
import { ref, toRef, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import DeleteFolderConfirmationPopup
  from '@ged/modules/Treeview/components/popups/Delete'
import { type DeleteFolderSectionProps }
  from '@ged/modules/Treeview/sections/DeleteFolder/DeleteFolderSectionTypes'

import { deleteFolder } from '@ged/services/Folder'
import { PNotification } from '@pulse/styleguide'

// Definitions
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits([
  'on-delete-folder-completed',
  'on-close-delete-folder',
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
watch(toRef(props, 'isDeleteFolderPopupVisible'), (newVal) => {
  isPopupVisible.value = newVal
})

const handleConfirmDeleteFolder = async () => {
  try {
    isDeleteInProgress.value = true
    await deleteFolder(
      props.serviceId,
      props.entityId,
      props.selectedFolder.id,
      false,
    )

    closeDeletePopup()
    emit('on-delete-folder-completed', props.selectedFolder)
    triggerSuccessNotification()
    isDeleteInProgress.value = false
  } catch (error) {
    logger.error(error)
    triggerErrorNotification()
    isDeleteInProgress.value = false
  }
}

// Notifications

const triggerErrorNotification = () => {
  PNotification({
    message: t('notifications.error'),
    iconName: 'exclamationTriangle',
    customClass: 'error',
    showClose: true,
    position: 'bottom-right',
  })
}

const triggerSuccessNotification = () => {
  PNotification({
    message: t('notifications.success', { folderName: props.selectedFolder.name }),
    iconName: 'check',
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
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
