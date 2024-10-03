<template>
  <div class="page-content">
    <PImage
      pType="paupulse"
      pName="envelope"
      class="badge-mini-email hidden-md-and-up"
    />
    <PImage
      pType="badges"
      pName="email"
      class="badge-email hidden-sm-and-down"
    />
    <p class="forgot-password-title">
      {{ t('verifyMailTitle') }}
    </p>
    <p class="reset-password-msg">
      {{ t('sendEmailDescription') }}
      <strong>{{ email }}</strong>
      {{ t('associatedAccount') }}
    </p>
    <PButton
      pType="white"
      @click="router.push({ name: 'loginClient' })"
      class="back-to-login-button hidden-sm-and-down"
    >
      {{ t('backToLogin') }}
    </PButton>
  </div>
</template>

<!-- eslint-disable max-len -->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { PImage, PButton } from '@pulse/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const router = useRouter()
const route = useRoute()

const email = route.query.email
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
  word-wrap: break-word;

  .forgot-password-title {
    text-align: center;
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
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
}
</style>

<i18n lang="yaml">
  en-US:
    backToLogin: 'Back to login'
    verifyMailTitle: 'Check your email address.'
    sendEmailDescription: 'We will send an email to '
    associatedAccount: ' if it is associated with your account to reset your password.'
  fr-FR:
    backToLogin: 'Revenir à la connexion'
    verifyMailTitle: 'Vérifiez votre adresse mail.'
    sendEmailDescription: 'Nous enverrons un mail à '
    associatedAccount: ' s''il est associé à votre compte pour réinitialiser votre mot de passe.'
</i18n>
