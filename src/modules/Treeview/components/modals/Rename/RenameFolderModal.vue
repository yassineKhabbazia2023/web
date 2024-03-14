<template>
  <div class="rename-folder__modal">
    <SingleInputModal
      v-model:isDialogVisible="isDialogRenameVisible"
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
      @on-cancel-action-click="handleCancelActionClick"
      @on-close-modal="handleCloseModal"
      @on-confirm-action-click="handleConfirmActionClick"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import SingleInputModal from '@/modules/common/templates/modals'
import { validInputMaxLength, validInputAlphanumericFrench }
  from '@/modules/common/helpers/inputValidationHelper'
import { type RenameFolderModalProps }
  from '@/modules/Treeview/components/modals/Rename/RenameFolderModalTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<RenameFolderModalProps>()

const emit = defineEmits([
  'on-close-rename-folder',
  'on-confirm-rename-folder',
  'on-cancel-rename-folder',
  'update:isRenameFolderModalVisible',
  'update:inputContentDefault',
])

const inputContent = ref('')

const isDialogRenameVisible = computed({
  get() {
    return props.isRenameFolderModalVisible
  },
  set(value) {
    emit('update:isRenameFolderModalVisible', value)
  },
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
  emit('on-close-rename-folder')
}

const handleConfirmActionClick = () => {
  folderNameExists.value = false
  if (isFolderNameExists(inputContent.value)) {
    folderNameExists.value = true
    return
  }
  emit('on-confirm-rename-folder', inputContent.value)
}

const handleCancelActionClick = () => {
  folderNameExists.value = false
  emit('on-cancel-rename-folder')
}

// Modal validations

const isConfirmButtonDisabled = computed(
  () =>
    !validInputMaxLength(inputContent.value) ||
    inputContent.value.length === 0 ||
    !validInputAlphanumericFrench(inputContent.value),
)

const isValidInput = computed(() =>
  validInputAlphanumericFrench(inputContent.value),
)
const folderNameExists = ref(false)

const isFolderNameExists = (folderName: string): boolean => {
  return props.parentFolder?.children?.some((folder) => folder.name.trim() === folderName.trim())
}

const showErrorMsg = computed(
  () =>
    (!isValidInput.value || folderNameExists.value) &&
    inputContent.value.length !== 0,
)

// eslint-disable-next-line vitest/require-hook
watch(inputContent, () => {
  folderNameExists.value = false
})

// eslint-disable-next-line vitest/require-hook
watch(isDialogRenameVisible, () => {
  inputContent.value = props.inputContentDefault
})

</script>
<i18n lang="yaml">
en-US:
  validations:
    alphaNumerique: >
      Enter a name that does not contain any of the following characters:
      “ * : &lt; &gt; ? / \ |.
    folderNameExists: 'Un dossier avec le nom {folderName} existe déjà'

fr-FR:
  validations:
    alphaNumerique: >
      Entrez un nom qui ne contient aucun des caractères suivants :
      “ * : &lt; &gt; ? / \ |.
    folderNameExists: 'Un dossier avec le nom {folderName} existe déjà'
</i18n>
