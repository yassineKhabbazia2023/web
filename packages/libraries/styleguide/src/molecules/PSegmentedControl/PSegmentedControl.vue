<template>
  <div
    class="
      p-segmented-control
      flex
      flex-gap--1
    "
    role="group"
    :aria-label="pAriaLabel"
  >
    <PButton
      v-for="option in pOptions"
      :key="String(option.pValue)"
      :pSize="pSize"
      :pType="option.pValue === modelValue ? 'active' : 'white'"
      :pDisabled="pDisabled"
      :aria-pressed="option.pValue === modelValue"
      :pTestId="pTestId === undefined ? undefined : `${pTestId}-${option.pValue}`"
      @click="select(option.pValue)"
    >
      {{ option.pLabel }}
    </PButton>
  </div>
</template>

<script setup lang="ts">
import PButton from '../../atoms/PButton'
import type { PSegmentedControlProps, PSegmentedControlValue } from './PSegmentedControlTypes'

withDefaults(defineProps<PSegmentedControlProps>(), {
  pDisabled: false,
  pSize: 'default',
  pAriaLabel: undefined,
  pTestId: undefined,
})

/**
 * Required, because the choice is: a segmented control always reads on one of
 * its options, so a caller always has a value to render. Nothing here ever
 * hands back `undefined`.
 */
const modelValue = defineModel<PSegmentedControlValue>({ required: true })

/**
 * An exclusive choice is never emptied: picking the option already selected
 * changes nothing. This is what separates the control from a group of filters,
 * where clicking the selected one removes it and leaves no value at all —
 * a state a caller reading its model has no way to render.
 */
function select(value: PSegmentedControlValue): void {
  if (value === modelValue.value) {
    return
  }

  modelValue.value = value
}
</script>
