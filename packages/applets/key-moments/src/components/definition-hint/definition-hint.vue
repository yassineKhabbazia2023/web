<template>
  <!-- Focusable, so that a keyboard reader reaches the definition too -->
  <PTooltip
    :pContent="definition"
    pPlacement="top"
  >
    <span
      class="key-moments-definition-hint"
      tabindex="0"
      role="img"
      :aria-label="definition"
      :data-testid="testId"
    >
      <PIcon pName="questionCircle" />
    </span>
  </PTooltip>
</template>

<script setup lang="ts">
import { PIcon, PTooltip } from '@pulse/styleguide/components'

// The « ? » set beside the name of an indicator, which explains what it measures
defineProps<{
  definition: string
  testId: string
}>()
</script>

<style scoped lang="scss">
.key-moments-definition-hint {
  display: inline-flex;
  flex-shrink: 0;
  margin-left: 6px;
  font-size: 12px;
  vertical-align: middle;
  color: var(--p-text-neutral-neutral);
  cursor: help;
}
</style>
