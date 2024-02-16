<template>
  <PFormItem
    :pProp="pFieldKey"
    :pLabel="pLabel"
    :pRules="pRules"
    :class="pCssClass"
    class="flex"
  >
    <PInput
      v-if="pFieldType === 'input'"
      v-model="internalValue"
      :pType="pType"
      :pReadonly="pReadonly"
      :pDisabled="pDisabled"
      :pPlaceholder="pPlaceholder"
    />
    <PDropdown
      class="flex--grow-1"
      v-if="pFieldType === 'dropdown'"
      v-model="internalValue"
      :pOptions="pDropdownOptions"
      :pReadonly="pReadonly"
      :pDisabled="pDisabled"
      :pPlaceholder="pPlaceholder"
    />
    <PDatePicker
      v-if="pFieldType === 'date'"
      class="flex--grow-1"
      v-model="internalDate"
      :pReadonly="pReadonly"
      :pDisabled="pDisabled"
      :pPlaceholder="pPlaceholder"
    />
  </PFormItem>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue'
import PDatePicker from '@/atoms/PDatePicker'
import PDropdown from '@/molecules/PDropdown'
import PFormItem from '@/atoms/PFormItem'
import PInput from '@/atoms/PInput'
import type { PFieldProps } from './PFieldTypes'

const props = withDefaults(defineProps<PFieldProps<T>>(), {
  modelValue: undefined,
  pReadonly: false,
  pDisabled: false,
  pDropdownOptions: () => [],
  pPlaceholder: '',
  pRules: () => []
})

const emit = defineEmits<{
  'update:model-value': [T]
}>()

const internalValue = computed({
  get() {
    return props.modelValue as T
  },
  set(value: T) {
    emit('update:model-value', value)
  }
})

const internalDate = computed({
  get() {
    return props.modelValue as string
  },
  set(value: Date|string) {
    const isoValue = value instanceof Date ? value.toISOString().substring(0, 10) : value
    emit('update:model-value', isoValue as T)
  }
})
</script>
