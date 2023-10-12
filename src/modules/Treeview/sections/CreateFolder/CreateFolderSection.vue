<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <PButton
    type="white"
    class="treeview__new-folder el-button--default"
    size="small"
    :disabled="isTreeCreateFolderBtnDisabled"
    @click="openCreateFolderModal"
  >
    <PIcon class="el-button__icon--left">
      <PIFolderPlus />
    </PIcon>
    {{ t('newFolder') }}
  </PButton>

  <CreateFolderModal
    :isCreateFolderModalVisible="isDialogVisible"
    :modalTitle="t('modal.title')"
    :inputLabel="t('modal.inputLabel')"
    :inputPlaceHolder="t('modal.inputPlaceHolder')"
    :cancelBtnLabel="t('modal.controls.cancel')"
    :confirmBtnabel="t('modal.controls.confirm')"
    :isConfirmButtonLoading="isConfirmButtonLoading"
    :selectedFolder="selectedFolder"
    @on-confirm-create-folder="handleCreateFolder"
    @on-cancel-create-folder="handleCancelCreateFolder"
    @on-close-create-folder="handleCancelCreateFolder"
  />
</template>
<script setup lang="ts">
import { ref, inject, watch, toRef, computed } from 'vue'
import type { Folder } from '@/models/Folder'
import { CreateFolder } from '@/services/Folder'
import { useI18n } from 'vue-i18n'
import CreateFolderModal from '@/modules/Treeview/components/modals/Create'
import { PICheck, PIExclamationTriangle, PIFolderPlus, PButton, PIcon }
  from '@kpmg/styleguide'
import { canCreateFolder } from '@/modules/Treeview/helpers/folderPermissionsHelper'
import { type CreateFolderSectionProps }
  from '@/modules/Treeview/sections/CreateFolder/CreateFolderSectionTypes'
import { type ToastPluginFunc } from '@/modules/common/Types/toastPluginTypes'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const toastPlugin = inject('toast') as unknown as ToastPluginFunc

const props = defineProps<CreateFolderSectionProps>()
const emit = defineEmits([
  'update-source-folders',
  'on-close-create-folder'
])

const isConfirmButtonLoading = ref(false)
const isDialogVisible = ref(false)

const isTreeCreateFolderBtnDisabled = computed(
  () => !canCreateFolder(props.selectedFolder)
)
// Modal actions
const openCreateFolderModal = () => {
  isDialogVisible.value = true
}

const closeCreateFoldersModal = () => {
  isDialogVisible.value = false
}

const handleCreateFolder = async (folderName: string) => {
  isConfirmButtonLoading.value = true
  try {
    const createdFolder = (await CreateFolder(
      props.serviceId,
      props.entityId,
      props.selectedFolder.id,
      folderName
    )) as Folder
    isConfirmButtonLoading.value = false
    emit('update-source-folders', createdFolder)
    triggerSuccessNotification()
    closeCreateFoldersModal()
  } catch (err: any) {
    triggerErrorNotification()
    isConfirmButtonLoading.value = false
  }
}

const handleCancelCreateFolder = () => {
  closeCreateFoldersModal()
  emit('on-close-create-folder')
}

// eslint-disable-next-line vitest/require-hook
watch(toRef(props, 'isCreateFolderModalVisible'), (newVal) => {
  isDialogVisible.value = newVal
})

// Notifications
const triggerSuccessNotification = () => {
  toastPlugin({
    message: t('notifications.successMsg'),
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right'
  })
}

const triggerErrorNotification = () => {
  toastPlugin({
    message: t('notifications.errorMsg'),
    icon: PIExclamationTriangle,
    customClass: 'error',
    showClose: true,
    position: 'bottom-right'
  })
}
</script>

<i18n lang="yaml">
en-US:
  newFolder: 'Nouveau dossier'
  notifications:
    errorMsg: 'Connexion au serveur interrompue.'
    successMsg: 'Le dossier a été créé avec succès.'
  modal:
    title: 'Nouveau dossier'
    inputLabel: 'Nom du dossier'
    inputPlaceHolder: 'Entrez le nom de votre dossier'
    controls:
      confirm: 'Créer'
      cancel: 'Annuler'

fr-FR:
  newFolder: 'Nouveau dossier'
  notifications:
    errorMsg: 'Connexion au serveur interrompue.'
    successMsg: 'Le dossier a été créé avec succès.'
  modal:
    title: 'Nouveau dossier'
    inputLabel: 'Nom du dossier'
    inputPlaceHolder: 'Entrez le nom de votre dossier'
    controls:
      confirm: 'Créer'
      cancel: 'Annuler'
</i18n>
