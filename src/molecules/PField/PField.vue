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
      :pAutosize="pAutosize"
      :data-testid="pTestId"
    />
    <PDropdown
      class="flex--grow-1"
      v-if="pFieldType === 'dropdown'"
      v-model="internalValue"
      :pOptions="pDropdownOptions"
      :pReadonly="pReadonly"
      :pDisabled="pDisabled"
      :pPlaceholder="pPlaceholder"
      :pMultiple="pMultiple"
      :data-testid="pTestId"
    />
    <PDatePicker
      v-if="pFieldType === 'date'"
      class="flex--grow-1"
      v-model="internalDate"
      :pType="pDateType"
      :pReadonly="pReadonly"
      :pDisabled="pDisabled"
      :pPlaceholder="pPlaceholder"
      :pFormat="pFormat"
      :pValueFormat="pValueFormat"
      :data-testid="pTestId"
    />
  </PFormItem>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue'
import PDatePicker from '@/atoms/PDatePicker'
import PDropdown from '@/molecules/PDropdown'
import PFormItem from '@/atoms/PFormItem'
import PInput from '@/atoms/PInput'
import dayjs from 'dayjs'
import type { PFieldProps } from './PFieldTypes'

const props = withDefaults(defineProps<PFieldProps<T>>(), {
  modelValue: undefined,
  pReadonly: false,
  pDisabled: false,
  pTestId: undefined,
  pDropdownOptions: () => [],
  pPlaceholder: '',
  pRules: () => [],
  pFormat: 'DD/MM/YYYY',
  pValueFormat: 'YYYY-MM-DD',
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
  },
})

const internalDate = computed({
  get() {
    return props.modelValue as string
  },
  set(value: Date|string) {
    const isoValue = value instanceof Date ? dayjs(value).format(props.pValueFormat) : value
    emit('update:model-value', isoValue as T)
  },
})
</script>
