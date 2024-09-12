<template>
  <PDrawer
    v-model="internalShowCalendar"
    pSize="100%"
    pDirection="ttb"
    pType="fullscreen"
    @close-drawer-button="internalShowCalendar = false"
    :pWithHeader="false"
  >
    <Schedule />
  </PDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScheduleDrawerProps } from './HomeScheduleDrawerType'
import Schedule from '@/schedule/pages/schedule'
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
