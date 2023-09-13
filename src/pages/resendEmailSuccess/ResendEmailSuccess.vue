<template>
  <div class="page-content">
    <PImage
      type="badges"
      name="email"
      class="badge-email" />
    <p class="verifyEmail">
      {{ t('verifyEmail') }}
    </p>
    <p class="msgInfo">
      {{ t('msgInfo') }}
    </p>
    <a
      href="/login"
      class="link hidden-sm-and-down">
      {{ t('returnHome') }}
    </a>
  </div>
</template>

<!-- eslint-disable max-len -->
<i18n lang="yaml">
  en-US:
    verifyEmail: 'Verify your mail box'
    msgInfo: 'A new link activation has been send to you. This link will expire in 1h30, please active your account before this delay.'
    returnHome: 'Back to homepage'
  fr-FR:
    verifyEmail: 'Vérifier votre adresse mail'
    msgInfo: 'Le nouveau lien d''activation vient de vous être envoyé. Ce lien expire dans 1h30, veuillez activer votre compte avant ce délai.'
    returnHome: 'Revenir à la connexion'
</i18n>
<!-- eslint-enable max-len -->

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PImage } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>

<style lang="scss" scoped>
.page-content {
  display: flex;
  flex-direction: column;
  height: 100%;

  @media (min-width: 992px) {
    padding: 0 0 193px 0;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }
  text-align: left;
  justify-content: center;
  gap: 24px;

  .badge-email {
    max-width: 140px;
    margin: auto;
  }

  .verifyEmail {
    font-weight: 600;
    font-size: 16px;
    line-height: 19.2px;
  }

  .msgInfo {
    max-width: 376px;
  }

  .link {
    color: var(--el-color-primary);
    font-weight: 600;
    line-height: 16.8px;
    font-size: 14px;
  }
}
</style>
