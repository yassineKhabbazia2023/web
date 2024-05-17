<template>
  <ConfirmationPopup
    v-model:isPopupVisible="isPopupVisible"
    :title="t('title',numberOfDocumentsToDrop)"
    :message="t('message',{destination:destinationPath},numberOfDocumentsToDrop)"
    :confirmButtonContent="t('controls.confirm')"
    :cancelButtonContent="t('controls.cancel')"
    :isConfirmButtonLoading="false"
    @on-confirm-button-click="handleConfirmDropAction"
    @on-cancel-button-click="handleCancelDropAction"
    @on-close-popup="handleClosePopup"
  />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfirmationPopup from '@/modules/common/templates/popups'
import { type DocumentsDropConfirmationPopupProps } from './DocumentsDropConfirmationPopupTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DocumentsDropConfirmationPopupProps>()

const emit = defineEmits(['update:isVisible', 'cancel-documents-drop', 'confirm-documents-drop', 'close-popup'])

const isPopupVisible = computed({
  get() {
    return props.isVisible
  },
  set(value) {
    emit('update:isVisible', value)
  },
})

const handleCancelDropAction = () => {
  emit('cancel-documents-drop')
}

const handleConfirmDropAction = () => {
  emit('confirm-documents-drop')
}

const handleClosePopup = () => {
  emit('close-popup')
}
</script>

<i18n lang="yaml">
en-US:
  title: 'Déplacer ce document ? | Déplacer ces documents ?'
  message: >
    Si vous cliquez sur "Confirmer", le document sera déplacé dans le dossier {destination} |
    Si vous cliquez sur "Confirmer", les documents seront déplacés dans le dossier {destination}
  controls:
    confirm: 'Confirmer'
    cancel: 'Annuler'
fr-FR:
  title: 'Déplacer ce document ? | Déplacer ces documents ?'
  message: >
    Si vous cliquez sur "Confirmer", le document sera déplacé dans le dossier {destination} |
    Si vous cliquez sur "Confirmer", les documents seront déplacés dans le dossier {destination}
  controls:
    confirm: 'Confirmer'
    cancel: 'Annuler'
</i18n>

