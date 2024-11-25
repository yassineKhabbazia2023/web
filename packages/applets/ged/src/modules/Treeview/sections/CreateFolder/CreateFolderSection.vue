<!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
<template>
  <PButton
    v-if="hasCreateFolderButton"
    data-testid="treeview__new-folder"
    class="treeview__new-folder el-button--default"
    pType="white"
    pSize="small"
    :pDisabled="isTreeCreateFolderBtnDisabled || isInBinContext"
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
    :isCentered="isCreateFolderModalCentered"
    @on-confirm-create-folder="handleCreateFolder"
    @on-cancel-create-folder="handleCancelCreateFolder"
    @on-close-create-folder="handleCancelCreateFolder"
  />
</template>
<script setup lang="ts">
import { ref, inject, watch, toRef, computed } from 'vue'
import type { Folder } from '@ged/models/Folder'
import { CreateFolder } from '@ged/services/Folder'
import { useI18n } from 'vue-i18n'
import CreateFolderModal from '@ged/modules/Treeview/components/modals/Create'
import { PICheck, PIExclamationTriangle, PIFolderPlus, PButton, PIcon }
  from '@pulse/styleguide'
import { canCreateFolder } from '@ged/modules/Treeview/helpers/folderPermissionsHelper'
import { type CreateFolderSectionProps }
  from '@ged/modules/Treeview/sections/CreateFolder/CreateFolderSectionTypes'
import { type ToastPluginFunc } from '@ged/modules/common/Types/toastPluginTypes'
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// Forcing the cast as we know it exsits from Styleguide
// This should be updated to a PNotification import
const toastPlugin = inject('toast') as ToastPluginFunc

const props = withDefaults(defineProps<CreateFolderSectionProps>(), {
  isCreateFolderModaleCenterd: false,
  isCreateFolderModalCentered: false,
})

const emit = defineEmits([
  'update-source-folders',
  'on-close-create-folder',
])

const isConfirmButtonLoading = ref(false)
const isDialogVisible = ref(false)

const isTreeCreateFolderBtnDisabled = computed(
  () => !canCreateFolder(props.selectedFolder),
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
    const createdFolder: Folder = (await CreateFolder(
      props.serviceId,
      props.entityId,
      props.selectedFolder.id,
      folderName,
    ))
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
