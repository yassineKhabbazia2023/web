<template>
  <!-- Clicks fall through to the button -->
  <button
    type="button"
    class="
      key-moments-nav__widget
      flex
      flex--align-items-center
      flex-gap--2
      width--100
      padding--2
      font-size--13
      text-left
      cursor-pointer
    "
    :class="{
      'key-moments-nav__widget--active': isActive,
      'key-moments-nav__widget--hidden': isHidden,
    }"
    :aria-current="isActive"
  >
    <span
      class="key-moments-nav__widget-label"
      :class="{ 'font-italic': isInvitation }"
    >
      {{ label }}
    </span>
    <span
      v-if="state !== undefined"
      class="key-moments-nav__widget-state font-size--11"
    >
      {{ state }}
    </span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  label: string
  /** The block being read */
  isActive?: boolean
  /** Nothing of it reaches the reader */
  isHidden?: boolean
  /** Said after the label: the hidden badge, or a count */
  state?: string
  /** Leads somewhere to act rather than to a block */
  isInvitation?: boolean
}>(), {
  isActive: false,
  isHidden: false,
  state: undefined,
  isInvitation: false,
})
</script>

<style scoped lang="scss">
.key-moments-nav {
  &__widget {
    color: var(--p-text-basic-body);
    background: none;
    border: none;
    border-bottom: 1px solid var(--key-moments-line);
    border-left: 3px solid transparent;

    &:hover {
      background-color: var(--key-moments-stripe-surface);
    }

    &--active {
      font-weight: 700;
      background-color: var(--key-moments-emphasis-surface);
      border-left-color: var(--p-mint-tulip-500);
    }

    &--hidden .key-moments-nav__widget-label {
      font-style: italic;
      color: var(--p-text-neutral-neutral);
    }
  }

  &__widget-label {
    flex: 1;
  }

  &__widget-state {
    color: var(--p-text-neutral-neutral);
  }
}
</style>
