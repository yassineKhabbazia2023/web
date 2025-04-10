<template>
  <div class="page-content">
    <p class="forgot-password-title">
      {{ t('forgotPasswordTitle') }}
    </p>
    <p class="reset-password-msg">
      {{ t('resetPasswordMsg') }}
    </p>
    <PForm
      ref="formRef"
      :pRules="rules"
      :pModel="formValues"
      pLabelPosition="top"
      pRequireAsteriskPosition="right"
      @submit.prevent="handleSubmit"
    >
      <PFormItem
        :pLabel="t('email')"
        pProp="email"
        pRequired
      >
        <PInput
          v-model="formValues.email"
          :class="{ 'error': hasCustomerError }"
          pType="email"
          pName="email"
          pAutocomplete="on"
          pAutofocus
          :pPlaceholder="t('emailPlaceholder')"
          data-testid="reset-password-input-email"
        />
      </PFormItem>
      <PFormItem>
        <PButton
          pType="primary"
          :pDisabled="!isFormValid || isLoading"
          :pLoading="isLoading"
          class="reset-submit-button"
          data-testid="reset-password-submit-button"
          @click="handleSubmit(formRef)"
        >
          {{ t('submitBtn') }}
        </PButton>
      </PFormItem>
      <PFormItem>
        <PButton
          pType="white"
          class="back-to-login-button"
          data-testid="reset-password-back-to-login-button"
          @click="router.push({ name: LoginRouteName.LOGIN_CLIENT })"
        >
          {{ t('backToLogin') }}
        </PButton>
      </PFormItem>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive, computed, ref, toRaw } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { commonApi } from '@pulse/common'
import { PForm, PFormItem, PInput, PButton } from '@pulse/styleguide/components'
import { PNotification } from '@pulse/styleguide'
import { LoginRouteName, HTTP_ERRORS } from '@pulse/common/constants'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const formRef = ref<FormInstance>()
const hasCustomerError = ref(false)
const isLoading = ref()
const router = useRouter()

const formValues = reactive({
  email: '',
})

const formValidity: any = reactive({
  email: false,
})

const validateEmail = (_rule: any, value: any, callback: any) => {
  if (!value) {
    formValidity.email = false
    callback(new Error(t('alertMailRequired')))
  } else {
    // eslint-disable-next-line
    const emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,24}))$/
    if (emailValidator.test(value)) {
      formValidity.email = true
      callback()
    } else {
      formValidity.email = false
      callback(new Error(t('alertMailInvalid')))
    }
  }
}

const isFormValid = computed(() =>
  formValidity.email,
)

const rules = reactive<FormRules<typeof formValues>>({
  email: [{ trigger: ['blur', 'change'], validator: validateEmail }],
})

const handleSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) {
    return
  }
  if (formEl.validate) {
    try {
      await formEl.validate()
    } catch {
      return false
    }
  }
  try {
    isLoading.value = true
    await commonApi().gateway.post('authentication/api/sendResetPasswordLink', toRaw(formValues))
    router.push({
      path: `/${LoginRouteName.RESET_PASSWORD_SUCCESS}`,
      query: {
        email: formValues.email || '',
      },
    })
  } catch (error: any) {
    if(error.status === HTTP_ERRORS.TOO_MANY_REQUESTS) {
      router.push({
        path: `/${LoginRouteName.RESET_PASSWORD_FAILED}`,
        query: {
          maxAttempts: error.response.data.maxAttempts,
        },
      })
    } else {
      PNotification({
        message: t('technicalError'),
        iconName: 'exclamationTriangle',
        showClose: true,
        customClass: 'error',
        position: 'bottom-right',
      })
      if (error.message) {
        hasCustomerError.value = true
      }
    }
  } finally {
    isLoading.value = false
  }
}

defineExpose({ handleSubmit })
</script>

<style lang="scss" scoped>
.page-content {
  display: block;
  flex-direction: column;
  height: 100%;
  text-align: left;
  justify-content: space-evenly;
  gap: 24px;

  @media (min-width: 992px) {
    padding: 48px 0 0 0;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .forgot-password-title {
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    margin: 15px 0;
  }

  .reset-password-msg {
    margin: 15px 0;
  }

  .btn-link {
    width: 100%;
  }

  .badge-lock {
    max-width: 200px;
    margin: 12px auto;
    display: block;
  }

  .reset-submit-button,
  .back-to-login-button {
    width: 100%;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    email: 'E-mail address'
    submitBtn: 'Send the reset link'
    forgotPasswordTitle: 'Forgot your password ?'
    resetPasswordMsg: >
      Please enter the email address associated with your account,
      we will send you a link to reset your password.
    emailPlaceholder: 'Enter your e-mail address'
    backToLogin: 'Back to login'
    alertMailRequired: 'Please enter your e-mail address'
    alertMailInvalid: 'Please enter a valid e-mail address'
    technicalError: 'The operation failed due to a technical error. Please try again later.'
  fr-FR:
    email: 'Adresse e-mail'
    submitBtn: 'Envoyer le lien de réinitialisation'
    forgotPasswordTitle: 'Vous avez oublié votre mot de passe ?'
    resetPasswordMsg: >
      Veuillez entrer l'adresse e-mail associée à votre compte,
      nous vous enverrons un lien pour réinitialiser votre mot de passe.
    emailPlaceholder: 'Saisissez votre adresse e-mail'
    backToLogin: 'Revenir à la connexion'
    alertMailRequired: 'Veuillez saisir votre adresse e-mail'
    alertMailInvalid: 'Veuillez saisir une adresse e-mail valide'
    technicalError: 'L’opération a échoué suite à une erreur technique. Veuillez réessayer plus tard.'
</i18n>
