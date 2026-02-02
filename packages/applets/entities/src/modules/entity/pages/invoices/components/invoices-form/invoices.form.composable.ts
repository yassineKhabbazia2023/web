import { computed, ref } from 'vue'
import type { BillingSubmissionInputRequest, InvoicesFullFormModel } from '@entities/modules/entity/types'
import { InvoicesFormStep } from '../../invoices.enums'
import { INVOICES_STEPS_ORDER, TOTAL_STEPS } from '../../invoices.constants'
import { useUserStore, useCurrentEntityStore } from '@pulse/common/stores'
import { storeToRefs } from 'pinia'
import { logger } from '@pulse/toolbox'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { InvoicesService } from '@entities/modules/entity/services/invoices.service'
import { getContactById } from '@entities/services/contact'

export function useInvoicesForm() {
  const currentStep = ref<InvoicesFormStep>(INVOICES_STEPS_ORDER[0])
  const userStore = useUserStore()
  const currentEntityStore = useCurrentEntityStore()
  const { user } = storeToRefs(userStore)
  const { currentEntityAccountNumber } = storeToRefs(currentEntityStore)

  const currentStepIndex = computed(() =>
    INVOICES_STEPS_ORDER.indexOf(currentStep.value),
  )

  const formData = ref<InvoicesFullFormModel>({
    email: '',
    acceptTerms: false,
    selectedContactId: null,
  })

  const goToNextStep = () => {
    const nextIndex = currentStepIndex.value + 1
    if (nextIndex < INVOICES_STEPS_ORDER.length) {
      currentStep.value = INVOICES_STEPS_ORDER[nextIndex]
    }
  }

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex.value - 1
    if (prevIndex >= 0) {
      currentStep.value = INVOICES_STEPS_ORDER[prevIndex]
    }
  }

  const submitIntegration = async () => {
    if (
      isNotNullNorEmpty(currentEntityAccountNumber.value) === false ||
      isNotNullNorEmpty(formData.value?.selectedContactId) === false
    ) {
      return
    }

    if (isNotNullNorEmpty(user.value?.email) === false) {
      logger.error('Unmanaged case, requester email is not set')
      return
    }

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

    await InvoicesService.submitIntegration(currentEntityAccountNumber.value, payload)
  }

  const goToVaultBeingCreated = () => {
    currentStep.value = InvoicesFormStep.VAULT_BEING_CREATED
  }

  return {
    TOTAL_STEPS,
    currentStep,
    formData,
    submitIntegration,
    goToNextStep,
    goToPreviousStep,
    goToVaultBeingCreated,
  }
}
