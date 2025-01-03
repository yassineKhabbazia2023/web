<template>
  <div class="wrapperLogin text-left margin-top--11">
    <h4 class="title font--bold">
      {{ t('welcomeTo') }}<br>
      <span class="title__second-part"> {{ t('yourSpace') }}</span>
    </h4>
    <p class="formTitle margin-top--2 margin-bottom--6">
      {{ t('formTitle') }}
    </p>
    <div
      v-if="hasCustomError"
      class="customError"
    >
      <div class="el-form-item__content">
        <p
          class="el-form-item__error"
          data-testid="login-error-message"
        >
          {{ t('error') }}
        </p>
      </div>
    </div>

    <PForm
      ref="formRef"
      class="el-login-form"
      :pRules="rules"
      :pModel="formValues"
      pRequireAsteriskPosition="right"
      pLabelPosition="top"
      @submit.prevent="handleSubmit"
    >
      <PFormItem
        :pLabel="t('email')"
        pRequired
        pProp="email"
      >
        <PInput
          v-model="formValues.email"
          :class="{ 'error': hasCustomError }"
          :pPlaceholder="t('emailPlaceholder')"
          pType="email"
          pName="email"
          pAutocomplete="on"
          pAutofocus
          data-testid="login-input-email"
        />
      </PFormItem>
      <PFormItem
        :pLabel="t('password')"
        pRequired
        pProp="password"
      >
        <PInput
          v-model="formValues.password"
          :class="{ 'error': hasCustomError }"
          :pPlaceholder="t('passwordPlaceholder')"
          pType="password"
          pShowPassword
          data-testid="login-input-password"
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
            :pContent="t('login')"
            :pDisabled="!isFormValid"
            data-testid="login-submit-button"
            @click="handleSubmit(formRef)"
          />
        </div>
      </PFormItem>
    </PForm>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, reactive, ref, toRaw } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { productFruits } from 'product-fruits'
import { amplitudeService, commonApi, tokenService } from '@pulse/common'
import { PForm, PFormItem, PInput, PSkewedButton } from '@pulse/styleguide/components'
import useInitUserAuth from '@login/composable/useInitUserAuth'
import useNavigation from '@login/composable/useNavigation'
import { getTermsByCurrentUser } from '@login/services/cgu'
import { userNameGenerator } from '@login/helper'
import {
  VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT,
} from 'env-vars'

const { initAuthClient, setStoreGigyaUserId } = useInitUserAuth()
const { navigateToCustomerWallet } = useNavigation()

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

declare global {
  interface Window {
    productFruits: any
    HubSpotConversations: any
    productFruitsUser: any
  }
}

const router = useRouter()
const formRef = ref<FormInstance>()

const formValues = reactive({
  email: '',
  password: '',
})

const formValidity: any = reactive({
  email: false,
  password: false,
})

const isFormValid = computed(() =>
  formValidity.email && formValidity.password,
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
  email: [{ trigger: ['blur', 'change'], validator: validateEmail }],
  password: [{ trigger: ['blur', 'change'], validator: validatePassword }],
})

const handleSubmit = async (formEl: FormInstance | undefined) => {
  amplitudeService.setNewUserProperty('user_type', 'Client')
  if (!formEl) {
    return
  }
  if (formEl.validate) {
    try {
      await formEl.validate()
    } catch (error) {
      return false
    }
  }

  try {
    // Authentication
    const {
      data: {
        webToken: token,
        userId,
      },
    } = await commonApi().gateway.post('authentication/api/login', toRaw(formValues))
    tokenService.setToken(token)

    // Set currentuser data
    await initAuthClient()
    setStoreGigyaUserId(userId)

    // Get currentuser terms
    const { isCurrent, terms } = await getTermsByCurrentUser()

    amplitudeService.track('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'succeeded',
    })

    if (isCurrent) {
      return navigateToCustomerWallet()
    }
    router.push({ name: 'validationCGU', params: { termsId: terms.termsId } })
  } catch (error: any) {
    const hasEmailOrPasswordInvalid = error.response?.data?.errorCode === '403042'
    if (hasEmailOrPasswordInvalid) {
      hasCustomError.value = true
    }
    amplitudeService.track('Sign In Completed', {
      sign_in_method: 'email',
      sign_in_result: 'failed',
    })
    return false
  }
}

onMounted(() => {
  amplitudeService.reset()
  productFruitsTrigger(VITE_PRODUCT_FRUITS_ANONYMOUS_KEY_CLIENT)
})

defineExpose({ handleSubmit })

const productFruitsTrigger = (productFruitsKey: string) => {
  if (productFruitsKey) {
    productFruits.init(productFruitsKey, 'fr', {
      username: userNameGenerator(),
    })
    window.addEventListener(
      'productfruits_button_ext_widget_init',
      () => {
        (window as any).HubSpotConversations.widget.load({ widgetOpen: true });
        (window as any).HubSpotConversations.widget.open()
      },
    )
  }
}
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
.customError {
  padding-bottom: 18px;

  .el-form-item__error {
    position: inherit;
    padding-top: 0;
  }
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
    welcomeTo: 'Welcome to'
    yourSpace: 'your Space!'
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
    yourSpace: 'votre espace !'
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
