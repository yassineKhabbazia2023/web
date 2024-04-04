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
import { PForm, PFormItem, PInput } from '@kpmg/styleguide'
import type { StepNoteProps } from './StepNoteTypes'
import type { Note } from '@/services/subscription'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<StepNoteProps>()
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

<i18n lang="yaml">
en-US:
  modNote: 'Note for the Middle Office (MOD)'
  notePlaceholder: 'Write your comment'
fr-FR:
  modNote: 'Note à destination du Middle Office (MOD)'
  notePlaceholder: 'Écrivez votre commentaire'
</i18n>
