<template>
  <div>
    {{ t('mandate') }}
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
</script>

<i18n lang="yaml">
  en-US:
    mandate: 'Mandate'
  fr-FR:
    mandate: 'Mandat'
</i18n>

<style lang="scss" scoped>
</style>
