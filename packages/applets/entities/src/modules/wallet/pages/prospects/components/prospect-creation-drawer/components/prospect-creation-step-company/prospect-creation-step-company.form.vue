<template>
  <PForm pLabelPosition="top">
    <PFormItem :pLabel="t('legalFormLabel')">
      <PInput
        v-model="model.legalForm"
        :pPlaceholder="t('legalFormPlaceholder')"
        data-testid="prospect-legal-form-input"
      />
    </PFormItem>
    <PFormItem :pLabel="t('legalStructureLabel')">
      <PInput
        v-model="model.legalStructure"
        :pPlaceholder="t('legalStructurePlaceholder')"
        data-testid="prospect-legal-structure-input"
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
      legalFormLabel: 'Legal form',
      legalFormPlaceholder: 'Enter legal form',
      legalStructureLabel: 'Legal structure',
      legalStructurePlaceholder: 'Enter legal structure',
    },
    'fr-FR': {
      legalFormLabel: 'Forme juridique',
      legalFormPlaceholder: 'Saisir la forme juridique',
      legalStructureLabel: 'Structure juridique',
      legalStructurePlaceholder: 'Saisir la structure juridique',
    },
  },
})

const model = defineModel<ProspectFormData>({ required: true })
</script>
