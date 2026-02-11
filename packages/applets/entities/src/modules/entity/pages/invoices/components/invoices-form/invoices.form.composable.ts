import { computed, onMounted, ref } from 'vue'
import type { BillingSubmissionInputRequest, InvoicesFullFormModel } from '@entities/modules/entity/types'
import { InvoicesFormStep, DigitalSafeStatus } from '@entities/modules/entity/enums'
import { INVOICES_STEPS_ORDER, TOTAL_STEPS, DIGITAL_SAFE_STATUS_TO_STEP } from '../../invoices.constants'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { InvoicesService } from '@entities/modules/entity/services/invoices.service'
import { getContactById } from '@entities/services/contact'

export function useInvoicesForm() {
  const currentStep = ref<InvoicesFormStep>(INVOICES_STEPS_ORDER[0])
  const userStore = useUserStore()
  const currentEntityStore = useCurrentEntityStore()
  const { user } = storeToRefs(userStore)
  const { currentEntityAccountNumber } = storeToRefs(currentEntityStore)

  const userDigitalSafeSubscriptionStatus = ref<DigitalSafeStatus>(DigitalSafeStatus.NOT_SUBSCRIBED)
  onMounted(async () => {
    try {
      const status = await InvoicesService.getSubscriptionStatus(currentEntityAccountNumber.value)
      userDigitalSafeSubscriptionStatus.value = status

      const mappedStep = DIGITAL_SAFE_STATUS_TO_STEP[status]
      if (mappedStep !== null) {
        currentStep.value = mappedStep
      }
    } catch (error) {
      logger.error('can\'t get digital safe subscription status', error)
    }
  })
  const currentStepIndex = computed(() =>
    INVOICES_STEPS_ORDER.indexOf(currentStep.value),
  )

  const shouldShowVaultBeingCreated = computed(() =>
    currentStep.value === InvoicesFormStep.VAULT_BEING_CREATED ||
    userDigitalSafeSubscriptionStatus.value === DigitalSafeStatus.SUBMITTED,
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
      await InvoicesService.submitIntegration(currentEntityAccountNumber.value, payload)
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
    userDigitalSafeSubscriptionStatus,
    shouldShowVaultBeingCreated,
    currentStep,
    formData,
    hasIntegrationError,
    submitIntegration,
    goToNextStep,
    goToPreviousStep,
    goToVaultBeingCreated,
  }
}
