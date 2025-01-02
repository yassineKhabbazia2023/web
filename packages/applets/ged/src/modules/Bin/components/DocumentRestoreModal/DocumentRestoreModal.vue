<template>
  <div>
    <ConfirmationPopup
      v-model:isPopupVisible="isPopupVisible"
      :title="title"
      :message="message"
      :confirmButtonContent="t('restore.controls.confirm')"
      :cancelButtonContent="t('restore.controls.cancel')"
      :isConfirmButtonLoading="isRestoreInProgress"
      @on-confirm-button-click="handleConfirm"
      @on-cancel-button-click="handleCancel"
      @on-close-popup="handleCancel"
    />
  </div>
</template>
<script setup lang="ts">
import { computed, ref, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { restoreDocuments } from '@ged/services/BinDocuments'
import ConfirmationPopup from
  '@ged/modules/common/templates/popups'
import { type DocumentRestoreModalTypesProps }
  from '@ged/modules/Bin/components/DocumentRestoreModal/DocumentRestoreModalTypes'
import { PNotification } from '@pulse/styleguide'
import { PICheck, PIExclamationTriangle } from '@pulse/styleguide/components'

// DeleteFolderConfirmationPopup definitions
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DocumentRestoreModalTypesProps>()

const emit = defineEmits<{
  'update:isVisible': [boolean]
  'confirm-restore-document': []
  'cancel-restore-document': []
  'navigate-to-folder': [number]
}>()

const isRestoreInProgress = ref(false)

const isPopupVisible = computed({
  get() {
    return props.isVisible
  },
  set(value) {
    emit('update:isVisible', value)
  },
})

const message = computed(() => {
  if (isRestoreInProgress.value) {
    return t('restore.messageLoading')
  } else {
    return t('restore.message')
  }
})

const title = computed(() => {
  if (isRestoreInProgress.value) {
    return t('restore.titleLoading')
  } else {
    return t('restore.title')
  }
})

const handleCancel = () => {
  emit('cancel-restore-document')
}

const handleConfirm = async () => {
  if (!props.document) {
    return
  }

  try {
    isRestoreInProgress.value = true
    const docs = await restoreDocuments(
      props.serviceId,
      props.entityId,
      [props.document.id],
    )

    emit('confirm-restore-document')
    triggerSuccessNotification(
      docs[0].folderId,
      props.document.path[props.document.path.length - 1])
    isRestoreInProgress.value = false
  } catch (err: any) {
    triggerErrorNotification()
    isRestoreInProgress.value = false
  }
}

const goToFolder = (folderId: number) => {
  emit('navigate-to-folder', folderId)
}

const triggerErrorNotification = () => {
  PNotification({
    message: t('restore.notifications.error'),
    icon: PIExclamationTriangle,
    customClass: 'error',
    showClose: true,
    position: 'bottom-right',
  })
}

const triggerSuccessNotification = (folderId: number, path: string) => {
  const msg = t('restore.notifications.success',
    {
      folder: path,
    })

  PNotification({
    message: msg,
    icon: PICheck,
    showClose: true,
    customClass: 'success',
    position: 'bottom-right',
    onClick: () => goToFolder(folderId),
  })
}
</script>
<i18n lang="yaml">
  en-US:
    restore:
      title: 'Restaurer ce document ?'
      titleLoading: 'Un instant...'
      message: 'Si vous cliquez sur "Confirmer", le document
       sera restauré dans son dossier d''origine.'
      messageLoading: 'Le document est en train d''être restauré dans son dossier d''origine.'
      controls:
        confirm: 'Confirmer'
        cancel: 'Annuler'
      notifications:
        error: 'Connexion au serveur interrompue.'
        success: '1 document restauré dans le dossier {folder} - Voir le document'
  fr-FR:
    restore:
      title: 'Restaurer ce document ?'
      titleLoading: 'Un instant...'
      message: 'Si vous cliquez sur "Confirmer", le document
       sera restauré dans son dossier d''origine.'
      messageLoading: 'Le document est en train d''être restauré dans son dossier d''origine.'
      controls:
        confirm: 'Confirmer'
        cancel: 'Annuler'
      notifications:
        error: 'Connexion au serveur interrompue.'
        success: '1 document restauré dans le dossier {folder} - Voir le document'
</i18n>
