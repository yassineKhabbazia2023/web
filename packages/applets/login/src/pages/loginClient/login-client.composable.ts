import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { logger } from '@pulse/toolbox'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { LoginService } from '@pulse/common/services/login'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { BackEndErrors } from '@pulse/common/constants'
import { RouteName } from '@pulse/common/enums'
import type { LoginErrorKey } from './LoginClient.utils'
import { getEmailErrorKey, getPasswordErrorKey } from './LoginClient.utils'

export function useLoginClient() {
  const router = useRouter()

  const email = ref('')
  const password = ref('')

  const emailErrorKey = ref<LoginErrorKey>('')
  const isEmailMessageVisible = ref(true)
  const passwordErrorKey = ref<LoginErrorKey>('')
  const isPasswordMessageVisible = ref(true)

  const isLoading = ref(false)

  function getIsValidForm() {
    return emailErrorKey.value === '' && passwordErrorKey.value === ''
  }
  const isValidForm = computed(() => getIsValidForm())

  const isSubmitButtonEnabled = computed(() => {
    if (isLoading.value) {
      return false
    }
    return isValidForm.value
  })

  function setEmailError(key: LoginErrorKey, showMessage = true) {
    emailErrorKey.value = key
    isEmailMessageVisible.value = showMessage
  }

  function setPasswordError(key: LoginErrorKey, showMessage = true) {
    passwordErrorKey.value = key
    isPasswordMessageVisible.value = showMessage
  }

  function checkPassword() {
    setPasswordError(getPasswordErrorKey(password.value))
  }

  function checkEmail() {
    setEmailError(getEmailErrorKey(email.value))
  }

  function checkValidity() {
    checkEmail()
    checkPassword()
    return getIsValidForm()
  }

  function handleKeypressAfterIncorrectCredentials() {
    // Only clear credential errors (not individual field validation errors)
    const hasCredentialErrors = isEmailMessageVisible.value === false && isPasswordMessageVisible.value === true
    if (hasCredentialErrors === false) {
      return
    }
    setEmailError('', false)
    setPasswordError('')
  }

  async function onSubmit() {
    const isValid = checkValidity()
    if (isValid === false) {
      return false
    }
    isLoading.value = true

    try {
      // Authentication, user init and Gigya SSO
      await LoginService.authenticate(email.value, password.value)

      // Get currentuser terms
      const { isCurrent, terms } = await getTermsByCurrentUser()

      if (isCurrent) {
        return router.push({ name: RouteName.LANDING })
      }
      return router.push({ name: RouteName.VALIDATION_CGU, params: { termsId: terms.termsId } })
    } catch (error: any) {
      logger.error('Error during login attempt: ', error)
      isLoading.value = false
      const invalidLoginErrorCodes = [
        BackEndErrors.WRONG_LOGIN_PASSWORD,
        BackEndErrors.INVALID_LOGIN_CREDENTIALS,
      ]
      const hasEmailOrPasswordInvalid = invalidLoginErrorCodes.includes(error.response?.data?.errorCode)
      const errorKey: LoginErrorKey = hasEmailOrPasswordInvalid ? 'emailOrPasswordError' : 'technicalError'
      setEmailError(errorKey, false)
      setPasswordError(errorKey)

      AmplitudeService.track('Sign In Completed', {
        sign_in_method: 'email',
        sign_in_result: 'failed',
      })
      return false
    }
  }

  return {
    email,
    password,
    emailErrorKey,
    isEmailMessageVisible,
    passwordErrorKey,
    isPasswordMessageVisible,
    isLoading,
    isSubmitButtonEnabled,
    checkEmail,
    checkPassword,
    handleKeypressAfterIncorrectCredentials,
    onSubmit,
  }
}
