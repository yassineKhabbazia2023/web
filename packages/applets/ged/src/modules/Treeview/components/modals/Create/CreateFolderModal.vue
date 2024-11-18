<template>
  <div class="create-folder__modal">
    <SingleInputModal
      v-model:isDialogVisible="isDialogVisible"
      v-model:defaultInputContentValue="inputContent"
      :modalTitle="modalTitle"
      :inputLabel="inputLabel"
      :inputPlaceHolder="inputPlaceHolder"
      :cancelBtnLabel="cancelBtnLabel"
      :confirmBtnabel="confirmBtnabel"
      :errorMsg="errorMsg"
      :isConfirmButtonDisabled="isConfirmButtonDisabled"
      :isValidInput="isValidInput"
      :showErrorMsg="showErrorMsg"
      :isConfirmButtonLoading="isConfirmButtonLoading"
      :isCentered="isCentered"
      @on-cancel-action-click="handleCancelActionClick"
      @on-close-modal="handleCloseModal"
      @on-confirm-action-click="handleConfirmActionClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SingleInputModal from '@ged/modules/common/templates/modals'
import {
  INPUT_MAX_LENGTH,
  validInputMaxLength,
  validInputAlphanumericFrench,
} from '@ged/modules/common/helpers/inputValidationHelper'
import { type CreateFolderModalProps }
  from '@ged/modules/Treeview/components/modals/Create/CreateFolderModalTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = withDefaults(defineProps<CreateFolderModalProps>(), {
  isCentered: false,
})

const emit = defineEmits([
  'on-close-create-folder',
  'on-confirm-create-folder',
  'on-cancel-create-folder',
  'update:isCreateFolderModalVisible',
])

const inputContent = ref('')

const isDialogVisible = computed({
  get() {
    return props.isCreateFolderModalVisible
  },
  set(value) {
    emit('update:isCreateFolderModalVisible', value)
  },
})

const errorMsg = computed(() => {
  if (!validInputAlphanumericFrench(inputContent.value)) {
    return t('validations.alphaNumerique')
  }
  if (!validInputMaxLength(inputContent.value)) {
    return t('validations.maxLength', { maxLength: INPUT_MAX_LENGTH })
  }
  if (folderNameExists.value) {
    return t('validations.folderNameExists', { folderName: inputContent.value })
  }
  return ''
})

// Modal actions
const handleCloseModal = () => {
  folderNameExists.value = false
  emit('on-close-create-folder')
}

const handleConfirmActionClick = () => {
  folderNameExists.value = false
  if (isFolderNameExists(inputContent.value)) {
    folderNameExists.value = true
    return
  }
  emit('on-confirm-create-folder', inputContent.value)
}

const handleCancelActionClick = () => {
  folderNameExists.value = false
  emit('on-cancel-create-folder')
}

// Modal validations
const hasUserAlreadyTyped = ref(false)
const isConfirmButtonDisabled = computed(
  () =>
    !validInputMaxLength(inputContent.value) ||
    inputContent.value.length === 0 ||
    !validInputAlphanumericFrench(inputContent.value),
)

const isValidInput = computed(() => {
  return (
    validInputAlphanumericFrench(inputContent.value) &&
    hasUserAlreadyTyped.value &&
    validInputMaxLength(inputContent.value)
  ) || (inputContent.value.length === 0 && !hasUserAlreadyTyped.value)
})

// This a is a hot fix
// Input should be in a form and not a stand alone, which makes it harder to use
watch(inputContent, () => {
  hasUserAlreadyTyped.value ||= true
})

watch(isDialogVisible, () => {
  isDialogVisible.value ||= hasUserAlreadyTyped.value = false
})

const folderNameExists = ref(false)

const isFolderNameExists = (folderName: string): boolean => {
  return props.selectedFolder?.children?.some(
    (folder) => folder.name.trim().toLowerCase() === folderName.trim().toLowerCase(),
  )
}

const showErrorMsg = computed(
  () =>
    (!isValidInput.value || folderNameExists.value) &&
    inputContent.value.length !== 0,
)

watch(inputContent, () => {
  folderNameExists.value = false
})
</script>
<i18n lang="yaml">
en-US:
  validations:
    alphaNumerique: >
      Entrez un nom qui ne contient aucun des caractères suivants :
      “ * : {'<'} {'>'} ? / \ {'|'}
    folderNameExists: 'A folder with the name {folderName} already exists'
    maxLength: 'The number of characters allowed ({maxLength}) is exceeded'

fr-FR:
  validations:
    alphaNumerique: >
      Entrez un nom qui ne contient aucun des caractères suivants :
      “ * : {'<'} {'>'} ? / \ {'|'}
    folderNameExists: 'Un dossier avec le nom {folderName} existe déjà'
    maxLength: 'Le nombre de caractères autorisés ({maxLength}) est dépassé'
</i18n>
