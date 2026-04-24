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
      'add-email': 'User information',
      'manage-rights': 'User rights',
    },
    'fr-FR': {
      'add-email': 'Informations de l’utilisateur',
      'manage-rights': 'Droits de l’utilisateur',
    },
  },
})

defineProps<AddCustomerStepsProps>()

const stepTitles = [
  'add-email',
  'manage-rights',
]

const stepItems = computed<PStepsItem[]>(() => {
  return stepTitles.map((stepTitle) => ({
    pTitle: t(stepTitle),
    class: 'flex--basis-40',
  }))
})
</script>

