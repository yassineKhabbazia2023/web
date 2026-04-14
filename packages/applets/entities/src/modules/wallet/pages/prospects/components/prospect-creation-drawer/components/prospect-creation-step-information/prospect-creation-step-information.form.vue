<template>
  <PForm pLabelPosition="top">
    <PFormItem :pLabel="t('siretLabel')">
      <PInput
        v-model="model.siret"
        :pPlaceholder="t('siretPlaceholder')"
        data-testid="prospect-siret-input"
      />
    </PFormItem>
  </PForm>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PForm, PFormItem, PInput } from '@pulse/styleguide/components'
import type { ProspectFormData } from '../../prospect-creation-drawer.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      siretLabel: 'SIRET',
      siretPlaceholder: 'Enter SIRET number',
    },
    'fr-FR': {
      siretLabel: 'SIRET',
      siretPlaceholder: 'Saisir le numéro SIRET',
    },
  },
})

const model = defineModel<ProspectFormData>({ required: true })
</script>
