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
      :pCheckAllLabel="pCheckAllLabel"
      v-model:pIsCheckAll="internalIsCheckAll"
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
    <div
      v-if="pFieldType === 'radio' && !pMultiple"
      class="flex"
      :class="{
        'flex--direction-column': pFlexColumn,
        'flex-gap--2': pFlexColumn,
      }"
    >
      <PRadio
        v-model="internalValue"
        v-for="(pOption, index) in pOptions"
        :key="index"
        :pLabel="pOption.pValue"
        :pName="pName"
        :pBorder="pBorder"
        :pSize="pSize"
        :pDisabled="pDisabled"
      >
        {{ pOption.pLabel }}
      </PRadio>
    </div>
    <div
      v-if="pFieldType === 'radio' && pMultiple"
      class="flex"
      :class="{
        'flex--direction-column': pFlexColumn,
        'flex-gap--2': pFlexColumn,
      }"
    >
      <PCheckbox
        :checked="pOption.pValue === modelValue"
        v-for="(pOption, index) in pOptions"
        :key="index"
        @change="onCheckboxChange(index, $event)"
      >
        {{ pOption.pLabel }}
      </PCheckbox>
    </div>
  </PFormItem>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue'
import PDatePicker from '@/atoms/PDatePicker'
import PDropdown from '@/molecules/PDropdown'
import PFormItem from '@/atoms/PFormItem'
import PInput from '@/atoms/PInput'
import PRadio from '@/atoms/PRadio'
import PCheckbox from '@/atoms/PCheckbox'
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
  'update:p-is-check-all': [boolean]
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

function onCheckboxChange(optionIndex: number, isChecked: boolean) {
  const option = props.pOptions?.at(optionIndex)
  const value = option?.pValue
  if (value === undefined) {
    throw new Error('optionsIndex is out of range')
  }
  const modelValue = Array.isArray(props.modelValue) ? [...props.modelValue] : []

  if (isChecked && !modelValue.includes(value)) {
    modelValue.push(value)
    internalValue.value = modelValue as T // "as T" is a temporary trick
  }
  if (!isChecked && modelValue.includes(value)) {
    modelValue.splice(optionIndex, 1)
    internalValue.value = modelValue as T // "as T" is a temporary trick
  }
}
const internalIsCheckAll = computed({
  get: () => props.pIsCheckAll,
  set: (isCheckAll: boolean) => emit('update:p-is-check-all', isCheckAll),
})
</script>

<style lang="scss" scoped>
.flex--direction-column {
  :deep(.el-radio),
  :deep(.el-checkbox) {
    height: inherit;
    line-height: 1.2;
  }
}
</style>
