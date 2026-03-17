<template>
  <div>
    <PForm
      :pModel="internalModel"
      pLabelPosition="top"
      pHideRequiredAsterisk
    >
      <PFormItem
        pProp="stepNote"
        :pLabel="t('modNote')"
        class="margin-bottom--0"
      >
        <PInput
          v-model="internalModel.stepNote"
          pType="textarea"
          :pDisabled="disabled"
          :pAutosize="{ minRows: 2 }"
          :pPlaceholder="t('notePlaceholder')"
        />
      </PFormItem>
    </PForm>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PForm, PFormItem, PInput } from '@pulse/styleguide/components'
import type { StepNoteProps } from './StepNoteTypes'
import type { Note } from '@entities/services/subscription/subscriptionTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      modNote: 'Note for the Middle Office (MOD)',
      notePlaceholder: 'Write your comment',
    },
    'fr-FR': {
      modNote: 'Note à destination du Middle Office (MOD)',
      notePlaceholder: 'Écrivez votre commentaire',
    },
  },
})

const props = withDefaults(defineProps<StepNoteProps>(), {
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [Note]
}>()

const internalModel = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})
</script>

