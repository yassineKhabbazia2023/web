<template>
  <div class="p-completion-tracker-list">
    <div
      class="
        p-completion-tracker-list__title
        font-bold
        margin-bottom--2
      "
      data-testid="completion-tracker-list-title"
    >
      {{ pTitle }}
    </div>
    <div
      class="
        p-completion-tracker-list__items
        flex
        flex--direction-column
        flex-gap--2
      "
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { PCompletionTrackerListProps } from './PCompletionTrackerListTypes'

defineProps<PCompletionTrackerListProps>()
</script>

<style lang="scss" scoped>
.p-completion-tracker-list {
  &__title {
    color: var(--p-gray-900);
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>
