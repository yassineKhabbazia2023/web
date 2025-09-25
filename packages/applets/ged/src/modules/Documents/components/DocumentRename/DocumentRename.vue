<template>
  <DocumentRenameModal
    :isRenameModalOpened="modelValue"
    :document="document"
    :isConfirmButtonLoading="isConfirmButtonLoading"
    @rename-confirmed="handleDocumentRename"
    @close-rename-modal="isRenameDocumentModalOpened = false"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { DocumentRenameProps } from './DocumentRenameTypes'
import DocumentRenameModal from './components/DocumentRenameModal.vue'
import { renameDocument } from '@ged/services/Documents'
import { PNotification } from '@pulse/styleguide'
import { useI18n } from 'vue-i18n'
import { trackDocumentRename } from '@ged/services/tracking/tracking.service'

const props = defineProps<DocumentRenameProps>()
const emit = defineEmits(['update:modelValue', 'document-rename'])

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isRenameDocumentModalOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

const isConfirmButtonLoading = ref(false)
const handleDocumentRename = async (documentName: string) => {
  isConfirmButtonLoading.value = true
  try {
    await renameDocument(
      props.currentService,
      props.selectedEntity,
      props.document.id,
      documentName,
      props.accountId,
    )
    isRenameDocumentModalOpened.value = false

    emit('document-rename')
    PNotification({
      message: t('toaster.success'),
      iconName: 'check',
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
    })
    trackDocumentRename({ isRenameSuccessful: true })
  } catch {
    PNotification({
      message: t('toaster.error'),
      iconName: 'exclamationTriangle',
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
    })
    trackDocumentRename({ isRenameSuccessful: false })
  } finally {
    isConfirmButtonLoading.value = false
  }
}
</script>

<i18n lang="yaml">
en-US:
  toaster:
    success: Document has been successfully renamed !
    error: Connection with server has  been lost

fr-FR:
  toaster:
    success: Le document a été renommé avec succès !
    error: Connexion au serveur interrompue
</i18n>
