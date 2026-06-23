import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { OnboardingStep } from '../prospect-conformity.enums'
import { BeneficiariesManager } from './beneficiaries.manager'
import { BENEFICIARIES_I18N_KEYS } from './beneficiaries.constants'
import type { Beneficiary, BeneficiaryDocument } from '@entities/modules/entity/prospect/types'
import type {
  BeneficiaryDocumentDeletionTarget,
  BeneficiaryFormState,
  UseBeneficiariesEmits,
} from './beneficiaries.types'

export function useBeneficiaries(emit: UseBeneficiariesEmits) {
  const { t } = useI18n()
  const { currentEntity } = storeToRefs(useCurrentEntityStore())
  const currentProspectId = computed(() => currentEntity.value?.prospectId)

  const isLoading = ref(true)
  const isSaving = ref(false)
  const isValidatingAll = ref(false)
  const beneficiaries = ref<Beneficiary[]>([])
  const activeBeneficiaryId = ref<string>()
  const formStateByBeneficiaryId = ref<Record<string, BeneficiaryFormState>>({})

  const activeBeneficiary = computed<Beneficiary | undefined>(() =>
    beneficiaries.value.find((b) => b.beneficiaryId === activeBeneficiaryId.value),
  )

  const activeFormState = computed<BeneficiaryFormState | undefined>(() =>
    activeBeneficiaryId.value === undefined
      ? undefined
      : formStateByBeneficiaryId.value[activeBeneficiaryId.value],
  )

  const hasActiveAttachments = computed<boolean>(() => {
    if (activeBeneficiary.value === undefined || activeFormState.value === undefined) {
      return false
    }
    return BeneficiariesManager.getAttachmentsCount(activeBeneficiary.value, activeFormState.value) > 0
  })

  const canSaveActiveDocuments = computed<boolean>(() => {
    if (activeBeneficiary.value === undefined || activeFormState.value === undefined) {
      return false
    }
    return BeneficiariesManager.canSaveDocuments(activeBeneficiary.value, activeFormState.value)
  })

  const loadBeneficiaries = async () => {
    if (currentProspectId.value === undefined || currentProspectId.value === null) {
      isLoading.value = false
      return
    }
    isLoading.value = true
    try {
      const response = await ProspectsService.fetchBeneficiaries(currentProspectId.value)
      beneficiaries.value = response.beneficiaries

      formStateByBeneficiaryId.value = Object.fromEntries(
        beneficiaries.value.map((beneficiary) => [
          beneficiary.beneficiaryId,
          BeneficiariesManager.buildFormState(beneficiary),
        ]),
      )
      const isActiveStillPresent = beneficiaries.value.some(
        (beneficiary) => beneficiary.beneficiaryId === activeBeneficiaryId.value,
      )
      if (isActiveStillPresent === false) {
        activeBeneficiaryId.value = beneficiaries.value[0]?.beneficiaryId
      }
    } catch (error) {
      logger.error('Error fetching beneficiaries', error)
    } finally {
      isLoading.value = false
    }
  }

  const documentPendingDeletion = ref<BeneficiaryDocumentDeletionTarget>()

  const isDeleteDialogOpen = computed({
    get: () => documentPendingDeletion.value !== undefined,
    set: (isOpen: boolean) => {
      if (isOpen === false) {
        documentPendingDeletion.value = undefined
      }
    },
  })

  const onRequestDocumentDeletion = (beneficiaryId: string, document: BeneficiaryDocument) => {
    documentPendingDeletion.value = { beneficiaryId, document }
  }

  // Deletion (API call + notifications) is owned by the shared DeleteDocumentDialog;
  // the composable only clears the pending target and refreshes the list on success.
  const onDocumentDeleted = async () => {
    documentPendingDeletion.value = undefined
    await loadBeneficiaries()
  }

  const onSave = async () => {
    const formState = activeFormState.value
    const activeBeneficiary = beneficiaries.value.find(
      (beneficiary) => beneficiary.beneficiaryId === activeBeneficiaryId.value,
    )
    if (
      currentProspectId.value === undefined ||
      currentProspectId.value === null ||
      activeBeneficiaryId.value === undefined ||
      activeBeneficiary === undefined ||
      formState === undefined
    ) {
      return
    }

    if (
      formState.documentType === null ||
      formState.files.length === 0 ||
      BeneficiariesManager.hasRequiredFilesCount(activeBeneficiary, formState) === false ||
      BeneficiariesManager.isFormStateDirty(activeBeneficiary, formState) === false
    ) {
      return
    }
    isSaving.value = true
    try {
      await ProspectsService.uploadBeneficiaryDocuments(
        currentProspectId.value,
        activeBeneficiaryId.value,
        formState.documentType,
        formState.files,
      )
      displayNotification('success', t(BENEFICIARIES_I18N_KEYS.SAVE_SUCCESS))
      await loadBeneficiaries()
      emit('documents-saved')
    } catch (error) {
      logger.error('Error uploading beneficiary documents', error)
      displayNotification('error', t(BENEFICIARIES_I18N_KEYS.SAVE_ERROR))
    } finally {
      isSaving.value = false
    }
  }

  const onValidateAllBeneficiaries = async () => {
    if (currentProspectId.value === undefined || currentProspectId.value === null) {
      return
    }

    isValidatingAll.value = true
    try {
      await ProspectsService.completeOnboardingStep(currentProspectId.value, OnboardingStep.Beneficiary)
      displayNotification('success', t(BENEFICIARIES_I18N_KEYS.VALIDATE_SUCCESS))
      emit('documents-saved')
    } catch (error) {
      logger.error('Failed to validate beneficiaries', error)
      displayNotification('error', t(BENEFICIARIES_I18N_KEYS.VALIDATE_ERROR))
    } finally {
      isValidatingAll.value = false
    }
  }

  onMounted(loadBeneficiaries)

  return {
    isLoading,
    isSaving,
    isValidatingAll,
    currentProspectId,
    beneficiaries,
    activeBeneficiary,
    activeBeneficiaryId,
    activeFormState,
    formStateByBeneficiaryId,
    hasActiveAttachments,
    canSaveActiveDocuments,
    isDeleteDialogOpen,
    documentPendingDeletion,
    onRequestDocumentDeletion,
    onDocumentDeleted,
    onSave,
    onValidateAllBeneficiaries,
  }
}
