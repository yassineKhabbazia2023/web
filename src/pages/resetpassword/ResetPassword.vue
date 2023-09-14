<template>
  <div class="page-content">
    <PImage
      type="badges"
      name="lock"
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
      :rules="rules"
      :model="formValues"
      labelPosition="top"
      requireAsteriskPosition="right"
      @submit.prevent="handleSubmit"
      @validate="validateHandler"
    >
      <PFormItem
        :label="t('email')"
        prop="email"
        required
      >
        <PInput
          v-model="formValues.email"
          :class="{ 'error': hasCustomerError }"
          type="email"
          name="email"
          autocomplete="on"
          autofocus
          :placeholder="t('emailPlaceholder')"
        />
      </PFormItem>
      <PFormItem>
        <PButton
          type="primary"
          @click="handleSubmit(formRef)"
          :disabled="!isFormValid"
          :loading="isLoading"
          class="reset-submit-button"
        >
          {{ t('submitBtn') }}
        </PButton>
      </PFormItem>
      <PFormItem>
        <PButton
          type="white"
          @click="router.push({ name: 'login' })"
          class="back-to-login-button"
        >
          {{ t('backToLogin') }}
        </PButton>
      </PFormItem>
    </PForm>
  </div>
</template>

<!-- eslint-disable max-len -->
<i18n lang="yaml">
  en-US:
    email: 'Email'
    submitBtn: 'Reset my password'
    forgotPasswordTitle: 'Forgot your password ?'
    resetPasswordMsg: 'We will send you an email to reset it.'
    emailPlaceholder: 'Enter your email'
    backToLogin: 'Back to login'
  fr-FR:
    email: 'Email'
    submitBtn: 'Réinitialiser mon mot de passe'
    forgotPasswordTitle: 'Vous avez oublié votre mot de passe ?'
    resetPasswordMsg: 'Pas de panique, nous allons vous envoyer un mail pour le réinitialiser.'
    emailPlaceholder: 'Saisir votre email'
    backToLogin: 'Revenir à la connexion'
</i18n>
<!-- eslint-enable max-len -->

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { reactive, computed, ref, toRaw } from 'vue'
import { type FormRules, FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { commonApi } from '@kpmg/common'
import { PImage, PForm, PFormItem, PInput, PButton } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const formRef = ref<FormInstance>()
const hasCustomerError = ref(false)
const isLoading = ref()
const router = useRouter()

const formValues = reactive({
  email: ''
})

const formValidity: any = reactive({
  email: false
})

const isFormValid = computed(() =>
  formValidity.email
)

const validateHandler = (propName: string, isValid: boolean) => {
  formValidity[propName] = isValid
}

const rules = reactive<FormRules<typeof formValues>>({
  email: [{ trigger: 'blur', type: 'email' }]
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
    await commonApi().auth.post('sendResetPasswordLink', toRaw(formValues))
    isLoading.value = false
    router.push({
      path: '/resetpasswordsuccess',
      query: {
        email: formValues.email || ''
      }
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
    line-height: 19.2px;
    margin: 15px 0;
  }

  .reset-password-msg {
    margin: 15px 0;
  }

  .btn-link {
    width: 100%;
  }

  .badge-lock {
    max-width: 105px;
    margin: 12px auto;
    display: block;
  }

  .reset-submit-button,
  .back-to-login-button {
    width: 100%;
  }
}
</style>
