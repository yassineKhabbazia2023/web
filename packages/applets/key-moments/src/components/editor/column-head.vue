<template>
  <span
    class="key-moments-editor-list__cell key-moments-column-head"
    :class="cellClass"
  >
    <!-- A single child, so that the elastic columns do not push label and marker apart -->
    <span
      class="
        flex
        flex--align-items-center
        flex-gap--1
        min-width--0
      "
    >
      <span
        class="
          overflow-hidden
          text-overflow--ellipsis
          no-wrap
        "
      >
        {{ label }}
      </span>

      <PTooltip
        :pContent="hint"
        pPlacement="top"
      >
        <PIcon
          class="key-moments-column-head__icon"
          pName="infoCircle"
          :data-testid="`${testId}-hint`"
        />
      </PTooltip>
    </span>
  </span>
</template>

<script setup lang="ts">
import { PIcon, PTooltip } from '@pulse/styleguide/components'

defineProps<{
  label: string
  hint: string
  /** Width class of the column, shared with the rows below */
  cellClass: string
  testId: string
}>()
</script>

<style scoped lang="scss">
.key-moments-column-head {
  // The label may be clipped, the marker beside it never is
  &__icon {
    flex-shrink: 0;
    font-size: 12px;
    cursor: help;
  }
}
</style>
