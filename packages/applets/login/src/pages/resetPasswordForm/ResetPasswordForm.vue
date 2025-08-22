<template>
  <div
    class="page-content flex flex--direction-column flex--align-items-center margin-y--4"
  >
    <div>
      <p class="txt-create-account">
        {{ t('createAccount') }}
        <span class="purple-text">
          {{ t('1step') }}
        </span>
      </p>
      <p>
        {{ t('defPassword') }}
      </p>
      <PForm
        class="form-password"
        pLabelPosition="top"
        pHideRequiredAsterisk
      >
        <PFormItem
          :pLabel="t('labelPassword')"
          :pError="passwordError"
          :pShowMessage="isPasswordMessageVisible"
        >
          <PInput
            v-model="password"
            :pPlaceholder="t('placeholderPassword')"
            pType="password"
            pShowPassword
            data-testid="reset-password-form-first-password"
            @update:model-value="checkPassword"
            @blur="checkPassword"
          />
          <PStrength
            v-if="password"
            class="margin-top--3 min-width--full"
            :modelValue="passwordStrength"
            :labels="strengthLabels"
          />
        </PFormItem>
        <PFormItem
          :pLabel="t('labelConfirmPassword')"
          :pError="confirmPasswordError"
          :pShowMessage="isConfirmPasswordMessageVisible"
        >
          <PInput
            v-model="confirmPassword"
            :pPlaceholder="t('placeholderConfirmPassword')"
            pType="password"
            pShowPassword
            data-testid="reset-password-form-second-password"
            @update:model-value="checkConfirmPassword"
            @blur="checkConfirmPassword"
          />
        </PFormItem>
        <PFormItem>
          <PButton
            pType="primary"
            :pDisabled="!isValidForm || isLoading"
            :pLoading="isLoading"
            pSize="default"
            class="btn-submit"
            @click="submitForm"
          >
            {{ t('btnSubmit') }}
          </PButton>
        </PFormItem>
      </PForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { logger } from '@pulse/core'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { createNewPassword } from '@pulse/common'
import { APP_ROUTES, BackEndErrors } from '@pulse/common/constants'
import {
  ref,
  computed,
} from 'vue'
import {
  PForm,
  PFormItem,
  PInput,
  PButton,
  PStrength,
} from '@pulse/styleguide/components'
import type { PStrengthLevel } from '@pulse/styleguide/types'
import { getPasswordError, getConfirmPasswordError, getApiErrorMessage } from './ResetPasswordForm.utils'
import { getPasswordStrength } from '../../utils/passwordStrength/passwordStrength.utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
const route = useRoute()
const router = useRouter()
const { contactEmail, token } = route.query as {
  contactEmail: string
  token: string
}

const password = ref('')
const confirmPassword = ref('')

const passwordError = ref('')
const isPasswordMessageVisible = ref(true)
const confirmPasswordError = ref('')
const isConfirmPasswordMessageVisible = ref(true)
const isLoading = ref(false)

const strengthLabels: Record<PStrengthLevel, string> = {
  0: t('passwordStrengthLabels.level-0'),
  1: t('passwordStrengthLabels.level-1'),
  2: t('passwordStrengthLabels.level-2'),
  3: t('passwordStrengthLabels.level-3'),
  4: t('passwordStrengthLabels.level-4'),
}

function setPasswordError(message: string, showMessage = true) {
  passwordError.value = message
  isPasswordMessageVisible.value = showMessage
}

function setConfirmPasswordError(message: string, showMessage = true) {
  confirmPasswordError.value = message
  isConfirmPasswordMessageVisible.value = showMessage
}

function getIsValidForm() {
  return passwordError.value === '' && confirmPasswordError.value === ''
}
const isValidForm = computed(() => getIsValidForm())
const passwordStrength = ref<PStrengthLevel>(0)

function checkPassword() {
  passwordStrength.value = getPasswordStrength(password.value)
  const passwordErrorMessage = getPasswordError(
    password.value,
    passwordStrength.value,
    t('alertPasswordRequired'),
    t('alertPasswordLevelLow'),
  )
  const showMessage = password.value === '' // show message only if password is empty
  setPasswordError(passwordErrorMessage, showMessage)
}

function checkConfirmPassword() {
  const confirmPasswordErrorMessage = getConfirmPasswordError(
    confirmPassword.value,
    password.value,
    t('alertConfirmPass'),
    t('alertPasswordNotMatch'),
  )
  setConfirmPasswordError(confirmPasswordErrorMessage)
}

function checkValidity() {
  checkPassword()
  checkConfirmPassword()

  return getIsValidForm()
}

const apiErrorMessages: Record<BackEndErrors, string> = {
  [BackEndErrors.ALREADY_USED_PASSWORD]: t('isPasswordAlreadyUsed'),
  [BackEndErrors.WRONG_LOGIN_PASSWORD]: '', // should centralize error messages
  [BackEndErrors.INVALID_LOGIN_CREDENTIALS]: '',
  [BackEndErrors.TOKEN_EXPIRED]: '',
  [BackEndErrors.other]: t('technicalError'),
}

const submitForm = async () => {
  const isValid = checkValidity()
  if (!isValid) {
    return false
  }

  const data = {
    newPassword: password.value,
    token,
    isCreatePasswordAction: false,
  }
  try {
    isLoading.value = true
    await createNewPassword(data)
    router.push({ name: APP_ROUTES.login.client.name })
  } catch (error: any) {
    logger.error(error)
    const { data } = error?.response ?? {}
    if (data.errorCode === BackEndErrors.TOKEN_EXPIRED) {
      router.push({ name: APP_ROUTES.login.expireToken.name, query: { contactEmail } })
    }
    const errorMessage = getApiErrorMessage(
      data,
      apiErrorMessages,
    )
    setPasswordError(errorMessage, false)
    setConfirmPasswordError(errorMessage)
  } finally {
    isLoading.value = false
  }
}
defineExpose({ submitForm })
</script>

<style lang="scss" scoped>
.page-content {
  $self: &;
  text-align: start;

  &.center {
    height: calc(100% - 180px);
    justify-content: center;
  }

  .txt-create-account {
    font-size: 21px;
    font-weight: 600;
    line-height: 25px;

    .purple-text {
      color: var(--el-color-persian-500);
    }

    margin-bottom: 24px;
    margin-top: 14px;
  }

  .form-password {
    margin-top: 18px;
  }

  .btn-submit {
    width: 100%;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    createAccount: 'Your '
    1step: 'new password.'
    defPassword: 'Please enter and confirm your new password'
    labelPassword: 'New password'
    labelConfirmPassword: 'Password confirmation'
    placeholderPassword: 'Enter your new password'
    placeholderConfirmPassword: 'Enter your new password'
    alertConfirmPass: 'Please confirm the password'
    alertPasswordNotMatch: "The passwords are different"
    alertPasswordRequired: 'Please enter the password'
    alertPasswordLevelLow: 'Your password is not valid'
    btnSubmit: 'Submit'
    isPasswordAlreadyUsed: You have already used this password before.
    technicalError: A technical error occurred
    passwordStrengthLabels:
      level-0: ''
      level-1: 'Weak'
      level-2: 'Poor'
      level-3: 'Medium'
      level-4: 'Strong'
  fr-FR:
    createAccount: 'Votre '
    1step: 'nouveau mot de passe.'
    defPassword: 'Veuillez définir votre mot de passe et le confirmer.'
    labelPassword: 'Nouveau mot de passe'
    labelConfirmPassword: 'Confirmation du mot de passe'
    placeholderPassword: 'Saisissez votre nouveau mot de passe'
    placeholderConfirmPassword: 'Saisissez votre nouveau mot de passe'
    alertConfirmPass: 'Veuillez confirmer votre nouveau mot de passe'
    alertPasswordNotMatch: 'Les mots de passe sont différents'
    alertPasswordRequired: 'Veuillez saisir votre nouveau mot de passe'
    alertPasswordLevelLow: "Votre mot de passe n'est pas valide"
    btnSubmit: 'Valider'
    isPasswordAlreadyUsed: Vous avez déjà utilisé ce mot de passé précédemment.
    technicalError: Une erreur technique est survenue
    passwordStrengthLabels:
      level-0: ''
      level-1: 'Faible'
      level-2: 'Insuffisant'
      level-3: 'Moyen'
      level-4: 'Fort'
</i18n>
