<template>
  <div
    class="
      key-moments-filter-field
      flex
      flex-gap--2
    "
    :class="isInline ? 'flex--align-items-center' : 'flex--direction-column'"
  >
    <span
      class="
        flex
        flex--align-items-center
        flex-gap--1
      "
    >
      <span
        :id="labelId"
        class="
          key-moments-filter-field__label
          font-size--11
          font-bold
          text-uppercase
        "
      >
        {{ label }}
      </span>

      <!-- A control the reader cannot use says why, beside its name -->
      <PTooltip
        v-if="hint !== undefined"
        :pContent="hint"
        pPlacement="top"
      >
        <PIcon
          class="key-moments-filter-field__icon"
          pName="infoCircle"
          :data-testid="`${testId}-hint`"
        />
      </PTooltip>
    </span>
    <slot :labelId="labelId" />
  </div>
</template>

<script setup lang="ts">
import { PIcon, PTooltip } from '@pulse/styleguide/components'

const props = defineProps<{
  label: string
  /** Stem of the `data-testid` of the control, which names the caption too */
  testId: string
  /** Why the field reads the way it does; absent leaves the caption bare */
  hint?: string
  /** Caption beside the control rather than above it, for a one-line bar */
  isInline?: boolean
}>()

// The control is labelled by the visible caption, so a screen reader announces it once
const labelId = `${props.testId}-label`
</script>

<style scoped lang="scss">
.key-moments-filter-field {
  &__label {
    letter-spacing: 0.08em;
    color: var(--p-text-basic-heading);
  }

  &__icon {
    flex-shrink: 0;
    font-size: 12px;
    cursor: help;
    color: var(--p-text-basic-heading);
  }
}
</style>
