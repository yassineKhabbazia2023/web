<template>
  <PSteps
    :pActive="stepIndex"
    :pFinishStatus="PStepStatus.SUCCESS"
    :pSteps="stepItems"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PSteps } from '@pulse/styleguide/components'
import { PStepStatus } from '@pulse/styleguide/types'
import { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'
import { PROSPECT_CREATION_DRAWER_STEPS } from '../../prospect-creation-drawer.const'
import type { ProspectCreationStepsProps } from './prospect-creation-steps.type'
import type { PStepsItem } from '@pulse/styleguide/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      [ProspectCreationDrawerStep.INFORMATION]: 'Information',
      [ProspectCreationDrawerStep.COMPANY]: 'Company',
      [ProspectCreationDrawerStep.CONTACT]: 'Contact person',
    },
    'fr-FR': {
      [ProspectCreationDrawerStep.INFORMATION]: 'Informations',
      [ProspectCreationDrawerStep.COMPANY]: 'Entreprise',
      [ProspectCreationDrawerStep.CONTACT]: 'Interlocuteur',
    },
  },
})

defineProps<ProspectCreationStepsProps>()

const stepItems = computed<PStepsItem[]>(() => {
  return PROSPECT_CREATION_DRAWER_STEPS.map((step) => ({
    pTitle: t(step),
    class: 'flex--basis-40',
  }))
})
</script>
