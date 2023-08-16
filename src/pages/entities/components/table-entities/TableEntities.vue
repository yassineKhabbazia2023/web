<template>
  <div>
    <h1>{{ t('title') }}</h1>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    title: 'This is the entities page'
  fr-FR:
    title: 'Ceci est la page des entités'
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>
