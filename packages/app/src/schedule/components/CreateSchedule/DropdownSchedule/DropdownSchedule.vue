<template>
  <PSelect
    pAllowCreate
    pFilterable
    v-model="scheduleModel"
    :pPlaceholder="placeholder"
  >
    <POption
      v-for="schedule in schedulesCollection"
      :key="schedule.key"
      :pLabel="schedule.label"
      :pValue="schedule.key"
    />
  </PSelect>
</template>

<script setup lang='ts'>
import {
  PSelect,
  POption,
} from '@pulse/styleguide/components'
import type { DropdownScheduleProps } from './DropdownScheduleTypes'
import { computed } from 'vue'

const props = withDefaults(defineProps<DropdownScheduleProps>(), {
  label: 'Titre du rappel',
  placeholder: 'Choisir un modèle ou saisir un titre',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const scheduleModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})

</script>
