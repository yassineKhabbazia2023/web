<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <RenameFolderModal
    :isRenameFolderModalVisible="isDialogRenameVisible"
    :modalTitle="t('modal.title')"
    :inputLabel="t('modal.inputLabel')"
    :inputPlaceHolder="t('modal.inputPlaceHolder')"
    :cancelBtnLabel="t('modal.controls.cancel')"
    :confirmBtnabel="t('modal.controls.confirm')"
    :isConfirmButtonLoading="isConfirmButtonLoading"
    :inputContentDefault="folderName"
    :parentFolder="parentFolder"
    @on-confirm-rename-folder="handleRenameFolder"
    @on-close-rename-folder="handleCancelRenameFolder"
    @on-cancel-rename-folder="handleCancelRenameFolder"
  />
</template>
<script setup lang="ts">
import { inject, ref, toRef, watch } from 'vue'
import { PICheck, PIExclamationTriangle } from '@kpmg/styleguide'
import { RenameFolder } from '@/services/Folder'
import type { Folder } from '@/models/Folder'
import RenameFolderModal from '@/modules/Treeview/components/modals/Rename'
import { type RenameFolderSectionProps }
  from '@/modules/Treeview/sections/RenameFolder/RenameFolderSectionTypes'
import { useI18n } from 'vue-i18n'
import { type ToastPluginFunc } from '@/modules/common/Types/toastPluginTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const toastPlugin = inject('toast') as unknown as ToastPluginFunc

const isConfirmButtonLoading = ref(false)
const isDialogRenameVisible = ref(false)
const props = defineProps<RenameFolderSectionProps>()

const emit = defineEmits([
  'update-folder-name',
  'on-close-rename-folder'])

const handleRenameFolder = async (newfolderName: string) => {
  isConfirmButtonLoading.value = true
  try {
    const updatedFolder = (await RenameFolder(
      props.folderId,
      newfolderName,
      props.entityId,
      props.serviceId,
    )) as Folder
    isConfirmButtonLoading.value = false
    emit('update-folder-name', updatedFolder)
    triggerSuccessNotification()
    closeRenameFolderModal()
  } catch (err: any) {
    triggerErrorNotification()
    isConfirmButtonLoading.value = false
  }
}

const handleCancelRenameFolder = () => {
  isDialogRenameVisible.value = false
  emit('on-close-rename-folder')
}
// eslint-disable-next-line vitest/require-hook
watch(toRef(props, 'isRenameFolderModalVisible'), (newVal) => {
  isDialogRenameVisible.value = newVal
})
// Notifications
const triggerSuccessNotification = () => {
  toastPlugin({
    message: t('notifications.successMsg'),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
  })
}

const triggerErrorNotification = () => {
  toastPlugin({
    message: t('notifications.errorMsg'),
    icon: PIExclamationTriangle,
    customClass: 'error',
    showClose: true,
    position: 'bottom-right',
  })
}
const closeRenameFolderModal = () => {
  isDialogRenameVisible.value = false
}
</script>
<i18n lang="yaml">
en-US:
  modal:
    title: 'Renommer'
    inputLabel: 'Renommer votre dossier'
    inputPlaceHolder: 'Entrez le nom de votre dossier'
    controls:
      confirm: 'Modifier'
      cancel: 'Annuler'
  notifications:
    errorMsg: 'Connexion au serveur interrompue.'
    successMsg: 'Le dossier a été renommé avec succès.'
fr-FR:
  modal:
    title: 'Renommer'
    inputLabel: 'Renommer votre dossier'
    inputPlaceHolder: 'Entrez le nom de votre dossier'
    controls:
      confirm: 'Modifier'
      cancel: 'Annuler'
  notifications:
    errorMsg: 'Connexion au serveur interrompue.'
    successMsg: 'Le dossier a été renommé avec succès.'
</i18n>

