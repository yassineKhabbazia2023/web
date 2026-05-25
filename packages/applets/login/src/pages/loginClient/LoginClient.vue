<template>
  <div class="wrapperLogin text-left margin-top--11">
    <h4 class="title font--bold">
      {{ t('welcomeTo') }}
      <span class="title__second-part">{{ t('yourSpace') }}</span>
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
          @keydown="handleKeypressAfterIncorrectCredentials"
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
          @keydown="handleKeypressAfterIncorrectCredentials"
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PForm, PFormItem, PInput, PSkewedButton } from '@pulse/styleguide/components'
import { useLoginClient } from './login-client.composable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      welcomeTo: 'Welcome to your',
      yourSpace: 'Customer Space!',
      formTitle: 'Please login to access all your services.',
      email: 'E-mail address',
      emailPlaceholder: 'Enter your e-mail address',
      password: 'Password',
      passwordPlaceholder: 'Enter your password',
      login: 'Log in',
      loading: 'Loading...',
      forgotPassword: 'Forgot your password?',
      emailOrPasswordError: 'The e-mail address and password combination is incorrect',
      technicalError: 'A technical error occurred.',
      alertPasswordRequired: 'Please enter your password',
      alertMailRequired: 'Please enter your e-mail address',
      alertMailInvalid: 'Please enter a valid e-mail address',
    },
    'fr-FR': {
      welcomeTo: 'Bienvenue sur votre',
      yourSpace: 'espace client !',
      formTitle: 'Veuillez vous connecter pour accéder à tous vos services.',
      email: 'Adresse e-mail',
      emailPlaceholder: 'Saisissez votre adresse e-mail',
      password: 'Mot de passe',
      passwordPlaceholder: 'Saisissez votre mot de passe',
      login: 'Se connecter',
      loading: 'Chargement en cours',
      forgotPassword: 'Mot de passe oublié ?',
      emailOrPasswordError: 'La combinaison de l\'adresse e-mail et du mot de passe est incorrecte',
      technicalError: 'Une erreur technique est survenue.',
      alertPasswordRequired: 'Veuillez saisir votre mot de passe',
      alertMailRequired: 'Veuillez saisir votre adresse e-mail',
      alertMailInvalid: 'Veuillez saisir une adresse e-mail valide',
    },
  },
})

const {
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
} = useLoginClient()

const emailError = computed(() => emailErrorKey.value === '' ? '' : t(emailErrorKey.value))
const passwordError = computed(() => passwordErrorKey.value === '' ? '' : t(passwordErrorKey.value))
const submitButtonContent = computed(() => isLoading.value ? t('loading') : t('login'))
</script>

<style lang="scss" scoped>
.title {
  font-size: 3.2rem;
  text-wrap: balance;
  max-width: 15ch;

  &__second-part {
    color: var(--p-jungle-400);
  }
}
.formTitle {
  font-size: 1.6rem;
}

.forgot-password-btn {
  display: block;
  color: var(--p-jungle-400);
  font-size: 12px;

  &:hover {
    color: var(--p-jungle-500);
  }
}
</style>
