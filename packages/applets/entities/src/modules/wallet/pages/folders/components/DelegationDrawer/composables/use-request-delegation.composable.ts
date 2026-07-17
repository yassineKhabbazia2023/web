import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { displayNotification } from '@pulse/styleguide'
import { logger } from '@pulse/toolbox'
import { REQUEST_DELEGATION_COLLAB_STEP, REQUEST_DELEGATION_FINAL_STEP, REQUEST_DELEGATION_INITIAL_STEP } from '../components/RequestDelegation/request-delegation.consts'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { createDelegationRequest } from '@entities/services/account'
import { DelegationRequestSummaryResult } from '@entities/modules/wallet/enums'
import type { UseRequestDelegationParams } from './use-request-delegation.composable.types'

export function useRequestDelegation({
  requestDelegationStep,
  requestDelegationRef,
  isDelegationDrawerOpened,
}: UseRequestDelegationParams) {
  const { t } = useI18n()

  const isSubmitting = ref(false)

  const requestDelegationBackButtonLabel = computed(() =>
    requestDelegationStep.value ? t('entities.delegationDrawer.backButtonLabel') : t('entities.delegationDrawer.cancelButtonLabel'),
  )

  const requestDelegationPrimaryButtonLabel = computed(() =>
    requestDelegationStep.value === REQUEST_DELEGATION_FINAL_STEP ? t('entities.requestDelegation.sendRequest') : t('entities.delegationDrawer.primaryButtonLabel'),
  )

  const isRequestDelegationNextDisabled = computed(() =>
    requestDelegationRef.value?.canGoNext === false || requestDelegationRef.value === null,
  )

  const requestDelegationBackCTA = computed(() => ({
    pLabel: requestDelegationBackButtonLabel.value,
    pDisabled: isSubmitting.value,
    pTestId: 'request-delegation-previous-button',
  }))

  const requestDelegationPrimaryCTA = computed(() => ({
    pLabel: requestDelegationPrimaryButtonLabel.value,
    pDisabled: isRequestDelegationNextDisabled.value,
    pLoading: isSubmitting.value,
    pTestId: 'request-delegation-next-button',
  }))

  function handleRequestDelegationPrevious() {
    if (requestDelegationStep.value === REQUEST_DELEGATION_INITIAL_STEP) {
      isDelegationDrawerOpened.value = false
    } else {
      requestDelegationStep.value--
    }
  }

  async function handleRequestDelegationNext() {
    if (requestDelegationStep.value === REQUEST_DELEGATION_FINAL_STEP) {
      await submitDelegationRequest()
    } else {
      handleAmplitudeEvent()
      requestDelegationStep.value++
    }
  }

  async function submitDelegationRequest() {
    const selectedAccount = requestDelegationRef.value?.selectedAccount ?? null
    const recipientIds = requestDelegationRef.value?.selectedCollaborators.map(({ contactId }) => contactId) ?? []

    if (selectedAccount === null || recipientIds.length === 0) {
      return
    }

    isSubmitting.value = true
    try {
      await createDelegationRequest({ accountId: selectedAccount.accountId, recipientIds })
      handleAmplitudeEvent(DelegationRequestSummaryResult.SUCCEEDED)
      displayNotification('success', t('entities.requestDelegation.requestSentSuccess'))
      isDelegationDrawerOpened.value = false
    } catch (error) {
      handleAmplitudeEvent(DelegationRequestSummaryResult.FAILED)
      displayNotification('error', t('entities.requestDelegation.requestSentError'))
      logger.error('Failed to create delegation request', error)
    } finally {
      isSubmitting.value = false
    }
  }

  function handleAmplitudeEvent(summaryResult?: DelegationRequestSummaryResult) {
    let eventName = ''
    let eventProperties = {}

    if (requestDelegationStep.value === REQUEST_DELEGATION_INITIAL_STEP) {
      eventName = 'Delegation Request Company Validated'
    } else if (requestDelegationStep.value === REQUEST_DELEGATION_COLLAB_STEP) {
      eventName = 'Delegation Request Collaborators Validated'
      eventProperties = {
        delegation_request_collaborator_validated_update: hasSelectionChanged.value ? 'modified' : 'not modified',
        delegation_request_collaborator_validated_number: requestDelegationRef.value?.selectedCollaborators.length ?? 0,
      }
    } else if (requestDelegationStep.value === REQUEST_DELEGATION_FINAL_STEP) {
      eventName = 'Delegation Request Summary Completed'
      eventProperties = {
        delegation_request_summary_completed_result: summaryResult,
      }
    }

    AmplitudeService.track(eventName, ...(Object.keys(eventProperties).length > 0 ? [eventProperties] : []))
  }

  const hasSelectionChanged = computed(() => {
    const selectedCollaborators = requestDelegationRef.value?.selectedCollaborators ?? []
    const initiallySelectedCollaborators = requestDelegationRef.value?.initiallySelectedCollaborators ?? []

    return selectedCollaborators.length !== initiallySelectedCollaborators.length ||
      selectedCollaborators.some(c => initiallySelectedCollaborators.every(d => d.contactId !== c.contactId))
  })

  return {
    requestDelegationBackCTA,
    requestDelegationPrimaryCTA,
    handleRequestDelegationPrevious,
    handleRequestDelegationNext,
  }
}
