<template>
  <div class="wrapperLogin text-left margin-top--11">
    <h4 class="title font--bold">
      {{ t('welcomeTo') }}<br>
      <span class="title__second-part"> {{ t('yourSpace') }}</span>
    </h4>
    <p class="formTitle margin-top--2 margin-bottom--6">
      {{ t('formTitle') }}
    </p>

    <PForm
      pRequireAsteriskPosition="right"
      pLabelPosition="top"
      @submit.prevent="onSubmit"
    >
      <PFormItem
        :pLabel="t('email')"
        :pError="emailError"
        :pShowMessage="isEmailMessageVisible"
      >
        <PInput
          v-model="email"
          :pPlaceholder="t('emailPlaceholder')"
          :pDisabled="isLoading"
          pType="email"
          pAutocomplete="on"
          pAutofocus
          data-testid="login-input-email"
          @blur="checkEmail"
        />
      </PFormItem>
      <PFormItem
        :pLabel="t('password')"
        :pError="passwordError"
        :pShowMessage="isPasswordMessageVisible"
        pRequired
      >
        <PInput
          v-model="password"
          :pPlaceholder="t('passwordPlaceholder')"
          :pDisabled="isLoading"
          pType="password"
          pShowPassword
          data-testid="login-input-password"
          @blur="checkPassword"
        />
      </PFormItem>
      <router-link
        to="/resetPassword"
        class="forgot-password-btn font-semibold text-right"
      >
        {{ t('forgotPassword') }}
      </router-link>
      <PFormItem>
        <div class="margin-x--auto margin-top--6">
          <PSkewedButton
            :pContent="submitButtonContent"
            :pDisabled="!isSubmitButtonEnabled"
            :pHasLoader="isLoading"
            data-testid="login-submit-button"
            @click="onSubmit"
          />
        </div>
      </PFormItem>
    </PForm>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { VITE_GIGYA_SSO_ACTIVATED } from 'env-vars'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { logger } from '@pulse/core'
import { amplitudeService, login } from '@pulse/common'
import { PForm, PFormItem, PInput, PSkewedButton } from '@pulse/styleguide/components'
import useInitUserAuth from '@login/composable/useInitUserAuth'
import useNavigation from '@login/composable/useNavigation'
import { getTermsByCurrentUser } from '@pulse/common/services/cgu'
import { LoginRouteName, BackEndErrors } from '@pulse/common/constants'
import { getEmailError, getPasswordError } from './LoginClient.utils'
import { CurrentUserManager } from '@pulse/common/managers'

declare let window: {
  gigya: any
} & Window

const { initAuthClient, setStoreGigyaUserId } = useInitUserAuth()
const { navigateToCustomerWallet } = useNavigation()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const router = useRouter()

const email = ref('')
const password = ref('')

const emailError = ref('')
const isEmailMessageVisible = ref(true)
const passwordError = ref('')
const isPasswordMessageVisible = ref(true)

const isLoading = ref(false)

const isSubmitButtonEnabled = computed(() => {
  if (isLoading.value) {
    return false
  }
  return isValidForm.value
})

const submitButtonContent = computed(() => isLoading.value ? t('loading') : t('login'))

function getIsValidForm() {
  return emailError.value === '' && passwordError.value === ''
}
const isValidForm = computed(() => getIsValidForm())

function setEmailError(message: string, showMessage = true) {
  emailError.value = message
  isEmailMessageVisible.value = showMessage
}

function setPasswordError(message: string, showMessage = true) {
  passwordError.value = message
  isPasswordMessageVisible.value = showMessage
}

function checkPassword() {
  const confirmPasswordErrorMessage = getPasswordError(
    password.value,
    t('alertPasswordRequired'),
  )
  setPasswordError(confirmPasswordErrorMessage)
}

function checkEmail() {
  const confirmPasswordErrorMessage = getEmailError(
    email.value,
    t('alertMailRequired'),
    t('alertMailInvalid'),
  )
  setEmailError(confirmPasswordErrorMessage)
}

function checkValidity() {
  checkEmail()
  checkPassword()

  return getIsValidForm()
}

async function onSubmit() {
  const isValid = checkValidity()
  if (!isValid) {
    return false
  }
  isLoading.value = true

  try {
    amplitudeService.setNewUserProperty('user_type', 'Client')

    // Authentication
    const payload = {
      email: email.value,
      password: password.value,
    }
    const {
      webToken: token,
      userId,
    } = await login(payload)
    if (!token) {
      throw new Error('No token received')
    }

    CurrentUserManager.persistToken(token)

    // Set currentuser data
    await initAuthClient()
    setStoreGigyaUserId(userId)

    // Activate Gigya SSO
    if(VITE_GIGYA_SSO_ACTIVATED === 'true'){
      try {
        window.gigya.accounts.login({
          loginID: email.value,
          password: password.value,
        })
      } catch (error) {
        logger.error('Error during Gigya SSO login: ', error)
      }
    }

    // Get currentuser terms
    const { isCurrent, terms } = await getTermsByCurrentUser()

    amplitudeService.track('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'succeeded',
    })

    if (isCurrent) {
      return navigateToCustomerWallet()
    }
    router.push({ name: LoginRouteName.CGU_VALIDATION, params: { termsId: terms.termsId } })
  } catch (error: any) {
    isLoading.value = false
    const invalidLoginErrorCodes = [
      BackEndErrors.WRONG_LOGIN_PASSWORD,
      BackEndErrors.INVALID_LOGIN_CREDENTIALS,
    ]
    const hasEmailOrPasswordInvalid = invalidLoginErrorCodes.includes(error.response?.data?.errorCode)
    const errorMessage = hasEmailOrPasswordInvalid
      ? t('emailOrPasswordError')
      : t('technicalError')
    setEmailError(errorMessage, false)
    setPasswordError(errorMessage)

    amplitudeService.track('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    return false
  }
}

onMounted(() => {
  amplitudeService.reset()
})
</script>

<style lang="scss" scoped>
.title {
  font-size: 3.2rem;

  &__second-part {
    color: var(--el-color-primary);
  }
}
.formTitle {
  font-size: 1.6rem;
}

.forgot-password-btn {
  display: block;
  color: var(--el-color-primary);
  font-size: 12px;

  &:hover {
    color: var(--el-color-primary-dark-2);
  }
}
</style>

<i18n lang="yaml">
  en-US:
    welcomeTo: 'Welcome to your'
    yourSpace: 'Customer Space!'
    formTitle: 'Please login to access all your services.'
    email: 'E-mail address'
    emailPlaceholder: 'Enter your e-mail address'
    password: 'Password'
    passwordPlaceholder: 'Enter your password'
    login: 'Log in'
    loading: 'Loading...'
    emailOrPasswordError: 'The e-mail address and password combination is incorrect'
    technicalError: 'A technical error occurred.'
    forgotPassword: 'Forgot your password?'
    alertPasswordRequired: 'Please enter your password'
    alertMailRequired: 'Please enter your e-mail address'
    alertMailInvalid: 'Please enter a valid e-mail address'
  fr-FR:
    welcomeTo: 'Bienvenue sur votre'
    yourSpace: 'espace client !'
    formTitle: 'Veuillez vous connecter pour accéder à tous vos services.'
    email: 'Adresse e-mail'
    emailPlaceholder: 'Saisissez votre adresse e-mail'
    password: 'Mot de passe'
    passwordPlaceholder: 'Saisissez votre mot de passe'
    login: 'Se connecter'
    loading: 'Chargement en cours'
    emailOrPasswordError: "La combinaison de l'adresse e-mail et du mot de passe est incorrecte"
    technicalError: 'Une erreur technique est survenue.'
    forgotPassword: 'Mot de passe oublié ?'
    alertPasswordRequired: 'Veuillez saisir votre mot de passe'
    alertMailRequired: 'Veuillez saisir votre adresse e-mail'
    alertMailInvalid: 'Veuillez saisir une adresse e-mail valide'
</i18n>
