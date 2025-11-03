<template>
  <PError
    :pDescription="t('shared.pages.workInProgress.description')"
    pIllustrationName="error-page-3"
    pErrorName=""
    pErrorText=""
    :pIsFullSize="false"
    :pTitle="t('shared.pages.workInProgress.title')"
  />
</template>

<script setup lang="ts">
import { PError } from '@pulse/styleguide/components'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({ useScope: 'global' })
</script>
