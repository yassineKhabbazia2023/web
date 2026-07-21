import { computed, onMounted, ref } from 'vue'
import type { Ref } from 'vue'
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

export function useConformityDocuments(
  emit: ConformityDocumentsEmits,
  hasSupportingDocumentsStep: Ref<boolean>,
  hasSupportingDocumentsAccess: Ref<boolean>,
  hasComplementaryDocumentsAccess: Ref<boolean>,
) {
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  // Only the supporting-documents card consumes this status, so a step absent
  // from /steps or a denied access skips the fetch.
  const shouldFetchSupportingDocumentsStatus = computed(
    () => hasSupportingDocumentsStep.value === true && hasSupportingDocumentsAccess.value === true,
  )
  const {
    status,
    isLoadingStatus,
    hasStatusError,
    reloadStatus,
  } = useOnboardingStepStatus(
    OnboardingStep.SupportingDocuments,
    shouldFetchSupportingDocumentsStatus,
  )

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

  // The supporting card depends on two fetches (its documents and its step status):
  // a failure of either one must surface on the card instead of hiding it.
  const hasSupportingDocumentsError = computed(() => hasError.value || hasStatusError.value)

  // While loading/error, items are empty: keep both cards so loaders/error alerts still show.
  // Once loaded successfully, render each card only if the API returned matching documents.
  // A step absent from /steps has no supporting card at all: only the complementary card renders.
  // A denied card (step present, access denied) always stays visible: it carries the
  // access-denied message instead of data.
  const shouldDisplaySupportingDocuments = computed(
    () => hasSupportingDocumentsStep.value === true
      && (hasSupportingDocumentsAccess.value === false
        || isLoading.value || hasSupportingDocumentsError.value || predefinedItems.value.length > 0),
  )
  const shouldDisplayComplementaryDocuments = computed(
    () => hasComplementaryDocumentsAccess.value === false
      || isLoading.value || hasError.value || complementaryItem.value !== undefined,
  )

  const loadSupportingDocuments = async () => {
    // The fetch is shared by both cards: skip it only when neither can show data.
    if (hasSupportingDocumentsAccess.value === false && hasComplementaryDocumentsAccess.value === false) {
      isLoadingSupportingDocuments.value = false
      return
    }
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
    hasSupportingDocumentsError,
    predefinedItems,
    complementaryDocuments,
    complementaryMaxFiles,
    shouldDisplaySupportingDocuments,
    shouldDisplayComplementaryDocuments,
    reload,
    onSupportingDocumentsChanged,
  }
}
