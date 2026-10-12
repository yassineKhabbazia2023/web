<template>
  <button
    type="button"
    class="
      p-completion-tracker-list-item
      flex
      flex--align-items-center
      flex--justify-content-space-between
      width--100
      height--12
      padding-y--0
      padding-x--4
      text-left
      cursor-pointer
    "
    :class="classNames"
    data-testid="completion-tracker-list-item"
    @click="$emit('select')"
  >
    <div
      class="
        p-completion-tracker-list-item__content
        flex
        flex--align-items-center
        flex-gap--2
        min-width--0
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
          pName="checkCircleFill"
          class="p-completion-tracker-list-item__check-icon font-size--14"
        />
      </span>
      <span
        v-else
        class="p-completion-tracker-list-item__circle flex--shrink-0"
      />
      <span class="p-completion-tracker-list-item__text min-width--0">
        <span
          class="
            p-completion-tracker-list-item__label
            font-size--14
            font-semibold
            line-height--inherit
          "
          data-testid="completion-tracker-list-item-label"
        >
          {{ pLabel }}
        </span>
        <span
          v-if="pSecondaryText !== undefined"
          class="
            p-completion-tracker-list-item__secondary-text
            font-size--14
            font-semibold
            line-height--inherit
            margin-left--1
          "
          data-testid="completion-tracker-list-item-secondary"
        >
          {{ pSecondaryText }}
        </span>
      </span>
    </div>
    <PIcon
      pName="arrowRight"
      class="
        p-completion-tracker-list-item__arrow
        flex--shrink-0
        font-size--16
        margin-left--2
      "
    />
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import PIcon from '../PIcon'
import type { PCompletionTrackerListItemProps } from './PCompletionTrackerListItemTypes'

const props = withDefaults(defineProps<PCompletionTrackerListItemProps>(), {
  pStatus: 'incomplete',
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
  border: 2px solid transparent;
  border-radius: 0;
  background: none;
  font-family: inherit;
  transition: all 200ms ease;

  &__circle {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid var(--p-stroke-basic-secondary);
    box-sizing: border-box;
  }

  &__check-icon {
    color: var(--p-icon-basic-success);
  }

  &__text {
    line-height: 1.15;
  }

  &__secondary-text {
    color: var(--p-jungle-400);
  }

  &__arrow {
    color: var(--p-gray-500);
  }

  // Status: incomplete (unselected)
  &--incomplete {
    background-color: var(--p-gray-50);

    #{$self}__label {
      color: var(--p-text-basic-heading);
    }

    #{$self}__arrow {
      color: var(--p-icon-basic-secondary);
    }
  }

  // Status: incomplete + selected
  &--incomplete#{$self}--selected {
    background-color: var(--p-jungle-75);
    border-color: var(--p-jungle-400);

    #{$self}__circle {
      border-color: var(--p-jungle-400);
    }

    #{$self}__arrow {
      color: var(--p-jungle-400);
    }
  }

  // Status: completed (unselected)
  &--completed {
    background-color: var(--p-surface-basic-success);

    #{$self}__label {
      color: var(--p-text-basic-success);
    }

    #{$self}__arrow {
      color: var(--p-icon-basic-success);
    }
  }

  // Status: completed + selected
  &--completed#{$self}--selected {
    border-color: var(--p-jungle-400);
  }
}
</style>
