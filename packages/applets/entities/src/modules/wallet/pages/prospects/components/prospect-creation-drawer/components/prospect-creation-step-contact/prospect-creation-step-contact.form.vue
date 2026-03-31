<template>
  <PForm pLabelPosition="top">
    <PFormItem :pLabel="t('label')">
      <PInput
        v-model="model"
        :pPlaceholder="t('placeholder')"
        data-testid="prospect-contact-input"
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
      label: 'Contact person',
      placeholder: 'Enter contact person name',
    },
    'fr-FR': {
      label: 'Interlocuteur',
      placeholder: 'Saisir le nom de l\'interlocuteur',
    },
  },
})

const model = defineModel<string>()
</script>
