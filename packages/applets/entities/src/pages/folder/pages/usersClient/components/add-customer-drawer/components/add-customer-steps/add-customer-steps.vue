<template>
  <PSteps
    :pActive="addCustomerDrawerStepIndex"
  >
    <PStep
      v-for="(stepTitle, index) in stepTitles"
      :key="index"
      :pTitle="t(stepTitle)"
      class="flex--basis-40"
    />
  </PSteps>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PSteps, PStep } from '@pulse/styleguide/components'
import type { AddCustomerStepsProps } from './add-customer-steps.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<AddCustomerStepsProps>()

const stepTitles = [
  'add-email',
  'manage-rights',
]
</script>

<i18n lang="yaml">
  en-US:
    add-email: 'User information'
    manage-rights: 'User rights'
  fr-FR:
    add-email: 'Informations de l’utilisateur'
    manage-rights: 'Droits de l’utilisateur'
</i18n>
