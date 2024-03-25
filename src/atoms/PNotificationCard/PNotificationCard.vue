<template>
  <div :class="['p-notification-card shadow--1', { 'p-notification-card--new': pIsNew }]">
    <button class="p-notification-card__button" @click="$emit('action-notification-click')">
      <span class="p-notification-card__notif padding-right--1" aria-hidden="true">
        <PIcon class="p-notification-card__icon" size="16">
          <PIDot />
        </PIcon>
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
    padding: 12px 8px;
    background: transparent;
    appearance: none;
    cursor: pointer;
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
