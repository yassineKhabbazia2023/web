<template>
  <!-- Clicks and focus fall through to the button -->
  <button
    type="button"
    class="
      key-moments-nav__screen
      flex
      flex--align-items-center
      flex--justify-content-space-between
      flex-gap--2
      width--100
      padding--2
      font-size--14
      font-bold
      text-left
      cursor-pointer
    "
    :class="{
      'key-moments-nav__screen--current': isCurrent,
      'key-moments-nav__screen--hidden': isHidden,
    }"
    :aria-expanded="isExpanded"
  >
    <span class="key-moments-nav__screen-label">{{ label }}</span>
    <!-- The badge replaces the counter, so a hidden section reads as hidden without unfolding it -->
    <span
      v-if="isHidden"
      class="
        key-moments-nav__screen-state
        font-size--11
        font-normal
      "
    >
      {{ t('keyMoments.visibility.hiddenBadge') }}
    </span>
    <span
      v-else
      class="
        key-moments-nav__count
        font-size--12
        font-normal
      "
    >
      {{ count }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  label: string
  /** The section being read, which alone is marked: an unfolded one may only be peeked at */
  isCurrent: boolean
  /** Nothing of it reaches the reader */
  isHidden: boolean
  /** What of it the reader gets */
  count: number
  isExpanded: boolean
}>()

const { t } = useI18n()
</script>

<style scoped lang="scss">
.key-moments-nav {
  &__screen {
    color: var(--p-text-basic-heading);
    background: none;
    border: none;
    border-left: 3px solid transparent;

    &--current {
      border-left-color: var(--p-jungle-400);
    }

    &--hidden .key-moments-nav__screen-label {
      font-style: italic;
      font-weight: 400;
      color: var(--p-text-neutral-neutral);
    }
  }

  &__screen-label {
    flex: 1;
  }

  &__screen-state,
  &__count {
    color: var(--p-text-neutral-neutral);
  }
}
</style>
