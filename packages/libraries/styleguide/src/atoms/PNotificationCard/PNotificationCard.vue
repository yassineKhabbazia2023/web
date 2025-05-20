<template>
  <div
    :class="[
      'p-notification-card',
      'flex',
      { 'p-notification-card--new': pIsNew }
    ]"
  >
    <button
      class="
        p-notification-card__button
        padding-left--2
        padding-right--3
        padding-y--3
        flex--grow-1
      "
      @click="$emit('action-notification-click')"
    >
      <span class="p-notification-card__avatar">
        <slot name="avatar" />
      </span>
      <span class="p-notification-card__text padding-x--3 flex--grow-1">
        <slot name="text" />
      </span>
      <div class="p-notification-card__rightCol">
        <span class="p-notification-card__time font-small padding-left--2 padding-bottom--2">
          {{ pTime }}
        </span>
        <div
          v-if="$slots.tag"
          class="p-notification-card__tag font-small padding-left--2 padding-bottom--2"
        >
          <slot name="tag" />
        </div>
      </div>
    </button>
    <div class="p-notification-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PNotificationCardProps } from './PNotificationCardTypes'

defineEmits(['action-notification-click'])

withDefaults(defineProps<PNotificationCardProps>(), {
  pIsNew: false,
})
</script>

<style lang="scss" scoped>
.p-notification-card {
  $self: &;
  position: relative;
  background: var(--el-color-white);
  transition: all 0.1s ease;
  border-left: 4px solid transparent;

  &--new {
    background: var(--el-color-black-rock-100);
    border-color: var(--el-color-secondary-amethyste);
  }

  &:hover,
  &:focus {
    background: var(--el-color-secondary-cyan-bg);
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: transparent;
    appearance: none;
    cursor: pointer;
    border: none;
  }

  &__text {
    width: calc(100% - 110px);
    text-align: left;
    word-break: break-word;
  }

  &__rightCol {
    display: flex;
    flex-direction: column;
    text-align: right;

    &__time {
      width: 42px;
      text-align: center;
      color: var(--el-color-neutral-gray-900);
    }

    &__tag {
      width: 42px;
      text-align: center;
      color: var(--el-color-neutral-gray-900);
    }
  }

  &__actions {
    position: absolute;
    bottom: 12px;
    right: 8px;
  }
}
</style>
