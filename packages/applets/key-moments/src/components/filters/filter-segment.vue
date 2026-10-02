<template>
  <FilterField
    :label="label"
    :hint="hint"
    :testId="testId"
    :isInline="isInline"
  >
    <template #default="{ labelId }">
      <PSegmentedControl
        :pOptions="segments"
        :modelValue="selectedValue"
        :pDisabled="disabled === true"
        pSize="small"
        :pTestId="testId"
        :aria-labelledby="labelId"
        @update:model-value="value => emit('select', value)"
      />
    </template>
  </FilterField>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PSegmentedControl } from '@pulse/styleguide/components'
import FilterField from './filter-field.vue'
import type { PSegmentedControlOption } from '@pulse/styleguide/types'
import type { FilterOption, FilterValue } from '../../types/key-moments.types'

const props = defineProps<{
  label: string
  options: FilterOption[]
  selectedValue: FilterValue
  /** Stem of the `data-testid` of every option, suffixed by its own value */
  testId: string
  /** Displayed on the caption, to say why a locked group is locked */
  hint?: string
  /** Shown but not offered: the options read, none of them is pickable */
  disabled?: boolean
  /** Caption beside the control rather than above it */
  isInline?: boolean
}>()

const emit = defineEmits<{
  select: [FilterValue]
}>()

/** The styleguide names an option its own way; the applet keeps naming it its. */
const segments = computed<PSegmentedControlOption[]>(() => props.options
  .map(option => ({ pValue: option.value, pLabel: option.label })))
</script>
