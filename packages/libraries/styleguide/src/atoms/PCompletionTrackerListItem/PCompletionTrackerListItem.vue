<template>
  <button
    type="button"
    class="
      p-completion-tracker-list-item
      flex
      flex--align-items-center
      flex--justify-content-space-between
      width--100
      text-left
      cursor-pointer
    "
    :class="classNames"
    data-testid="completion-tracker-list-item"
    @click="$emit('select')"
  >
    <div
      class="
        flex
        flex--align-items-center
        flex-gap--2
      "
    >
      <span
        v-if="pStatus === 'completed'"
        class="
          p-completion-tracker-list-item__icon
          flex
          flex--shrink-0
        "
      >
        <PIcon
          pName="checkCircle"
          class="p-completion-tracker-list-item__check-icon font-size--20"
        />
      </span>
      <span
        v-else
        class="p-completion-tracker-list-item__circle flex--shrink-0"
      />
      <span
        class="
          p-completion-tracker-list-item__label
          font-size--14
          font-bold
        "
        data-testid="completion-tracker-list-item-label"
      >
        {{ pLabel }}
      </span>
      <template v-if="pSecondaryText !== undefined">
        <span
          class="
            p-completion-tracker-list-item__label
            font-size--14
            font-bold
          "
        >
          -
        </span>
        <span
          class="p-completion-tracker-list-item__secondary-text font-size--14"
          data-testid="completion-tracker-list-item-secondary"
        >
          {{ pSecondaryText }}
        </span>
      </template>
    </div>
    <PIcon
      pName="arrowRight"
      class="
        p-completion-tracker-list-item__arrow
        flex--shrink-0
        font-size--16
      "
    />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PIcon from '../PIcon'
import type { PCompletionTrackerListItemProps } from './PCompletionTrackerListItemTypes'

const props = withDefaults(defineProps<PCompletionTrackerListItemProps>(), {
  pStatus: 'pending',
  pSelected: false,
})

defineEmits<{
  select: []
}>()

const classNames = computed(() => ({
  [`p-completion-tracker-list-item--${props.pStatus}`]: true,
  'p-completion-tracker-list-item--selected': props.pSelected === true,
}))
</script>

<style lang="scss" scoped>
.p-completion-tracker-list-item {
  $self: &;
  padding: 12px 16px;
  border: 2px solid transparent;
  background: none;
  font-family: inherit;
  transition: all 200ms ease;

  &__circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 2px solid var(--p-gray-300);
    box-sizing: border-box;
  }

  &__icon {
    width: 20px;
    height: 20px;
  }

  &__check-icon {
    color: var(--p-green-800);
  }

  &__label {
    line-height: 1.2;
  }

  &__secondary-text {
    line-height: 1.5;
  }

  &__arrow {
    margin-left: 8px;
    color: var(--p-gray-500);
  }

  // Status: pending
  &--pending {
    background-color: var(--p-gray-50);

    #{$self}__label {
      color: var(--p-gray-900);
    }

    #{$self}__secondary-text {
      color: var(--p-gray-500);
    }
  }

  // Status: in-progress and selected (non-completed) share background/text colors.
  // Selected additionally gets a border via &--selected below.
  &--in-progress,
  &--selected:not(#{$self}--completed) {
    background-color: var(--p-jungle-75);

    #{$self}__circle {
      border-color: var(--p-jungle-400);
    }

    #{$self}__label {
      color: var(--p-gray-900);
    }

    #{$self}__secondary-text {
      color: var(--p-jungle-400);
    }

    #{$self}__arrow {
      color: var(--p-jungle-400);
    }
  }

  // Status: completed
  &--completed {
    background-color: var(--p-green-100);

    #{$self}__label {
      color: var(--p-green-800);
    }

    #{$self}__secondary-text {
      color: var(--p-green-800);
    }

    #{$self}__arrow {
      color: var(--p-green-800);
    }
  }

  // Selected state: adds border on top of the status colors
  &--selected {
    border-color: var(--p-jungle-400);
    box-shadow: 0 0 0 2px var(--p-jungle-100);
  }
}
</style>
