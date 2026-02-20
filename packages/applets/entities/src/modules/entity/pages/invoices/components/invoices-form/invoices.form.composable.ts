import { computed, ref, watch } from 'vue'
import type { BillingSubmissionInputRequest, InvoicesFullFormModel } from '@entities/modules/entity/types'
import { InvoicesFormStep } from '@entities/modules/entity/enums'
import { InvoicesTabState } from '@pulse/common/services/invoices-access'
import { INVOICES_STEPS_ORDER, TOTAL_STEPS, TAB_STATE_TO_STEP } from '../../invoices.constants'
import { useUserStore, useCurrentEntityStore, useInvoicesAccessStore } from '@pulse/common/stores'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { InvoicesService } from '@entities/modules/entity/services/invoices.service'
import { getContactById } from '@entities/services/contact'

export function useInvoicesForm() {
  const currentStep = ref<InvoicesFormStep>(INVOICES_STEPS_ORDER[0])
  const userStore = useUserStore()
  const currentEntityStore = useCurrentEntityStore()
  const { user } = storeToRefs(userStore)
  const { currentEntityId } = storeToRefs(currentEntityStore)

  const invoicesAccessStore = useInvoicesAccessStore()
  const { tabState, contactWithAccess } = storeToRefs(invoicesAccessStore)

  const isAllowedToAccessVault = computed(() => tabState.value === InvoicesTabState.CONNECTION_READY_UNLOCKED)

  watch(tabState, (state) => {
    if (state !== null) {
      currentStep.value = TAB_STATE_TO_STEP[state]
    }
  }, { immediate: true })

  const currentStepIndex = computed(() =>
    INVOICES_STEPS_ORDER.indexOf(currentStep.value),
  )

  // currentStep is the single source of truth: set by the watch (from tabState via TAB_STATE_TO_STEP) or by local navigation
  const shouldShowVaultBeingCreated = computed(() =>
    currentStep.value === InvoicesFormStep.VAULT_BEING_CREATED,
  )

  const shouldHideFormHeader = computed(() =>
    shouldShowVaultBeingCreated.value || currentStep.value === InvoicesFormStep.ACCESS_VAULT,
  )

  const shouldShowVaultAccessDenied = computed(() =>
    isAllowedToAccessVault.value === false && currentStep.value === InvoicesFormStep.ACCESS_VAULT,
  )

  const formData = ref<InvoicesFullFormModel>({
    email: '',
    acceptTerms: false,
    selectedContactId: null,
  })

  const hasIntegrationError = ref(false)

  const goToNextStep = () => {
    hasIntegrationError.value = false

    const nextIndex = currentStepIndex.value + 1
    if (nextIndex < INVOICES_STEPS_ORDER.length) {
      currentStep.value = INVOICES_STEPS_ORDER[nextIndex]
    }
  }

  const goToPreviousStep = () => {
    hasIntegrationError.value = false

    const prevIndex = currentStepIndex.value - 1
    if (prevIndex >= 0) {
      currentStep.value = INVOICES_STEPS_ORDER[prevIndex]
    }
  }

  const submitIntegration = async () => {
    hasIntegrationError.value = false

    const contact = await getContactById(formData.value.selectedContactId!)
    if (contact === undefined || contact === null) {
      logger.error('Unmanaged case, contact is not set')
      return
    }

    const payload: BillingSubmissionInputRequest = {
      dematerializationEmail: formData.value.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      vaultEmail: contact.email,
      requesterEmail: user.value!.email,
    }

    try {
      await InvoicesService.submitIntegration(currentEntityId.value!, payload)
    } catch (error) {
      logger.error('Unable to submit digital vault integration', error)
      hasIntegrationError.value = true
    }
  }

  const goToVaultBeingCreated = () => {
    currentStep.value = InvoicesFormStep.VAULT_BEING_CREATED
  }

  return {
    TOTAL_STEPS,
    tabState,
    isAllowedToAccessVault,
    contactWithAccess,
    shouldShowVaultBeingCreated,
    shouldHideFormHeader,
    shouldShowVaultAccessDenied,
    currentStep,
    formData,
    hasIntegrationError,
    submitIntegration,
    goToNextStep,
    goToPreviousStep,
    goToVaultBeingCreated,
  }
}
