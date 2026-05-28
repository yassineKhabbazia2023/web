<template>
  <PAlert pType="information" data-testid="mobile-not-available-alert">
    <strong>{{ t('shared.mobile-not-available.title') }}</strong> {{ t('shared.mobile-not-available.description') }}
  </PAlert>
</template>

<script setup lang="ts">
import { PAlert } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})
</script>
