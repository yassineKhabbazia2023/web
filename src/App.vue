<template>
  <PRow>
    <PCol>
      {{ t('title') }}
      <!-- Your content here -->
    </PCol>
  </PRow>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>

<style>
  html, body {
    background-color: white !important;
    color: black;
  }
</style>

<i18n lang="yaml">
  en-US:
    title: 'This is the ged page'
  fr-FR:
    title: 'Ceci est la page ged'
</i18n>
