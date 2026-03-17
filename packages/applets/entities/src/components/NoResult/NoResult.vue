<template>
  <div
    class="
      bg--neutral-gray-50
      padding--6
      text-center
      text-color--neutral-gray-500
    "
  >
    <p class="font-large margin-bottom--2">
      {{ t('oops') }}
    </p>
    <p class="font-base">
      {{ t('noResult') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      oops: 'Oops',
      noResult: 'It looks like there are no results for your search.',
    },
    'fr-FR': {
      oops: 'Oups',
      noResult: 'Il semblerait qu\'il n\'y ait pas de résultats à votre recherche.',
    },
  },
})
</script>

