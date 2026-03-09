<template>
  <div
    class="
      p-completion-tracker
      flex
      flex--direction-column
      padding--4
    "
  >
    <div
      v-if="$slots.header !== undefined"
      class="p-completion-tracker__header margin-bottom--3"
    >
      <slot name="header" />
    </div>
    <PProgress
      class="margin-bottom--3"
      :pLabel="pProgressionLabel"
      :pPercentage="percentage"
    />
    <div
      class="
        p-completion-tracker__content
        flex
        flex--direction-column
        flex-gap--4
      "
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PProgress from '../../atoms/PProgress'
import type { PCompletionTrackerProps } from './PCompletionTrackerTypes'

const props = defineProps<PCompletionTrackerProps>()

const percentage = computed(() => {
  if (props.pTotal === 0) {
    return 0
  }
  return Math.round((props.pCurrent / props.pTotal) * 100)
})
</script>
