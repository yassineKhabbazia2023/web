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
        ref="formRef"
        class="form-password"
        pHideRequiredAsterisk
        :pRules="rules"
        :pModel="formValue"
      >
        <PasswordFields
          ref="passwordFieldsRef"
          v-model:newPassword="formValue.newPassword"
          v-model:confirmPassword="formValue.confirmPassword"
          :requireCurrentPassword="false"
          :disabled="isLoading"
          :isPasswordStrengthGaugeVisible="false"
        />
        <p>
          {{ t('validCgu') }}
        </p>
        <PFormItem
          pProp="terms"
          pRequired
        >
          <PCheckbox
            ref="checkbox"
            v-model="formValue.terms"
            class="
              cgu-checkbox
              font-base
              font-normal
              padding--3
              bg--neutral-gray-50
            "
            data-testid="create-password-terms-checkbox"
          >
            {{ t('cguMessagePartOne') }}
            <a
              :href="urlTerms"
              target="_blank"
              class="cgu-link font-bold text-color--black-rock-700"
            >
              {{ t('cguLink') }}
            </a>
            {{ t('cguMessagePartTwo') }}
          </PCheckbox>
        </PFormItem>
        <PFormItem>
          <PButton
            pType="primary"
            :pDisabled="!isValidForm || isLoading"
            :pLoading="isLoading"
            pSize="default"
            class="btn-submit"
            data-testid="create-password-submit-button"
            @click="submitForm(formRef)"
          >
            {{ t('btnSubmit') }}
          </PButton>
        </PFormItem>
      </PForm>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { logger } from '@pulse/toolbox'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { FormRules, FormInstance } from '@pulse/styleguide/types'
import { createNewPassword } from '@pulse/common/services/authentication'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { BackEndErrors } from '@pulse/common/constants'
import { LoginService } from '@pulse/common/services/login'
import { RouteName } from '@pulse/common/enums'
import {
  reactive,
  ref,
  computed,
  onMounted,
} from 'vue'
import {
  PForm,
  PFormItem,
  PCheckbox,
  PButton,
} from '@pulse/styleguide/components'
import {
  PasswordFields,
  createNewPasswordValidator,
  createConfirmPasswordValidator,
} from '@pulse/shared/components'
import type {
  PasswordFieldsExposed,
  PasswordValidationTranslations,
} from '@pulse/shared/types'
import { fetchUrlTerms, getLatestTerms, updateTermsByCurrentUser } from '@pulse/common/services/cgu'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      createAccount: 'Create your account ',
      '1step': 'in 1 step.',
      defPassword: 'Please enter and confirm your new password',
      validCgu: 'Please valid the General Terms and Conditions of use',
      cguMessagePartOne: 'By checking this box, I confirm that I have read and accepted the ',
      cguLink: 'general terms and conditions of use ',
      cguMessagePartTwo: 'of RYDGE Conseil.',
      alertCgu: 'Please accept the general terms and conditions of use',
      btnSubmit: 'Activate my account',
      currentPasswordRequired: 'Current password is required',
      newPasswordRequired: 'New password is required',
      newPasswordWeak: 'Password must contain at least 8 characters with uppercase, lowercase, number and special character',
      confirmPasswordRequired: 'Password confirmation is required',
      confirmPasswordMismatch: 'Passwords do not match',
    },
    'fr-FR': {
      createAccount: 'Créez votre compte',
      '1step': 'en une étape.',
      defPassword: 'Veuillez définir votre mot de passe et le confirmer.',
      validCgu: 'Validez les conditions générales d\'utilisation.',
      cguMessagePartOne: 'En cochant cette case, je confirme avoir lu et accepté les',
      cguLink: 'conditions générales d\'utilisation ',
      cguMessagePartTwo: 'de RYDGE Conseil.',
      alertCgu: 'Veuillez accepter les conditions générales d\'utilisation',
      btnSubmit: 'Activer mon compte',
      currentPasswordRequired: 'Le mot de passe actuel est requis',
      newPasswordRequired: 'Le nouveau mot de passe est requis',
      newPasswordWeak: 'Le mot de passe doit contenir au moins 8 caractères avec majuscule, minuscule, chiffre et caractère spécial',
      confirmPasswordRequired: 'La confirmation du mot de passe est requise',
      confirmPasswordMismatch: 'Les mots de passe ne correspondent pas',
    },
  },
})

const route = useRoute()
const router = useRouter()
const { contactId, accountNumber, token, email: emailQuery } = route.query as {
  contactId: string
  accountNumber: string
  token: string
  email: string
}

const email = emailQuery?.toString().trim().replace(' ', '+')
const formRef = ref<FormInstance>()
const passwordFieldsRef = ref<PasswordFieldsExposed>()
const urlTerms = ref('')
const isLoading = ref(false)
const termsId = ref<null | number>(null)
const formValidity = reactive({
  terms: false,
})
const formValue = reactive({
  newPassword: '',
  confirmPassword: '',
  terms: false,
})

const isValidForm = computed(() => {
  return formValidity.terms &&
         formValue.newPassword !== '' &&
         formValue.confirmPassword !== ''
})

// Password validation
const passwordTranslations: PasswordValidationTranslations = {
  currentPasswordRequired: t('currentPasswordRequired'),
  newPasswordRequired: t('newPasswordRequired'),
  newPasswordWeak: t('newPasswordWeak'),
  confirmPasswordRequired: t('confirmPasswordRequired'),
  confirmPasswordMismatch: t('confirmPasswordMismatch'),
}

const validateNewPassword = createNewPasswordValidator(passwordTranslations)
const validateConfirmPassword = createConfirmPasswordValidator(
  passwordTranslations,
  () => formValue.newPassword,
)

const validateTerm = (_rule: any, value: any, callback: any) => {
  formValidity.terms = !!value
  if (!value) {
    callback(new Error(t('alertCgu')))
  } else {
    callback()
  }
}

const rules = reactive<FormRules<typeof formValue>>({
  newPassword: [{ trigger: 'blur', validator: validateNewPassword }],
  confirmPassword: [{ trigger: 'blur', validator: validateConfirmPassword }],
  terms: [{ trigger: 'change', validator: validateTerm }],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (formEl === undefined || email === undefined || email.trim() === '') {
    return
  }

  // Validate entire form (includes passwords and terms)
  try {
    await formEl.validate()
  } catch (error) {
    logger.error(error)
    return
  }

  // Validation passed - proceed with submission
  const data = {
    token,
    newPassword: formValue.newPassword,
    contactId,
  }
  try {
    isLoading.value = true
    await createNewPassword(data)
    await LoginService.authenticate(email, formValue.newPassword)
    await updateTermsByCurrentUser(termsId.value as number)
    AmplitudeService.track('Onboarding Completed', {
      onboarding_result: 'succeeded',
    })
    router.push({ name: RouteName.LANDING })
  } catch (error: any) {
    AmplitudeService.track('Onboarding Completed', {
      onboarding_result: 'failed',
    })
    const { data } = error?.response ?? {}

    if (data?.errorCode === BackEndErrors.TOKEN_EXPIRED) {
      router.push({ name: RouteName.EXPIRE_TOKEN, query: { contactId, accountNumber } })
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(async () => {
  AmplitudeService.reset()
  AmplitudeService.track('Onboarding Email Accepted', {
    onboarding_email_click: '',
  })
  try {
    urlTerms.value = await fetchUrlTerms()
    const data = await getLatestTerms()
    termsId.value = data.termsId
  } catch (error) {
    logger.error(error)
  }
})

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
      color: var(--p-jungle-400);
    }
    margin-bottom: 24px;
    margin-top: 14px;
  }
  .cgu-checkbox {
    margin-top: 18px;
    white-space: pre-wrap;
    height: auto;
    width: 100%;
    align-items: start;

    .cgu-link {
      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
  }
  .form-password {
    margin-top: 18px;
  }
  .btn-submit {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>

