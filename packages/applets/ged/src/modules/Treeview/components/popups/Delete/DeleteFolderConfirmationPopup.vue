<template>
  <div class="delete-folder-popup">
    <ConfirmationPopup
      v-model:isPopupVisible="isPopupVisible"
      :title="title"
      :message="message"
      :confirmButtonContent="confirmButtonContent"
      :cancelButtonContent="cancelButtonContent"
      :isConfirmButtonLoading="isConfirmButtonLoading"
      @on-confirm-button-click="handleConfirmDeleteFolder"
      @on-cancel-button-click="handleCancelDeleteFolder"
      @on-close-popup="handleCancelDeleteFolder"
    />
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import ConfirmationPopup from
  '@ged/modules/common/templates/popups'
import { type DeleteFolderConfirmationPopupProps }
  from '@ged/modules/Treeview/components/popups/Delete/DeleteFolderConfirmationPopupTypes'

// DeleteFolderConfirmationPopup definitions
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DeleteFolderConfirmationPopupProps>()

const emit = defineEmits([
  'update:isDeleteFolderPopupVisible',
  'confirm-delete-folder',
  'cancel-delete-folder',
])

const isPopupVisible = computed({
  get() {
    return props.isDeleteFolderPopupVisible
  },
  set(value) {
    emit('update:isDeleteFolderPopupVisible', value)
  },
})

const message = computed(() => t('message', { folderName: props.folderName }))

// DeleteFolderConfirmationPopup actions

const handleConfirmDeleteFolder = () => {
  emit('confirm-delete-folder')
}

const handleCancelDeleteFolder = () => {
  emit('cancel-delete-folder')
}
</script>
<i18n lang="yaml">
en-US:
  message: >
    Si vous cliquez sur "Confirmer",
    tous les fichiers et sous dossiers à partir du dossier "{folderName}"
    seront supprimés et envoyés à la corbeille.

fr-FR:
  message: >
    Si vous cliquez sur "Confirmer",
    tous les fichiers et sous dossiers à partir du dossier "{folderName}"
    seront supprimés et envoyés à la corbeille.
</i18n>

