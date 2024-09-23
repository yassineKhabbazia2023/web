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
import { computed, ref, inject } from 'vue'
import type { DocumentRenameProps } from './DocumentRenameTypes.ts'
import DocumentRenameModal from './components/DocumentRenameModal.vue'
import { renameDocument } from '@ged/services/Documents'
import { type ToastPluginFunc } from '@ged/modules/common/Types/toastPluginTypes'
import { useI18n } from 'vue-i18n'
import { PICheck, PIExclamationTriangle } from '@kpmg/styleguide'

const props = defineProps<DocumentRenameProps>()
const emit = defineEmits(['update:modelValue', 'document-rename'])

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// Forcing the cast as we know it exsits from Styleguide
// This should be updated to a PNotification import
const toastPlugin = inject('toast') as ToastPluginFunc

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
    )
    isRenameDocumentModalOpened.value = false

    emit('document-rename')
    toastPlugin({
      message: t('toaster.success'),
      icon: PICheck,
      showClose: true,
      customClass: 'success',
      position: 'bottom-right',
    })
  } catch {
    toastPlugin({
      message: t('toaster.error'),
      icon: PIExclamationTriangle,
      showClose: true,
      customClass: 'error',
      position: 'bottom-right',
    })
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

