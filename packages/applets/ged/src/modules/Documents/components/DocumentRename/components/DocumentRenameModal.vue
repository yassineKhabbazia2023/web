<template>
  <SingleInputModal
    v-model:defaultInputContentValue="inputContent"
    :isDialogVisible="isRenameModalOpened"
    :modalTitle="t('title')"
    :inputLabel="t('inputLabel')"
    :inputPlaceHolder="t('inputPlaceHolder')"
    :inputSuffix="fileExtension"
    :cancelBtnLabel="t('cancelButtonLabel')"
    :confirmBtnabel="t('updateButtonLabel')"
    :errorMsg="errorMessage"
    :isConfirmButtonDisabled="isConfirmButtonDisabled"
    :isValidInput="isValidInput"
    :showErrorMsg="showErrorMsg"
    :isConfirmButtonLoading="isConfirmButtonLoading"
    @on-cancel-action-click="handleCancelAction"
    @on-close-modal="handleCloseModal"
    @on-confirm-action-click="handleConfirmAction"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DocumentRenameModalProps } from './DocumentRenameModalTypes'
import SingleInputModal from '@ged/modules/common/templates/modals'
import {
  INPUT_MAX_LENGTH,
  validInputMaxLength,
  validInputAlphanumericFrench,
} from '@ged/modules/common/helpers/inputValidationHelper'
import { getDocumentNameWithoutExtension, getFileExtension } from '@pulse/core'

const props = defineProps<DocumentRenameModalProps>()
const emit = defineEmits([
  'update:modelValue',
  'close-rename-modal',
  'rename-confirmed',
])

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const documentBaseName = ref(getDocumentNameWithoutExtension(props.document.name))
const inputContent = ref(documentBaseName)
const fileExtension = computed(() => `.${getFileExtension(props.document.name)}`)
const fullDocumentName = computed(() => `${inputContent.value}${fileExtension.value}`)

watch(() => props.isRenameModalOpened, () => {
  documentBaseName.value = getDocumentNameWithoutExtension(props.document.name)
  inputContent.value = documentBaseName.value
})

const isValidInput = computed(() =>
  validInputAlphanumericFrench(inputContent.value) && validInputMaxLength(inputContent.value),
)

const errorMessage = computed(() => {
  if (!validInputAlphanumericFrench(inputContent.value)) {
    return t('validations.alphaNumerique')
  }
  if (!validInputMaxLength(inputContent.value)) {
    return t('validations.maxLength', { maxLength: INPUT_MAX_LENGTH })
  }
  return ''
})

const showErrorMsg = computed(
  () =>
    !isValidInput.value &&
    inputContent.value.length !== 0,
)

const isConfirmButtonDisabled = computed(
  () =>
    inputContent.value.length === 0 ||
    !validInputMaxLength(inputContent.value) ||
    !validInputAlphanumericFrench(inputContent.value),
)

const handleCancelAction = () => {
  emit('close-rename-modal')
}
const handleCloseModal = () => {
  emit('close-rename-modal')
}
const handleConfirmAction = () => {
  emit('rename-confirmed', fullDocumentName.value)
}
</script>

<i18n lang="yaml">
en-US:
  validations:
    alphaNumerique: >
      Enter a name that does not contain any of the following characters:
      “ * : {'<'} {'>'} ? / \ {'|'}
    maxLength: 'The number of characters allowed ({maxLength}) is exceeded'
  title: Rename
  inputLabel: Rename document
  inputPlaceHolder: Enter a new document name
  cancelButtonLabel: Cancel
  updateButtonLabel: Update

fr-FR:
  validations:
    alphaNumerique: >
      Entrez un nom qui ne contient aucun des caractères suivants :
      “ * : {'<'} {'>'} ? / \ {'|'}
    maxLength: 'Le nombre de caractères autorisés ({maxLength}) est dépassé'
  title: Renommer
  inputLabel: Renommez votre document
  inputPlaceHolder: Entrez un nouveau nom
  cancelButtonLabel: Annuler
  updateButtonLabel: Modifier
</i18n>
