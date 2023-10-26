<template>
  <SingleInputModal
    v-model:isDialogVisible="isRenameModalVisible"
    v-model:defaultInputContentValue="inputContent"
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

<i18n lang="yaml">
en-US:
  validations:
    alphaNumerique: >
      Enter a name that does not contain any of the following characters:
      “ * : &lt; &gt; ? / \ |.
  title: Renommer
  inputLabel: Rename document
  inputPlaceHolder: Enter a new document name
  cancelButtonLabel: Cancel
  updateButtonLabel: Update

fr-FR:
  validations:
    alphaNumerique: >
      Entrez un nom qui ne contient aucun des caractères suivants :
      “ * : &lt; &gt; ? / \ |.
  title: Renommer
  inputLabel: Renommez votre document
  inputPlaceHolder: Entrez un nouveau nom
  cancelButtonLabel: Annuler
  updateButtonLabel: Modifier
</i18n>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { DocumentRenameModalProps } from './DocumentRenameModalTypes'
import SingleInputModal from '@/modules/common/templates/modals'
import { validInputMaxLength, validInputAlphanumericFrenchWithSpecialCharacters }
  from '@/modules/common/helpers/inputValidationHelper'
import {
  getDocumentNameExtension,
  getDocumentNameWithoutExtension
} from '@/modules/Documents/helpers/filesExtensions'

const props = defineProps<DocumentRenameModalProps>()
const emit = defineEmits([
  'update:modelValue',
  'close-rename-modal',
  'rename-confirmed'
])

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const documentBaseName = getDocumentNameWithoutExtension(props.document.name)
const inputContent = ref(documentBaseName)
const fileExtension = computed(() => `.${getDocumentNameExtension(props.document.name)}`)
const fullDocumentName = computed(() => `${inputContent.value}${fileExtension.value}`)

const isRenameModalVisible = computed({
  get() {
    return props.isRenameModalOpened
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

watch(() => props.isRenameModalOpened, () => {
  inputContent.value = documentBaseName
})

const isValidInput = computed(() =>
  validInputAlphanumericFrenchWithSpecialCharacters(inputContent.value)
)

const errorMessage = computed(() => {
  if (!validInputAlphanumericFrenchWithSpecialCharacters(inputContent.value)) {
    return t('validations.alphaNumerique')
  }

  return ''
})

const showErrorMsg = computed(
  () =>
    !isValidInput.value &&
    inputContent.value.length !== 0
)

const isConfirmButtonDisabled = computed(
  () =>
    inputContent.value.length === 0 ||
    !validInputMaxLength(inputContent.value) ||
    !validInputAlphanumericFrenchWithSpecialCharacters(inputContent.value)
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
