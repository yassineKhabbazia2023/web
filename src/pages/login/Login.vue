<template>
  <div class="wrapperLogin text-left">
    <h4 class="title">
      {{ t('welcomeTo') }}
      <span class="blue"> {{ t('yourPulseSpace') }}</span>
    </h4>
    <p class="formTitle">
      {{ t('formTitle') }}
    </p>
    <div
      v-if="hasCustomError"
      class="customError"
    >
      <div class="el-form-item__content">
        <p class="el-form-item__error">
          {{ t('error') }}
        </p>
      </div>
    </div>

    <PForm
      ref="formRef"
      :rules="rules"
      :model="formValues"
      requireAsteriskPosition="right"
      labelPosition="top"
      @submit.prevent="handleSubmit"
      class="el-login-form"
    >
      <PFormItem
        :label="t('email')"
        required
        prop="email"
      >
        <PInput
          v-model="formValues.email"
          :class="{ 'error': hasCustomError }"
          :placeholder="t('emailPlaceholder')"
          type="email"
          name="email"
          autocomplete="on"
          autofocus
        />
      </PFormItem>
      <PFormItem
        :label="t('password')"
        required
        prop="password"
      >
        <PInput
          v-model="formValues.password"
          :class="{ 'error': hasCustomError }"
          :placeholder="t('passwordPlaceholder')"
          type="password"
          showPassword
        />
      </PFormItem>
      <router-link
        to="/resetPassword"
        class="forgot-password-btn font-semibold"
      >
        {{ t('forgotPassword') }}
      </router-link>
      <PFormItem class="button-wrapper">
        <PButton
          @click="handleSubmit(formRef)"
          :disabled="!isFormValid"
          type="primary"
          class="buttonSubmit"
        >
          {{ t('login')}}
        </PButton>
      </PFormItem>
    </PForm>
  </div>
</template>
<script setup lang="ts">
import { computed, reactive, ref, toRaw } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { commonApi, commonStore as store } from '@kpmg/common'
import { useRouter } from 'vue-router'
import { PForm, PFormItem, PInput, PButton } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
const router = useRouter()

const formRef = ref<FormInstance>()

const formValues = reactive({
  email: '',
  password: ''
})

const formValidity: any = reactive({
  email: false,
  password: false
})

const isFormValid = computed(() =>
  formValidity.email && formValidity.password
)

const hasCustomError = ref(false)

const validatePassword = (_rule: any, value: any, callback: any) => {
  if (!value) {
    formValidity.password = false
    callback(new Error(t('alertPasswordRequired')))
  } else {
    formValidity.password = true
    callback()
  }
}

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

const rules = reactive<FormRules<typeof formValues>>({
  email: [{ trigger: 'blur', validator: validateEmail }],
  password: [{ trigger: 'blur', validator: validatePassword }]
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
    const {
      data: {
        userId: id,
        webToken: token
      }
    } = await commonApi().auth.post('login', toRaw(formValues))
    sessionStorage.setItem('token', token)
    store().$patch({
      user: {
        id,
        token,
        isCollab: false
      }
    })

    // temporarily redirect to /entities
    router.push({ name: 'entities' })
  } catch (error: any) {
    const hasEmailOrPasswordInvalid = error.response?.data?.anomaly?.errorCode === '403042'
    if (hasEmailOrPasswordInvalid) {
      hasCustomError.value = true
    }
    return false
  }
}
</script>

<style lang="scss">
.wrapperLogin .error .el-input__wrapper {
  box-shadow: 0 0 0 1px var(--el-color-danger) inset;
}
</style>

<style lang="scss" scoped>
.title {
  margin-bottom: 24px;
}
.blue {
  color: var(--el-color-base-persian);
}
.formTitle {
  font-size: 1.6rem;
  margin-bottom: 18px;
}
.customError {
  padding-bottom: 18px;

  .el-form-item__error {
    position: inherit;
    padding-top: 0;
  }
}

.button-wrapper {
  padding-top: 6px;
  margin-bottom: 0;
}
.buttonSubmit {
  width: 100%;
}

.forgot-password-btn {
  height: 30px;
  display: block;
  color: var(--el-color-primary);
  font-size: 12px;

  &:hover {
    color: var(--el-color-primary-dark-2);
  }
}

.el-login-form {
  margin-bottom: 30px;
}
</style>

<i18n lang="yaml">
  en-US:
    welcomeTo: 'Welcome to'
    yourPulseSpace: 'your Pulse Space!'
    formTitle: 'Please login to access all your services.'
    email: 'Email'
    emailPlaceholder: 'Enter your email address'
    password: 'Password'
    passwordPlaceholder: 'Enter your password'
    login: 'Log in'
    error: 'The email and password combination is incorrect.'
    forgotPassword: 'Forgot your password?'
    alertPasswordRequired: 'Please enter your password'
    alertMailRequired: 'Please enter your mail'
    alertMailInvalid: 'Please enter a valid mail'
  fr-FR:
    welcomeTo: 'Bienvenue sur'
    yourPulseSpace: 'votre Espace Pulse !'
    formTitle: 'Veuillez vous connecter pour accéder à tous vos services.'
    email: 'Email'
    emailPlaceholder: 'Saisissez votre email'
    password: 'Mot de passe'
    passwordPlaceholder: 'Saisissez votre mot de passe'
    login: 'Me connecter'
    error: 'La combinaison email et mot de passe est incorrecte.'
    forgotPassword: 'Mot de passe oublié ?'
    alertPasswordRequired: 'Veuillez saisir votre mot de passe'
    alertMailRequired: 'Veuillez saisir votre email'
    alertMailInvalid: 'Veuillez saisir un email valide'
</i18n>
