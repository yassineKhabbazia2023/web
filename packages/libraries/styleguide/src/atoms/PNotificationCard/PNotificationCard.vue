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
        flex--align-items-stretch
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
      <div class="p-notification-card__right-col flex flex--direction-column text-right text-color--neutral-gray-400">
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
  background: var(--p-white);
  transition: all 0.1s ease;
  border-left: 4px solid transparent;

  &--new {
    background: var(--p-black-rock-100);
    border-color: var(--p-jungle-400);
  }

  &:hover,
  &:focus {
    background: var(--p-tranquil-50);
  }

  &__button {
    display: flex;
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

  &__right-col {
    &__time,
    &__tag {
      width: 42px;
      text-align: center;
      color: var(--p-gray-400);
    }
  }

  &__actions {
    position: absolute;
    bottom: 12px;
    right: 8px;
  }
}
</style>
