<template>
  <div class="page-content">
    <PImage
      pType="paupulse"
      pName="password"
      class="badge-lock hidden-md-and-up"
    />
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
        />
      </PFormItem>
      <PFormItem>
        <PButton
          pType="primary"
          @click="handleSubmit(formRef)"
          :pDisabled="!isFormValid"
          :pLoading="isLoading"
          class="reset-submit-button"
        >
          {{ t('submitBtn') }}
        </PButton>
      </PFormItem>
      <PFormItem>
        <PButton
          pType="white"
          @click="router.push({ name: 'loginClient' })"
          class="back-to-login-button"
        >
          {{ t('backToLogin') }}
        </PButton>
      </PFormItem>
    </PForm>
  </div>
</template>

<!-- eslint-disable max-len -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive, computed, ref, toRaw } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import { commonApi } from '@kpmg/common'
import { PImage, PForm, PFormItem, PInput, PButton } from '@kpmg/styleguide'

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
  if (!formEl) return
  if (formEl.validate) {
    try {
      await formEl.validate()
    } catch (error) {
      return false
    }
  }
  try {
    isLoading.value = true
    await commonApi().gateway.post('authentication/api/sendResetPasswordLink', toRaw(formValues))
    isLoading.value = false
    router.push({
      path: '/resetPasswordSuccess',
      query: {
        email: formValues.email || '',
      },
    })
  } catch (error: any) {
    const invalidResponse = error.message
    if (invalidResponse) {
      hasCustomerError.value = true
    }
    return false
  }
}

</script>
<!-- eslint-enable max-len -->

<style lang="scss" scoped>
.page-content {
  display: block;
  flex-direction: column;
  height: 100%;
  @media (min-width: 992px) {
    padding: 0 0 48px 0;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  text-align: left;
  justify-content: space-evenly;
  gap: 24px;

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
    email: 'Email'
    submitBtn: 'Reset my password'
    forgotPasswordTitle: 'Forgot your password ?'
    resetPasswordMsg: 'We will send you an email to reset it.'
    emailPlaceholder: 'Enter your email'
    backToLogin: 'Back to login'
    alertMailRequired: 'Please enter your mail'
    alertMailInvalid: 'Please enter a valid mail'
  fr-FR:
    email: 'Email'
    submitBtn: 'Réinitialiser mon mot de passe'
    forgotPasswordTitle: 'Vous avez oublié votre mot de passe ?'
    resetPasswordMsg: 'Pas de panique, nous allons vous envoyer un mail pour le réinitialiser.'
    emailPlaceholder: 'Saisir votre email'
    backToLogin: 'Revenir à la connexion'
    alertMailRequired: 'Veuillez saisir votre email'
    alertMailInvalid: 'Veuillez saisir un email valide'
</i18n>
