<template>
  <h3>{{ t('title') }}</h3>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
</script>

<i18n lang="yaml">
  en-US:
    title: 'This is the login page'
  fr-FR:
    title: 'Ceci est la page login'
</i18n>
