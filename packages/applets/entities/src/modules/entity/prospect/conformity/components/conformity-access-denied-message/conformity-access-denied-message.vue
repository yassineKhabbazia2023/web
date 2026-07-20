<template>
  <PAlert
    class="conformity-access-denied-message margin-top--4"
    pType="information"
  >
    {{ t('entities.prospect.conformity.stepAccessDeniedMessage') }}
  </PAlert>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PAlert } from '@pulse/styleguide/components'

const { t } = useI18n()
</script>
