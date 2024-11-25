<template>
  <PDrawer
    v-model="internalShowCalendar"
    pSize="100%"
    pDirection="ttb"
    pType="fullscreen"
    :pWithHeader="false"
    @close-drawer-button="internalShowCalendar = false"
  >
    <Schedule />
  </PDrawer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ScheduleDrawerProps } from './HomeScheduleDrawerType'
import Schedule from '@app/schedule/pages/schedule'
import { PDrawer } from '@pulse/styleguide/components'

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
