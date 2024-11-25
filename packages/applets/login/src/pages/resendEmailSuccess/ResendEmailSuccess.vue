<template>
  <div class="page-content">
    <PImage
      pType="badges"
      pName="email"
      class="badge-email"
    />
    <p class="verifyEmail">
      {{ t('verifyEmail') }}
    </p>
    <p class="msgInfo">
      {{ t('msgInfo') }}
    </p>
    <a
      href="/login"
      class="link hidden-sm-and-down"
    >
      {{ t('returnLoginPage') }}
    </a>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PImage } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<style lang="scss" scoped>
.page-content {
  height: 100%;

  @media (min-width: 992px) {
    padding: 0 0 193px 0;
    text-align: center;
  }
  text-align: left;
  justify-content: center;
  gap: 24px;

  .badge-email {
    max-width: 140px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 20px;
    display: block;
  }

  .verifyEmail {
    margin-top: 24px;
    font-weight: 600;
    font-size: 16px;
    line-height: 19.2px;
  }

  .msgInfo {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .link {
    color: var(--el-color-primary);
    font-weight: 600;
    line-height: 16.8px;
    font-size: 14px;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    verifyEmail: 'Verify your mail box'
    msgInfo: >
      A new link activation has been send to you.
      This link will expire in 1h30, please active your account before this delay.
    returnLoginPage: 'Back to the login page'
  fr-FR:
    verifyEmail: 'Vérifier votre adresse mail'
    msgInfo: >
      Le nouveau lien d'activation vient de vous être envoyé.
      Ce lien expire dans 1h30, veuillez activer votre compte avant ce délai.
    returnLoginPage: 'Revenir à la connexion'
</i18n>
