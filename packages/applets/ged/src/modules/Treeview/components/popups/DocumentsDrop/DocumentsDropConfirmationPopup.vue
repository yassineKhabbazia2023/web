<template>
  <div>
    <ConfirmationPopup
      v-model:isPopupVisible="isPopupVisible"
      :title="t('title',numberOfDocumentsToDrop)"
      :message="t('message',{destination:destinationPath},numberOfDocumentsToDrop)"
      :confirmButtonContent="t('controls.confirm')"
      :cancelButtonContent="t('controls.cancel')"
      :isConfirmButtonLoading="isDocumentDropConfirmButtonLoading"
      @on-confirm-button-click="handleConfirmDropAction"
      @on-cancel-button-click="handleCancelDropAction"
      @on-close-popup="handleClosePopup"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import ConfirmationPopup from '@ged/modules/common/templates/popups'
import { type DocumentsDropConfirmationPopupProps } from './DocumentsDropConfirmationPopupTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<DocumentsDropConfirmationPopupProps>()

const emit = defineEmits(['update:modelValue', 'confirm-documents-drop'])

const isPopupVisible = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const handleCancelDropAction = () => {
  isPopupVisible.value = false
}

const handleConfirmDropAction = () => {
  emit('confirm-documents-drop')
}

const handleClosePopup = () => {
  isPopupVisible.value = false
}
</script>

<i18n lang="yaml">
en-US:
  title: 'Move this document ? | Move these documents ?'
  message: >
    If you click on the "Submit" button, the document will me moved to {destination} |
    If you click on the "Submit" button", documents will be moved to {destination}
  controls:
    confirm: 'Submit'
    cancel: 'Cancel'
fr-FR:
  title: 'Déplacer ce document ? | Déplacer ces documents ?'
  message: >
    Si vous cliquez sur "Confirmer", le document sera déplacé dans le dossier {destination} |
    Si vous cliquez sur "Confirmer", les documents seront déplacés dans le dossier {destination}
  controls:
    confirm: 'Confirmer'
    cancel: 'Annuler'
</i18n>

