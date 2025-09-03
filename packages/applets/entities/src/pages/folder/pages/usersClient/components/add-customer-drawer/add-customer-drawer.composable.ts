import { ref, computed } from 'vue'
import { hasContactRoleOnCommonAccount } from '@entities/services/account'
import { AccountManager } from '@entities/managers/account/account.manager'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { useDebounce, logger } from '@pulse/core'
import { getEmailIsValid, getNameIsValid } from '@pulse/core/utils/validator'
import { AddCustomerDrawerStep } from './add-customer-drawer.enums'
import type { Contact } from './add-customer-drawer.types'
import { saveUserPermissions } from '@entities/common/components/ManageRightsDrawer/utils'
import type { AuthorizationState } from '@entities/common/components/ManageRightsDrawer/ManageRightsTypes'

function amplitudeTrack(result: 'failed' | 'succeeded') {
  AmplitudeService.track('Onboarding Started', {
    onboarding_start_localisation: "Ajout d'un utilisateur",
    onboarding_start_result: result,
  })
}
export function useAddCustomerDrawer({
  debounceDelay,
  invalidEmailAdresseMessage,
  alreadyAddedToAccountMessage,
  addCustomerDrawerSteps,
  requiredInputMessage,
}: {
  debounceDelay: number
  invalidEmailAdresseMessage: string
  alreadyAddedToAccountMessage: string
  addCustomerDrawerSteps: AddCustomerDrawerStep[],
  requiredInputMessage: string
}) {
  const addCustomerDrawerStepIndex = ref(0)
  const isNextButtonLoading = ref(false)
  const hasFormSubmissionFailed = ref(false)
  const additionalOptionByActionCode = ref<Record<string, string>>()
  const additionalOptionByActionCodeOrigin = ref<Record<string, string>>()
  const emailErrorMessage = ref('')
  const firstNameErrorMessage = ref('')
  const lastNameErrorMessage = ref('')
  const contactId = ref<number>()
  const authorizationsState = ref<Record<string, AuthorizationState>>({})
  const shouldEnableNames = ref(false)

  const newContact = ref<Contact>({
    firstname: '',
    lastname: '',
    email: '',
  })

  const isLastStep = computed(() => {
    return addCustomerDrawerStepIndex.value >= addCustomerDrawerSteps.length - 1
  })

  const isAddContactSucceeded = computed(() => {
    return isLastStep.value &&
      hasFormSubmissionFailed.value === false
  })

  const isNextButtonDisabled = computed(() => {
    if (addCustomerDrawerStep.value === AddCustomerDrawerStep.MANAGE_RIGHTS){
      const hasSelection = Object.values(authorizationsState.value).some(({ isActive }) => isActive === true)
      return hasSelection === false // At least one group must be active
    }

    return newContact.value.email === '' || newContact.value.firstname === ''|| newContact.value.lastname === '' ||
     emailErrorMessage.value !== '' || firstNameErrorMessage.value !== '' || lastNameErrorMessage.value !== ''
  })

  const addCustomerDrawerStep = computed(() => addCustomerDrawerSteps[addCustomerDrawerStepIndex.value])

  function checkFirstName() {
    const firstName = newContact.value.firstname
    clearFirstNameErrorMessage()
    if (getNameIsValid(firstName) === false) {
      firstNameErrorMessage.value = requiredInputMessage
    }
  }
  function checkLastName() {
    const lastName = newContact.value.lastname
    clearLastNameErrorMessage()
    if (getNameIsValid(lastName) === false) {
      lastNameErrorMessage.value = requiredInputMessage
    }
  }

  async function checkEmail(
    targetEntityId: number,
  ) {
    const email = newContact.value.email
    clearEmailErrorMessage()
    if (getEmailIsValid(email) === false) {
      emailErrorMessage.value = invalidEmailAdresseMessage
      shouldEnableNames.value = false
      return
    }
    try {
      isNextButtonLoading.value = true
      const hasRoleOnAccount = await hasContactRoleOnCommonAccount(email, targetEntityId)
      if (hasRoleOnAccount === true) {
        emailErrorMessage.value = alreadyAddedToAccountMessage
      } else {
        shouldEnableNames.value = true
      }
    } catch (e) {
      logger.error(e)
    } finally {
      isNextButtonLoading.value = false
    }
  }

  function clearEmailErrorMessage() {
    emailErrorMessage.value = ''
  }
  function clearFirstNameErrorMessage() {
    firstNameErrorMessage.value = ''
  }
  function clearLastNameErrorMessage() {
    lastNameErrorMessage.value = ''
  }

  async function submitForm(
    targetEntityId: number,
    targetEntityNumber: string,
  ) {
    try {
      if (addCustomerDrawerStep.value === AddCustomerDrawerStep.ADD_EMAIL) {
        const isSuccess = await submitFormEmail(targetEntityId, targetEntityNumber)
        if (isSuccess) {
          goNextStep()
        }
        return isSuccess
      }
      if (addCustomerDrawerStep.value === AddCustomerDrawerStep.MANAGE_RIGHTS) {
        const isSuccess = await submitRights(targetEntityId, authorizationsState.value)
        if (isSuccess) {
          goNextStep()
        }
        return isSuccess
      }
    } catch (e) {
      logger.error(e)
    }
  }

  async function submitRights(
    targetEntityId: number,
    authorizationsState: Record<string, AuthorizationState>,
  ) {
    if (contactId.value === undefined) {
      logger.error('Unmanaged case, contactId is not set')
      return false
    }
    await saveUserPermissions({
      contactId: contactId.value,
      entityId: targetEntityId,
      authorizationsState,
      additionalOptionByActionCode: additionalOptionByActionCode.value,
      additionalOptionByActionCodeOrigin: additionalOptionByActionCodeOrigin.value,
    })
    return true
  }

  async function submitFormEmail(
    targetEntityId: number,
    targetEntityNumber: string,
  ) {
    await checkEmail(targetEntityId)

    if (isNextButtonDisabled.value === true) {
      return false
    }
    const isSuccess = await addContactFormSubmission(
      targetEntityId,
      targetEntityNumber,
    )

    return isSuccess
  }

  async function addContactFormSubmission(
    targetEntityId: number,
    targetEntityNumber: string,
  ) {
    let isSuccess = false
    isNextButtonLoading.value = true
    try {
      const customer = {
        firstName: newContact.value.firstname,
        lastName: newContact.value.lastname,
        mobilePhone: '',
        email: newContact.value.email,
        accountNumber: targetEntityNumber,
      }
      contactId.value = await AccountManager.createOrAddCustomerToAccount(customer, targetEntityId)
      onboardingSucceeded()
      isSuccess = true
    } catch (error) {
      logger.warn(error)
      onboardingFailed()
    } finally {
      isNextButtonLoading.value = false
    }
    return isSuccess
  }

  function goNextStep() {
    if (isLastStep.value) {
      return
    }
    addCustomerDrawerStepIndex.value = addCustomerDrawerStepIndex.value + 1
  }

  const onboardingFailed = () => {
    amplitudeTrack('failed')
    hasFormSubmissionFailed.value = true
  }
  const onboardingSucceeded = () => {
    amplitudeTrack('succeeded')
  }

  const debouncedCheckEmail = useDebounce(checkEmail, debounceDelay)
  const debouncedCheckFirstName = useDebounce(checkFirstName, debounceDelay)
  const debouncedCheckLastName = useDebounce(checkLastName, debounceDelay)

  return {
    addCustomerDrawerStepIndex,
    addCustomerDrawerStep,
    isNextButtonLoading,
    isNextButtonDisabled,
    isLastStep,
    hasFormSubmissionFailed,
    newContact,
    contactId,
    isAddContactSucceeded,
    emailErrorMessage,
    firstNameErrorMessage,
    lastNameErrorMessage,
    authorizationsState,
    additionalOptionByActionCode,
    additionalOptionByActionCodeOrigin,
    shouldEnableNames,
    checkEmail,
    debouncedCheckEmail,
    debouncedCheckFirstName,
    debouncedCheckLastName,
    submitForm,
    goNextStep,
  }
}
