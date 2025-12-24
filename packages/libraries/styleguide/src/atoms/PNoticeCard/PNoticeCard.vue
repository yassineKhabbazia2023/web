<template>
  <div class="p-notice-card flex flex--direction-column">
    <div
      class="
        p-notice-card__header
        flex
        flex--align-items-center
        flex-gap--1
        text-color--base-white
      "
      :class="`p-notice-card__header--${pHeaderColor}`"
    >
      <PIcon
        v-if="pIcon !== undefined"
        class="p-notice-card__icon flex--shrink-0"
        :pName="pIcon"
      />
      <h3 class="p-notice-card__title margin--0">
        {{ pTitle }}
      </h3>
    </div>
    <div
      v-if="$slots.default"
      class="p-notice-card__body padding--2"
      :class="`p-notice-card__body--${pBodyColor}`"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import PIcon from '../PIcon'
import type { PNoticeCardProps } from './PNoticeCardTypes'

withDefaults(defineProps<PNoticeCardProps>(), {
  pHeaderColor: 'info',
  pBodyColor: 'default',
})
</script>

<style scoped lang="scss">
.p-notice-card {
  overflow: hidden;

  &__header {
    padding: 4px 8px;

    &--dark-green {
      background-color: var(--p-jungle-400);
      color: var(--p-white);
    }

    &--dark-blue {
      background-color: var(--p-black-rock-800);
      color: var(--p-white);
    }

    &--teal {
      background-color: var(--p-teal-800);
      color: var(--p-white);
    }

    &--info {
      background-color: var(--p-surface-information-primary);
      color: var(--p-text-information-primary);
    }

    &--success {
      background-color: var(--p-surface-success);
      color: var(--p-text-success);
    }

    &--warning {
      background-color: var(--p-surface-warning);
      color: var(--p-text-warning);
    }

    &--danger {
      background-color: var(--p-surface-error);
      color: var(--p-text-error);
    }

    &--purple {
      background-color: var(--p-persian-500);
      color: var(--p-white);
    }

    &--red {
      background-color: var(--p-red-800);
      color: var(--p-white);
    }

    &--orange {
      background-color: var(--p-orange-800);
      color: var(--p-white);
    }

    &--pennylane {
      background-color: var(--p-partner-pennylane-dark-green);
      color: var(--p-white);
    }
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.5;
  }

  &__body {
    background-color: var(--p-white);

    &--default {
      background-color: var(--p-white);
      color: var(--p-black-rock-900);
    }

    &--light-green {
      background-color: var(--p-jungle-50);
      color: var(--p-jungle-700);
    }

    &--green-lighter {
      background-color: var(--p-jungle-75);
      color: var(--p-jungle-700);
    }

    &--light-blue {
      background-color: var(--p-teal-100);
      color: var(--p-teal-800);
    }

    &--lighter-gray {
      background-color: var(--p-gray-50);
      color: var(--p-black-rock-900);
    }

    &--light-gray {
      background-color: var(--p-gray-100);
      color: var(--p-black-rock-900);
    }

    &--tranquil {
      background-color: var(--p-tranquil-50);
      color: var(--p-mint-tulip-800);
    }
  }
}
</style>
