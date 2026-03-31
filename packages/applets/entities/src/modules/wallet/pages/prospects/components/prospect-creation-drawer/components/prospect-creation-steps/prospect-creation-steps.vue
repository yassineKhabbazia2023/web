<template>
  <PSteps :pActive="stepIndex" pFinishStatus="success">
    <PStep
      v-for="(step, index) in PROSPECT_CREATION_DRAWER_STEPS"
      :key="index"
      :pTitle="t(step)"
      class="flex--basis-40"
    />
  </PSteps>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PSteps, PStep } from '@pulse/styleguide/components'
import { ProspectCreationDrawerStep } from '@entities/modules/wallet/enums'
import { PROSPECT_CREATION_DRAWER_STEPS } from '../../prospect-creation-drawer.const'
import type { ProspectCreationStepsProps } from './prospect-creation-steps.type'

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
</script>
