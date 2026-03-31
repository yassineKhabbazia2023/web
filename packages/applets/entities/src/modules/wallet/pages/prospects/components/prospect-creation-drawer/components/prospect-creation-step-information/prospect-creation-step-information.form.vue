<template>
  <PForm pLabelPosition="top">
    <PFormItem :pLabel="t('label')">
      <PInput
        v-model="model"
        :pPlaceholder="t('placeholder')"
        data-testid="prospect-information-input"
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
      label: 'Information',
      placeholder: 'Enter information',
    },
    'fr-FR': {
      label: 'Information',
      placeholder: 'Saisir une information',
    },
  },
})

const model = defineModel<string>()
</script>
