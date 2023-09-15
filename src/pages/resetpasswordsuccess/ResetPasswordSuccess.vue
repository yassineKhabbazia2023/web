<template>
  <div class="page-content">
    <PImage
      type="paupulse"
      name="mini-email"
      class="badge-mini-email hidden-md-and-up"
    />
    <PImage
      type="badges"
      name="email"
      class="badge-email hidden-sm-and-down"
    />
    <p class="forgot-password-title">
      {{ t('verifyMailTitle') }}
    </p>
    <p class="reset-password-msg" v-html="resetPasswordMsg"></p>
    <PButton
      type="white"
      @click="router.push({ name: 'login' })"
      class="back-to-login-button hidden-sm-and-down"
    >
      {{ t('backToLogin') }}
    </PButton>
  </div>
</template>
<!-- eslint-disable max-len -->
<i18n lang="yaml">
  en-US:
    backToLogin: 'Back to login'
    verifyMailTitle: 'Check your email address.'
    verifyMsg: 'We will send an email to ... if it is associated with your account to reset your password.'
  fr-FR:
    backToLogin: 'Revenir à la connexion'
    verifyMailTitle: 'Vérifiez votre adresse mail.'
    verifyMsg: 'Nous enverrons un mail à ... s''il est associé à votre compte pour réinitialiser votre mot de passe.'
</i18n>
<!-- eslint-enable max-len -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { PImage, PButton } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const router = useRouter()
const route = useRoute()

const email = route.query.email
const resetPasswordMsg = t('verifyMsg').replace('...', `<strong>${email}</strong>`)
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
  word-wrap: break-word;

  .forgot-password-title {
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    line-height: 19.2px;
    margin: 15px 0;
    @media (max-width: 992px) {
      text-align: left;
    }
  }

  .reset-password-msg {
    margin: 15px 0;
    text-align: center;
    @media (max-width: 992px) {
      text-align: left;
    }
  }

  .btn-link {
    width: 100%;
  }

  .badge-mini-email {
    display: block;
    max-width: 200px;
    margin:auto;
  }

  .badge-email {
    display: block;
    max-width: 105px;
    margin:auto;
  }

  .reset-submit-button,
  .back-to-login-button {
    width: 100%;
  }

  span {
    font-weight: 600;
  }
}
</style>
