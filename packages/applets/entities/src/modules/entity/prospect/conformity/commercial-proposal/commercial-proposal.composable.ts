import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { useCurrentEntityStore } from '@pulse/common/stores'
import { displayNotification } from '@pulse/styleguide'
import { openDocumentInNewTab } from '@pulse/common/helpers'
import { ProspectsService } from '@entities/services/prospects/prospects.service'
import { OnboardingStep } from '../prospect-conformity.enums'
import { useOnboardingStepStatus } from '../onboarding-step-status.composable'
import type { CommercialProposalEmits } from './commercial-proposal.types'

const I18N_KEY = 'entities.prospect.conformity.proposal'

export function useCommercialProposal(emit: CommercialProposalEmits) {
  const { t } = useI18n()
  const { currentEntityId } = storeToRefs(useCurrentEntityStore())

  const {
    status,
    isLoadingStatus: isLoading,
    isRefreshingStatus,
    reloadStatus,
  } = useOnboardingStepStatus(OnboardingStep.CommercialProposal)

  const selectedCommercialProposalFile = ref<File | null>(null)
  const isDownloading = ref(false)
  const isSending = ref(false)

  const openCommercialProposalDocument = async (): Promise<void> => {
    if (currentEntityId.value === undefined) {
      return
    }
    isDownloading.value = true
    try {
      const hasOpened = await openDocumentInNewTab(() =>
        ProspectsService.downloadCommercialProposal(currentEntityId.value!),
      )
      if (hasOpened === false) {
        displayNotification('error', t(`${I18N_KEY}.downloadError`))
      }
    } catch (error) {
      logger.error('Error downloading commercial proposal document', error)
      displayNotification('error', t(`${I18N_KEY}.downloadError`))
    } finally {
      isDownloading.value = false
    }
  }

  const sendCommercialProposalToCustomer = async (): Promise<void> => {
    if (currentEntityId.value === undefined || selectedCommercialProposalFile.value === null) {
      return
    }
    isSending.value = true
    try {
      await ProspectsService.uploadCommercialProposal(currentEntityId.value!, selectedCommercialProposalFile.value)
      selectedCommercialProposalFile.value = null
      displayNotification('success', t(`${I18N_KEY}.sendSuccess`))
      // Refresh this section's own status, then let the parent refresh the stepper.
      await reloadStatus()
      emit('sent')
    } catch (error) {
      logger.error('Error sending commercial proposal to customer', error)
      displayNotification('error', t(`${I18N_KEY}.sendError`))
    } finally {
      isSending.value = false
    }
  }

  return {
    status,
    isLoading,
    isRefreshingStatus,
    isDownloading,
    isSending,
    selectedCommercialProposalFile,
    openCommercialProposalDocument,
    sendCommercialProposalToCustomer,
  }
}
