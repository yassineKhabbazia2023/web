<template>
  <PForm pLabelPosition="top">
    <PFormItem :pLabel="t('label')">
      <PInput
        v-model="model"
        :pPlaceholder="t('placeholder')"
        data-testid="prospect-company-input"
      />
    </PFormItem>
  </PForm>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PForm, PFormItem, PInput } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      label: 'Company',
      placeholder: 'Enter company name',
    },
    'fr-FR': {
      label: 'Entreprise',
      placeholder: 'Saisir le nom de l\'entreprise',
    },
  },
})

const model = defineModel<string>()
</script>
