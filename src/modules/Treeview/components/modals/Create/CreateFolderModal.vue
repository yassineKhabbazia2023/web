<template>
  <div class="create-folder__modal">
    <SingleInputModal
      v-model:isDialogVisible="isDialogVisible"
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
      @on-cancel-action-click="handleCancelActionClick"
      @on-close-modal="handleCloseModal"
      @on-confirm-action-click="handleConfirmActionClick"
      @input-content-changed="handleInputContentChnge"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SingleInputModal from '@/modules/common/templates/modals'
import {
  validInputMaxLength,
  validInputAlphanumericFrench
} from '@/modules/common/helpers/inputValidationHelper'
import { type CreateFolderModalProps }
  from '@/modules/Treeview/components/modals/Create/CreateFolderModalTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const props = defineProps<CreateFolderModalProps>()

const emit = defineEmits([
  'on-close-create-folder',
  'on-confirm-create-folder',
  'on-cancel-create-folder',
  'update:isCreateFolderModalVisible'
])

const inputContent = ref('')

const isDialogVisible = computed({
  get() {
    return props.isCreateFolderModalVisible
  },
  set(value) {
    emit('update:isCreateFolderModalVisible', value)
  }
})

const errorMsg = computed(() => {
  if (!validInputAlphanumericFrench(inputContent.value)) {
    return t('validations.alphaNumerique')
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

const handleInputContentChnge = (newValue: string) => {
  inputContent.value = newValue
}

// Modal validations

const isConfirmButtonDisabled = computed(
  () =>
    !validInputMaxLength(inputContent.value) ||
    inputContent.value.length === 0 ||
    !validInputAlphanumericFrench(inputContent.value)
)

const isValidInput = computed(() => {
  // eslint-disable-next-line no-debugger
  debugger
  return validInputAlphanumericFrench(inputContent.value)
})
const folderNameExists = ref(false)

const isFolderNameExists = (folderName: string): boolean => {
  return props.selectedFolder?.children?.some(
    (folder) => folder.name === folderName
  )
}

const showErrorMsg = computed(
  () =>
    (!isValidInput.value || folderNameExists.value) &&
    inputContent.value.length !== 0
)

// eslint-disable-next-line vitest/require-hook
watch(inputContent, () => {
  folderNameExists.value = false
})
</script>
<i18n lang="yaml">
en-US:
  validations:
    alphaNumerique: >
      Entrez un nom qui ne contient aucun des caractères suivants :
      “ * : &lt; &gt; ? / \ |.
    folderNameExists: 'Un dossier avec le nom {folderName} existe déjà'

fr-FR:
  validations:
    alphaNumerique: >
      Entrez un nom qui ne contient aucun des caractères suivants :
      “ * : &lt; &gt; ? / \ |.
    folderNameExists: 'Un dossier avec le nom {folderName} existe déjà'
</i18n>
