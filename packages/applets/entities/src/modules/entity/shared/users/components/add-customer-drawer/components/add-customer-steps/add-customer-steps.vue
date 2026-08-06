<template>
  <PSteps
    :pActive="addCustomerDrawerStepIndex"
    :pSteps="stepItems"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PSteps } from '@pulse/styleguide/components'
import type { PStepsItem } from '@pulse/styleguide/types'
import type { AddCustomerStepsProps } from './add-customer-steps.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      'customer-information': 'User information',
      'manage-rights': 'User rights',
    },
    'fr-FR': {
      'customer-information': 'Informations de l’utilisateur',
      'manage-rights': 'Droits de l’utilisateur',
    },
  },
})

const props = defineProps<AddCustomerStepsProps>()

const stepItems = computed<PStepsItem[]>(() => {
  return props.steps.map((step) => ({
    pTitle: t(step),
    class: 'flex--basis-40',
  }))
})
</script>
