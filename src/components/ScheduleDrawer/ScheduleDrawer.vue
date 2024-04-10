<template>
  <PDrawer
    v-model="internalShowCalendar"
    pSize="100%"
    pDirection="ttb"
    :zIndex="100"
    @close-drawer-button="internalShowCalendar = false"
    :withHeader="false"
  >
    <Schedule />
  </PDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScheduleDrawerProps } from './ScheduleDrawerType'
import Schedule from '@/schedule/pages/home'
import { PDrawer } from '@kpmg/styleguide'

const emit = defineEmits<{
  'update:model-value': [boolean]
}>()

const props = defineProps<ScheduleDrawerProps>()

const internalShowCalendar = computed({
  get() {
    return props.modelValue
  },
  set(modelValue: boolean) {
    emit('update:model-value', modelValue)
  },
})
</script>
