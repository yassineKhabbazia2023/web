<template>
  <div
    class="
      p-completion-tracker
      flex
      flex--direction-column
      flex-gap--6
      padding--4
    "
  >
    <!-- Content grafted above the header (e.g. a completion alert). -->
    <slot name="pre-header" />
    <div
      v-if="pTitle !== undefined"
      class="p-completion-tracker__header"
    >
      <h3
        class="
          p-completion-tracker__title
          font-size--21
          font-semibold
          margin--0
        "
      >
        {{ pTitle }}
      </h3>
      <p
        v-if="pDescription !== undefined"
        class="
          p-completion-tracker__description
          font-size--14
          margin-top--1
        "
      >
        {{ pDescription }}
      </p>
    </div>
    <PProgress
      class="p-completion-tracker__progress"
      :pLabel="pProgressionLabel"
      :pPercentage="percentage"
    />
    <div
      class="
        p-completion-tracker__content
        flex
        flex--direction-column
        flex-gap--6
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

<style lang="scss" scoped>
.p-completion-tracker {
  &__description {
    color: var(--p-text-neutral);
  }
}
</style>
