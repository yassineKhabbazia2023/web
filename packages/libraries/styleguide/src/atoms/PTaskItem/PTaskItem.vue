<template>
  <div
    class="
      p-task-item padding-x--2 padding-y--1
      flex flex--align-items-center flex--justify-content-space-between"
    :class="pClassMapper"
    :title="pTitle"
  >
    <p class="p-task-item__title font-semibold font-base">
      {{ pTitle }}
    </p>
    <p class="p-task-item__numb-tasks flex--shrink-0 font-semibold font-xsmall">
      <span data-test-id="task-item-completed">{{ pCompletedTasks }}</span>
      /
      <span data-test-id="task-item-total">{{ pTotalTasks }}</span>
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PTaskItemProps } from './PTaskItemTypes'

const props = defineProps<PTaskItemProps>()

const pClassMapper = computed(() => ({
  [`p-task-item--status-${props.pStatus}`]: true,
}))
</script>

<style lang="scss" scoped>
.p-task-item {
  $self: &;

  &--status {
    &-done {
      background: var(--p-green-100);
      #{$self}__numb-tasks {
        color: var(--p-green-800);
      }
    }
    &-disabled {
      background: var(--p-gray-100);
      #{$self}__numb-tasks {
        color: var(--p-gray-500);
      }
    }
    &-todo {
      background: var(--p-jungle-100);

      #{$self}__numb-tasks {
        color: var(--p-jungle-600);
      }
    }
  }
  &__title {
    color: var(--p-gray-900);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  &__numb-tasks {
    margin-left: 0.6rem;
  }
}
</style>
