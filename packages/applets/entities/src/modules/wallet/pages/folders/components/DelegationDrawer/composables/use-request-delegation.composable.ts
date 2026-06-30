import { computed } from 'vue'
import type { Ref, WritableComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { REQUEST_DELEGATION_COLLAB_STEP, REQUEST_DELEGATION_FINAL_STEP, REQUEST_DELEGATION_INITIAL_STEP } from '../components/RequestDelegation/request-delegation.consts'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import type { Collab } from '@entities/types'

type RequestDelegationRef = {
  canGoNext: boolean
  selectedCollaborators: Collab[]
  initiallySelectedCollaborators: Collab[] | null
}

interface UseRequestDelegationParams {
  requestDelegationStep: Ref<number>
  requestDelegationRef: Ref<RequestDelegationRef | null>
  isDelegationDrawerOpened: WritableComputedRef<boolean>
}

export function useRequestDelegation({
  requestDelegationStep,
  requestDelegationRef,
  isDelegationDrawerOpened,
}: UseRequestDelegationParams) {
  const { t } = useI18n({ useScope: 'parent' })

  const requestDelegationBackButtonLabel = computed(() =>
    requestDelegationStep.value ? t('entities.delegationDrawer.backButtonLabel') : t('entities.delegationDrawer.cancelButtonLabel'),
  )

  const requestDelegationPrimaryButtonLabel = computed(() =>
    requestDelegationStep.value === REQUEST_DELEGATION_FINAL_STEP ? t('entities.delegationDrawer.submitButtonLabel') : t('entities.delegationDrawer.primaryButtonLabel'),
  )

  const isRequestDelegationNextDisabled = computed(() =>
    requestDelegationRef.value?.canGoNext === false || requestDelegationRef.value === null,
  )

  const requestDelegationBackCTA = computed(() => ({
    pLabel: requestDelegationBackButtonLabel.value,
    pTestId: 'request-delegation-previous-button',
  }))

  const requestDelegationPrimaryCTA = computed(() => ({
    pLabel: requestDelegationPrimaryButtonLabel.value,
    pDisabled: isRequestDelegationNextDisabled.value,
    pTestId: 'request-delegation-next-button',
  }))

  function handleRequestDelegationPrevious() {
    if (requestDelegationStep.value === REQUEST_DELEGATION_INITIAL_STEP) {
      isDelegationDrawerOpened.value = false
    } else {
      requestDelegationStep.value--
    }
  }

  function handleRequestDelegationNext() {
    handleAmplitudeEvent()

    if (requestDelegationStep.value === REQUEST_DELEGATION_FINAL_STEP) {
      isDelegationDrawerOpened.value = false
    } else {
      requestDelegationStep.value++
    }
  }

  function handleAmplitudeEvent() {
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
        delegation_request_summary_completed_result: 'succeeded',
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
