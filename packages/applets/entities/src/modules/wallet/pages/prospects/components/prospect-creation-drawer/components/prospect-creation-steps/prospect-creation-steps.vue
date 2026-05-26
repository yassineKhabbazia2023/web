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
import { useResponsive } from '@pulse/styleguide'
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

const props = defineProps<ProspectCreationStepsProps>()

const { isMobile } = useResponsive()

const stepItems = computed<PStepsItem[]>(() => {
  return PROSPECT_CREATION_DRAWER_STEPS.map((step, index) => {
    // On mobile, only show the active step label: all labels at once don't fit the drawer width
    const isLabelVisible = isMobile.value === false || index === props.stepIndex

    return {
      pTitle: isLabelVisible ? t(step) : undefined,
      class: 'flex--basis-40',
    }
  })
})
</script>
