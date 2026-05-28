import { computed } from 'vue'
import type { Ref, WritableComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { REQUEST_DELEGATION_FINAL_STEP, REQUEST_DELEGATION_INITIAL_STEP } from '../components/RequestDelegation/request-delegation.consts'

interface UseRequestDelegationParams {
  requestDelegationStep: Ref<number>
  requestDelegationRef: Ref<{ canGoNext: boolean } | null>
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
    if (requestDelegationStep.value === REQUEST_DELEGATION_FINAL_STEP) {
      isDelegationDrawerOpened.value = false
    } else {
      requestDelegationStep.value++
    }
  }

  return {
    requestDelegationBackCTA,
    requestDelegationPrimaryCTA,
    handleRequestDelegationPrevious,
    handleRequestDelegationNext,
  }
}
