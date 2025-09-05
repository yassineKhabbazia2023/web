<template>
  <div class="page-content">
    <div
      class="
        page-content__circle
        flex
        flex--align-items-center
        flex--justify-content-center
        margin-bottom--4
      "
    >
      <div class="page-content__image">
        <PImage pName="envelope-duotone" />
      </div>
    </div>

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
      class="back-to-login-button margin-bottom--4"
      data-testid="back-to-login-button"
      @click="router.push({ name: APP_ROUTES.login.client.name })"
    >
      {{ t('backToLogin') }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { PButton, PImage } from '@pulse/styleguide/components'
import { APP_ROUTES } from '@pulse/common/constants'

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
  text-align: left;
  justify-content: space-evenly;
  gap: 24px;
  word-wrap: break-word;

  @media (min-width: 992px) {
    padding: 48px 0 0 0;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  &__circle {
    width: 80px;
    height: 80px;
    background-color: var(--p-jungle-50);
    border-radius: 50%;
    margin: 0 auto;
  }

  &__image {
    width: 32px;
    height: 32px;
  }

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
    verifyMailTitle: 'Vérifiez votre boite mail.'
    sendEmailDescription: 'Si l''adresse '
    associatedAccount: >
      est bien associée à votre compte, vous recevrez un lien par e-mail pour réinitialiser votre mot de passe.
</i18n>
