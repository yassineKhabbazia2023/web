<template>
  <div
    class="flex flex--align-items-center flex--justify-content-center radius--1 text-center"
    :class="[rootWrapperClass, currentCellNumberModifier]"
  >
    {{ pNumber }}
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PCalendarCellNumberProps } from './PCalendarCellNumberTypes'

const props = defineProps<PCalendarCellNumberProps>()

const rootWrapperClass = 'p-calendar-cell-number'
const currentCellNumberModifier = computed(() => `${rootWrapperClass}--state-${props.pState}`)
</script>

<style scoped lang="scss">
.p-calendar-cell-number {
  width: 24px;
  height: 24px;
  font-weight: 600;
  color: var(--el-color-neutral-gray-900);

  &--state-inactive {
    background-color: var(--el-color-neutral-gray-50);
    color: var(--el-color-neutral-gray-300);
    font-weight: 400;
  }

  &--state-active {
    background-color: var(--el-color-base-persian);
    color: var(--el-color-base-white);
  }

  &--state-current {
    color: var(--el-color-base-persian);
  }
}
</style>
