import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import { displayNotification } from '@pulse/styleguide'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { OnboardingStep } from '../prospect-conformity.enums'
import { useOnboardingStepStatus } from '../onboarding-step-status.composable'
import { BeneficiariesManager } from './beneficiaries.manager'
import { BENEFICIARIES_I18N_KEYS } from './beneficiaries.constants'
import type { Beneficiary } from '@entities/modules/entity/prospect/types'
import type {
  BeneficiaryFormState,
  UseBeneficiariesEmits,
} from './beneficiaries.types'

export function useBeneficiaries(emit: UseBeneficiariesEmits) {
  const { t } = useI18n()
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  const {
    status: beneficiaryStepStatus,
    isLoadingStatus,
    isRefreshingStatus,
    reloadStatus,
  } = useOnboardingStepStatus(OnboardingStep.Beneficiary)

  const isLoadingBeneficiaries = ref(true)
  const isRefreshing = ref(false)
  const isSaving = ref(false)
  const isValidatingAll = ref(false)
  const beneficiaries = ref<Beneficiary[]>([])
  const activeBeneficiaryId = ref<string>()
  const formStateByBeneficiaryId = ref<Record<string, BeneficiaryFormState>>({})

  // Skeleton stays until both the beneficiaries and this step's status are known.
  const isLoading = computed(() => isLoadingBeneficiaries.value || isLoadingStatus.value)

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
    if (currentEntityId.value === undefined || currentEntityId.value === null) {
      isLoadingBeneficiaries.value = false
      isRefreshing.value = false
      return
    }
    // Show skeleton on first load, spinner on refresh
    if (isLoadingBeneficiaries.value === false) {
      isRefreshing.value = true
    }
    try {
      const response = await ProspectsService.fetchBeneficiaries(currentEntityId.value)
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
      displayNotification('error', t('entities.prospect.conformity.beneficiaries.fetchError'))
      beneficiaries.value = []
    } finally {
      isLoadingBeneficiaries.value = false
      isRefreshing.value = false
    }
  }

  // Base URL consumed by the upload components' native delete: they call
  // DELETE `${documentsRemoteDeleteUrl}/${documentId}` themselves.
  const documentsRemoteDeleteUrl = computed<string | undefined>(() =>
    currentEntityId.value === undefined || currentEntityId.value === null
      ? undefined
      : ProspectsService.getProspectDocumentDeleteBaseUrl(currentEntityId.value),
  )

  // Zone-aware selection: each upload zone owns a single slot (CNI: 0 = recto,
  // 1 = verso), so a direct index assignment keeps the other zones untouched.
  const onZoneFileChanged = (zoneIndex: number, file: File | null) => {
    const formState = activeFormState.value
    if (formState === undefined) {
      return
    }
    formState.files[zoneIndex] = file
  }

  // Deletion (confirmation + API call + error toast) is owned by the upload
  // component's native delete; the composable only notifies and refreshes.
  const onDocumentDeleted = async () => {
    displayNotification('success', t('entities.prospect.deleteDocumentDialog.success'))
    await loadBeneficiaries()
    await reloadStatus()
    emit('refresh-steps')
  }

  const onSave = async () => {
    const formState = activeFormState.value
    const activeBeneficiary = beneficiaries.value.find(
      (beneficiary) => beneficiary.beneficiaryId === activeBeneficiaryId.value,
    )
    if (
      currentEntityId.value === undefined ||
      currentEntityId.value === null ||
      activeBeneficiaryId.value === undefined ||
      activeBeneficiary === undefined ||
      formState === undefined
    ) {
      return
    }

    const selectedFiles = BeneficiariesManager.getSelectedFiles(formState)
    if (
      formState.documentType === null ||
      selectedFiles.length === 0 ||
      BeneficiariesManager.hasRequiredFilesCount(activeBeneficiary, formState) === false ||
      BeneficiariesManager.isFormStateDirty(activeBeneficiary, formState) === false
    ) {
      return
    }
    isSaving.value = true
    try {
      await ProspectsService.uploadBeneficiaryDocuments(
        currentEntityId.value,
        activeBeneficiaryId.value,
        formState.documentType,
        selectedFiles,
      )
      displayNotification(
        'success',
        t(BENEFICIARIES_I18N_KEYS.SAVE_SUCCESS, {
          beneficiary: `${activeBeneficiary.firstName} ${activeBeneficiary.lastName}`,
          count: selectedFiles.length,
        }),
      )
      await loadBeneficiaries()
      await reloadStatus()
      emit('refresh-steps')
    } catch (error) {
      logger.error('Error uploading beneficiary documents', error)
      displayNotification('error', t(BENEFICIARIES_I18N_KEYS.SAVE_ERROR))
    } finally {
      isSaving.value = false
    }
  }

  const onValidateAllBeneficiaries = async () => {
    if (currentEntityId.value === undefined || currentEntityId.value === null) {
      return
    }

    isValidatingAll.value = true
    try {
      await ProspectsService.completeOnboardingStep(currentEntityId.value, OnboardingStep.Beneficiary)
      displayNotification('success', t(BENEFICIARIES_I18N_KEYS.VALIDATE_SUCCESS))
      await reloadStatus()
      emit('refresh-steps')
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
    beneficiaryStepStatus,
    isRefreshing,
    isRefreshingStatus,
    isSaving,
    isValidatingAll,
    beneficiaries,
    activeBeneficiary,
    activeBeneficiaryId,
    activeFormState,
    formStateByBeneficiaryId,
    hasActiveAttachments,
    canSaveActiveDocuments,
    documentsRemoteDeleteUrl,
    onZoneFileChanged,
    onDocumentDeleted,
    onSave,
    onValidateAllBeneficiaries,
  }
}
