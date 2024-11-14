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
        padding--2
        flex--grow-1
      "
      @click="$emit('action-notification-click')"
    >
      <span class="p-notification-card__notif padding-right--1" aria-hidden="true">
        <PIcon
          class="p-notification-card__icon"
          size="16"
          pName="dot"
        />
      </span>
      <span class="p-notification-card__avatar padding-right--2">
        <slot name="avatar" />
      </span>
      <span class="p-notification-card__text">
        <slot name="text" />
      </span>
      <span class="p-notification-card__time font-small padding-left--2 padding-bottom--2">
        {{ pTime }}
      </span>
    </button>
    <div class="p-notification-card__actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PNotificationCardProps } from './PNotificationCardTypes'
import PIcon from '../PIcon'

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

  &--new {
    background: var(--el-color-persian-100);

    #{$self}__icon {
      color: var(--el-color-persian-500);
    }
  }

  &:hover,
  &:focus {
    background: var(--el-color-persian-200);
  }

  &__button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    appearance: none;
    cursor: pointer;
    border: none;
  }

  &__icon {
    color: transparent;
  }

  &__text {
    width: calc(100% - 110px);
    padding: 0 8px;
    text-align: left;
  }

  &__time {
    align-self: flex-start;
    width: 42px;
    text-align: center;
    color: var(--el-color-neutral-gray-700);
  }

  &__actions {
    position: absolute;
    bottom: 12px;
    right: 8px;
  }
}
</style>
