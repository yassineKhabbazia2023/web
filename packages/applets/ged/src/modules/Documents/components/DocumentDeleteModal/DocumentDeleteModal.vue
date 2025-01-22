<template>
  <div>
    <ConfirmationPopup
      v-model:isPopupVisible="isPopupVisible"
      :title="title"
      :message="message"
      :confirmButtonContent="t('popup.controls.confirm')"
      :cancelButtonContent="t('popup.controls.cancel')"
      :isConfirmButtonLoading="isDeleteInProgress"
      @on-confirm-button-click="handleConfirmDeleteFolder"
      @on-cancel-button-click="handleCancelDeleteFolder"
      @on-close-popup="handleCancelDeleteFolder"
    />
  </div>
</template>
<script setup lang="ts">
import { logger } from '@pulse/core'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { deleteDocuments } from '@ged/services/Documents'

import ConfirmationPopup from
  '@ged/modules/common/templates/popups'
import { type DocumentDeleteModalTypesProps }
  from '@ged/modules/Documents/components/DocumentDeleteModal/DocumentDeleteModalTypes'
import { PNotification } from '@pulse/styleguide'
import { trackDocumentDelete } from '@ged/services/tracking/tracking.service'
// DeleteFolderConfirmationPopup definitions
const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DocumentDeleteModalTypesProps>()

const emit = defineEmits([
  'update:isVisible',
  'confirm-delete-document',
  'cancel-delete-document',
])

const isDeleteInProgress = ref(false)

const isPopupVisible = computed({
  get() {
    return props.isVisible
  },
  set(value) {
    emit('update:isVisible', value)
  },
})

const message = computed(() => {
  if (isDeleteInProgress.value) {
    return t('popup.messageLoading', props.documentIds.length)
  } else if (props.documentIds.length > 1) {
    return t('popupMulti.message')
  } else {
    return t('popup.message')
  }
})

const title = computed(() => {
  if (isDeleteInProgress.value) {
    return t('popup.titleLoading')
  } else if (props.documentIds.length > 1) {
    return t('popupMulti.title')
  } else {
    return t('popup.title')
  }
})

const handleCancelDeleteFolder = () => {
  emit('cancel-delete-document')
}

const handleConfirmDeleteFolder = async () => {
  try {
    isDeleteInProgress.value = true
    await deleteDocuments(
      props.serviceId,
      props.entityId,
      props.documentIds,
    )

    emit('confirm-delete-document')
    triggerSuccessNotification()
    isDeleteInProgress.value = false
    trackDocumentDelete({ isDeleteSuccessful: true })
  } catch (error) {
    logger.error(error)
    triggerErrorNotification()
    isDeleteInProgress.value = false
    trackDocumentDelete({ isDeleteSuccessful: false })
  }
}

const triggerErrorNotification = () => {
  PNotification({
    message: t('popup.notifications.error'),
    iconName: 'exclamationTriangle',
    customClass: 'error',
    showClose: true,
    position: 'bottom-right',
  })
}

const triggerSuccessNotification = () => {
  const msg = props.documentIds.length > 1
    ? t('popupMulti.notifications.success', { documentsCount: props.documentIds.length })
    : t('popup.notifications.success')

  PNotification({
    message: msg,
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
    title: 'Supprimer ce document ?'
    titleLoading: 'Un instant...'
    message: 'Si vous cliquez sur "Confirmer", le document
     sera supprimé du dossier. Vous pourrez le restaurer depuis la corbeille.'
    messageLoading: >
      Le document est en cours de suppression vers la corbeille. |
      Les documents sont en cours de suppression vers la corbeille.
    controls:
      confirm: 'Confirmer'
      cancel: 'Annuler'
    notifications:
      error: 'Connexion au serveur interrompue.'
      success: '1 document supprimé.'
  popupMulti:
      title: 'Supprimer ces documents ?'
      message: 'Si vous cliquez sur "Confirmer", tous les documents seront
       supprimés du dossier. Vous pourrez les restaurer depuis la corbeille.'
      notifications:
        success: '"{documentsCount}" documents supprimés.'
fr-FR:
  popup:
    title: 'Supprimer ce document ?'
    titleLoading: 'Un instant...'
    message: 'Si vous cliquez sur "Confirmer", le document
     sera supprimé du dossier. Vous pourrez le restaurer depuis la corbeille.'
    messageLoading: >
      Le document est en cours de suppression vers la corbeille. |
      Les documents sont en cours de suppression vers la corbeille.
    controls:
      confirm: 'Confirmer'
      cancel: 'Annuler'
    notifications:
      error: 'Connexion au serveur interrompue.'
      success: '1 document supprimé.'
  popupMulti:
      title: 'Supprimer ces documents ?'
      message: 'Si vous cliquez sur "Confirmer", tous les documents seront
       supprimés du dossier. Vous pourrez les restaurer depuis la corbeille.'
      notifications:
        success: '"{documentsCount}" documents supprimés.'
</i18n>
