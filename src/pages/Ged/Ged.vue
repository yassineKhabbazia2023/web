<template>
  <div>
    <p>{{ t('ged') }}</p>
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
    ged: "It's ged time ! 🥳"
  fr-FR:
    ged: "It's ged time ! 🥳"
</i18n>
