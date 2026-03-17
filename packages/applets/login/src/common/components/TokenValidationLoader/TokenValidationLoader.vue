<template>
  <div
    class="flex flex--direction-column flex--align-items-center margin-y--6"
    data-testid="token-validation-loader"
  >
    <PLoader
      pType="primary"
      pSize="64"
    />
    <p class="font-semibold margin-y--2">
      {{ t('loading') }}
    </p>
    <p>
      {{ t('stayOnPage') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { PLoader } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      loading: 'Loading...',
      stayOnPage: 'Please do not close this page',
    },
    'fr-FR': {
      loading: 'Chargement en cours...',
      stayOnPage: 'Merci de ne pas fermer cette page',
    },
  },
})
</script>

