import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { SupportingDocumentType } from '@entities/enums'
import { ConformityDocumentsService } from '@entities/services/conformity-documents'
import type { SupportingDocumentItem } from '@entities/services/conformity-documents'
import { PROSPECT_DOCUMENT_DEFAULT_MAX_FILES } from '@entities/modules/entity/prospect/prospect.constants'
import { OnboardingStep, OnboardingStepStatus } from '../prospect-conformity.enums'
import { useOnboardingStepStatus } from '../onboarding-step-status.composable'
import type { ConformityDocumentsEmits } from './conformity-documents.types'

export function useConformityDocuments(emit: ConformityDocumentsEmits) {
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  const { status, isLoadingStatus, reloadStatus } = useOnboardingStepStatus(OnboardingStep.SupportingDocuments)

  const isLoadingSupportingDocuments = ref(true)
  // True when the shared /supporting-documents fetch failed, so both sections show an alert.
  const hasError = ref(false)
  // Single source of truth: the /supporting-documents response, split below per child.
  const items = ref<SupportingDocumentItem[]>([])

  // Once the supporting-documents step is completed, both sections become read-only.
  const isCompleted = computed(() => status.value === OnboardingStepStatus.Completed)
  // Skeleton stays until both the documents and this step's status are known.
  const isLoading = computed(() => isLoadingSupportingDocuments.value || isLoadingStatus.value)

  const predefinedItems = computed(() =>
    items.value.filter((item) => item.type !== SupportingDocumentType.COMPLEMENTARY),
  )
  const complementaryItem = computed(() =>
    items.value.find((item) => item.type === SupportingDocumentType.COMPLEMENTARY),
  )
  const complementaryDocuments = computed(() => complementaryItem.value?.documents ?? [])
  // Fallback keeps the complementary section usable when the item has no maxFiles.
  const complementaryMaxFiles = computed(
    () => complementaryItem.value?.maxFiles ?? PROSPECT_DOCUMENT_DEFAULT_MAX_FILES,
  )

  // While loading/error, items are empty: keep both cards so loaders/error alerts still show.
  // Once loaded successfully, render each card only if the API returned matching documents.
  const shouldDisplaySupportingDocuments = computed(
    () => isLoading.value || hasError.value || predefinedItems.value.length > 0,
  )
  const shouldDisplayComplementaryDocuments = computed(
    () => isLoading.value || hasError.value || complementaryItem.value !== undefined,
  )

  const loadSupportingDocuments = async () => {
    if (currentEntityId.value === undefined) {
      isLoadingSupportingDocuments.value = false
      return
    }
    isLoadingSupportingDocuments.value = true
    hasError.value = false
    try {
      const response = await ConformityDocumentsService.getSupportingDocuments(currentEntityId.value)
      items.value = response.documents
    } catch (error) {
      logger.error('Error fetching supporting documents', error)
      hasError.value = true
    } finally {
      isLoadingSupportingDocuments.value = false
    }
  }

  const reload = () => loadSupportingDocuments()

  // Saving/deleting required documents can change the backend step status,
  // so reload the local list and this step's status, then let the parent re-sync the onboarding steps.
  const onSupportingDocumentsChanged = async () => {
    await loadSupportingDocuments()
    await reloadStatus()
    emit('refresh-steps')
  }

  onMounted(loadSupportingDocuments)

  return {
    isLoading,
    isCompleted,
    hasError,
    predefinedItems,
    complementaryDocuments,
    complementaryMaxFiles,
    shouldDisplaySupportingDocuments,
    shouldDisplayComplementaryDocuments,
    reload,
    onSupportingDocumentsChanged,
  }
}
