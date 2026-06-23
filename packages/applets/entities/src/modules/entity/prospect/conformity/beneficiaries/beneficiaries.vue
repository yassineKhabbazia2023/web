<template>
  <div
    v-if="isLoading"
    class="flex flex--justify-content-center margin-y--4"
    data-testid="manage-rights-loader"
  >
    <PLoader pType="primary" pSize="50" />
  </div>
  <div
    v-else-if="beneficiaries.length > 0"
    class="beneficiaries"
  >
    <p
      class="
        margin--0
        margin-bottom--6
        font-size--14
      "
    >
      {{ t('entities.prospect.conformity.beneficiaries.description') }}
    </p>
    <PTabs v-model="activeTab">
      <PTabPane
        v-for="(beneficiary, index) in beneficiaries"
        :key="beneficiary.beneficiaryId"
        :pName="beneficiary.beneficiaryId"
      >
        <template #label>
          <span>{{ t('entities.prospect.conformity.beneficiaries.tabLabel', { index: index + 1 }) }}</span>
          <PPastille
            class="margin-left--2"
            pSize="small"
            :pType="BeneficiariesManager.isBeneficiaryComplete(beneficiary) ? 'dark-green' : 'error'"
          />
        </template>
        <PAlert
          v-if="hasActiveAttachments && isBeneficiaryStepNotCompleted"
          pType="info"
          class="margin-bottom--2"
          :pClosable="false"
        >
          {{ t('entities.prospect.conformity.beneficiaries.documentTypeChangeAlert') }}
        </PAlert>
        <div
          class="
            flex
            flex--direction-column
            margin-top--6
          "
        >
          <PForm
            :ref="(formInstance) => setFormRef(beneficiary.beneficiaryId, formInstance)"
            class="margin-bottom--2"
            :pModel="formStateByBeneficiaryId[beneficiary.beneficiaryId]"
            :pRules="beneficiaryFormRules"
            :pShowMessage="false"
            pLabelPosition="top"
            pRequireAsteriskPosition="right"
          >
            <PFormLine>
              <PFormItem
                class="flex--basis-11"
                pProp="documentType"
                pRequired
                :pLabel="t('entities.prospect.conformity.beneficiaries.documentTypeLabel')"
              >
                <PDropdown
                  v-model="formStateByBeneficiaryId[beneficiary.beneficiaryId].documentType"
                  :pOptions="documentTypeOptions"
                  :pPlaceholder="t('entities.prospect.conformity.beneficiaries.documentTypePlaceholder')"
                  :pDisabled="hasActiveAttachments"
                />
              </PFormItem>
              <PFormItem
                class="flex--grow-1"
                pProp="lastName"
                pRequired
                :pLabel="t('entities.prospect.conformity.beneficiaries.lastNameLabel')"
              >
                <PInput
                  v-model="formStateByBeneficiaryId[beneficiary.beneficiaryId].lastName"
                  pReadonly
                />
              </PFormItem>
              <PFormItem
                class="flex--grow-1"
                pProp="firstName"
                pRequired
                :pLabel="t('entities.prospect.conformity.beneficiaries.firstNameLabel')"
              >
                <PInput
                  v-model="formStateByBeneficiaryId[beneficiary.beneficiaryId].firstName"
                  pReadonly
                />
              </PFormItem>
            </PFormLine>
          </PForm>

          <!-- Document upload zones -->
          <BeneficiaryDocumentUpload
            :beneficiary="beneficiary"
            :formState="formStateByBeneficiaryId[beneficiary.beneficiaryId]"
            :beneficiaryStepStatus="beneficiaryStepStatus"
            @files-selected="(zoneIndex, files) => onFilesSelectedWrapper(zoneIndex, files)"
            @file-deleted="(zoneIndex, file) => onUploadFileDeletedWrapper(zoneIndex, file)"
            @document-deletion-requested="(document) => onRequestDocumentDeletion(beneficiary.beneficiaryId, document)"
          />

          <!-- Action buttons -->
          <!-- TODO: Implement view documents feature -->
          <BeneficiaryActions
            :canSave="canSaveActiveDocuments"
            :isSaving="isSaving"
            :isValidating="isValidatingAll"
            :beneficiaryStepStatus="beneficiaryStepStatus"
            @view-documents="() => {}"
            @save-documents="onSaveUploadedFiles"
            @validate-all-beneficiaries="onValidateAllBeneficiaries"
          />
        </div>
      </PTabPane>
    </PTabs>
    <DeleteDocumentDialog
      v-model="isDeleteDialogOpen"
      :pProspectId="currentProspectId!"
      :pDocumentId="documentPendingDeletion?.document.id ?? undefined"
      :pFileName="documentPendingDeletion?.document.fileName ?? undefined"
      @deleted="onDocumentDeleted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import type { FormInstance, UploadFile, UploadRawFile } from 'element-plus'
import {
  PAlert,
  PDropdown,
  PForm,
  PFormItem,
  PFormLine,
  PInput,
  PLoader,
  PPastille,
  PTabPane,
  PTabs,
} from '@pulse/styleguide/components'
import type { PDropdownOption } from '@pulse/styleguide/types'
import { BeneficiaryDocumentType } from '@entities/modules/entity/prospect/types'
import { BENEFICIARY_DOCUMENT_TYPE_TRANSLATION_KEYS } from './beneficiaries.constants'
import { buildBeneficiaryFormRules } from './beneficiaries.validation'
import { useBeneficiaries } from './beneficiaries.composable'
import { BeneficiariesManager } from './beneficiaries.manager'
import type { BeneficiariesProps } from './beneficiaries.types'
import { OnboardingStepStatus } from '../prospect-conformity.enums'
import BeneficiaryActions from './components/beneficiary-actions/beneficiary-actions.vue'
import BeneficiaryDocumentUpload from './components/beneficiary-document-upload/beneficiary-document-upload.vue'
import DeleteDocumentDialog from '../../dialog/delete-document-dialog/delete-document-dialog.vue'

const { t } = useI18n()

const props = defineProps<BeneficiariesProps>()

const emit = defineEmits<{
  (e: 'documents-saved'): void
}>()

const {
  isLoading,
  isSaving,
  isValidatingAll,
  currentProspectId,
  beneficiaries,
  activeBeneficiary,
  activeBeneficiaryId,
  formStateByBeneficiaryId,
  activeFormState,
  hasActiveAttachments,
  canSaveActiveDocuments,
  isDeleteDialogOpen,
  documentPendingDeletion,
  onRequestDocumentDeletion,
  onDocumentDeleted,
  onSave,
  onValidateAllBeneficiaries,
} = useBeneficiaries(emit)

const beneficiaryFormRules = buildBeneficiaryFormRules(
  t('entities.prospect.conformity.beneficiaries.requiredFieldError'),
)

const formRefByBeneficiaryId = ref<Record<string, FormInstance | null>>({})

const setFormRef = (beneficiaryId: string, formInstance: Element | ComponentPublicInstance | null) => {
  formRefByBeneficiaryId.value[beneficiaryId] = formInstance as FormInstance | null
}

const onSaveClick = async () => {
  const activeFormRef = activeBeneficiaryId.value === undefined
    ? undefined
    : formRefByBeneficiaryId.value[activeBeneficiaryId.value]
  if (activeFormRef !== undefined && activeFormRef !== null) {
    try {
      await activeFormRef.validate()
    } catch {
      return
    }
  }
  await onSave()
}

const activeTab = computed<string>({
  get: () => activeBeneficiaryId.value ?? '',
  set: (value: string | number) => {
    activeBeneficiaryId.value = String(value)
  },
})

const isBeneficiaryStepNotCompleted = computed(
  () => props.beneficiaryStepStatus !== OnboardingStepStatus.Completed,
)

const documentTypeOptions = computed<PDropdownOption[]>(() =>
  Object.values(BeneficiaryDocumentType).map((documentType) => ({
    pValue: documentType,
    pLabel: t(BENEFICIARY_DOCUMENT_TYPE_TRANSLATION_KEYS[documentType]),
  })),
)

// Zone-aware file selection handler
const onFilesSelectedWrapper = (zoneIndex: number, selectedFiles: File[]) => {
  if (activeBeneficiary.value === undefined || activeFormState.value === undefined) {
    return
  }

  if (selectedFiles.length === 0) {
    return
  }

  // Build new files array with zone awareness
  // For CNI: files[0] = recto, files[1] = verso
  // For PASSPORT: files[0] = passport
  const newFiles = [...activeFormState.value.files]
  newFiles[zoneIndex] = selectedFiles[0] // Each zone accepts 1 file max
  activeFormState.value.files = newFiles
}

// Zone-aware file deletion handler
const onUploadFileDeletedWrapper = (
  zoneIndex: number,
  _deletedFile: UploadFile | UploadRawFile,
) => {
  if (activeBeneficiary.value === undefined || activeFormState.value === undefined) {
    return
  }

  const newFiles = [...activeFormState.value.files]
  newFiles.splice(zoneIndex, 1)
  activeFormState.value.files = newFiles
}

// Save uploaded files
const onSaveUploadedFiles = async () => {
  if (activeBeneficiary.value === undefined) {
    return
  }

  await onSaveClick()
}
</script>
