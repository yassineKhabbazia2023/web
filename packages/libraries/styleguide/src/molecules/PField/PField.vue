<template>
  <PFormItem
    :pProp="pFieldKey"
    :pLabel="formItemLabel"
    :pRules="pRules"
    :class="pCssClass"
    class="flex"
  >
    <PEmailInputField
      v-if="pFieldType === 'email-input'"
      v-model="internalEmail"
      :pDefaultDomainPart="pDefaultDomainPart"
      :pLocalPartPlaceholder="pLocalPartPlaceholder"
      :pDomainPartPlaceholder="pDomainPartPlaceholder"
      :pLocalPartDisabled="pLocalPartDisabled"
      :pDomainPartDisabled="pDomainPartDisabled"
      :data-testid="pTestId"
    />
    <PCheckbox
      v-if="pFieldType === 'checkbox'"
      @change="onCheckboxToggle"
    >
      {{ pLabel }}
    </PCheckbox>
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
      v-if="pFieldType === 'dropdown'"
      v-model="internalValue"
      class="flex--grow-1"
      :pOptions="pDropdownOptions"
      :pReadonly="pReadonly"
      :pDisabled="pDisabled"
      :pPlaceholder="pPlaceholder"
      :pMultiple="pMultiple"
      :data-testid="pTestId"
      :pCheckAllLabel="pCheckAllLabel"
      :pCollapseTags="pCollapseTags"
      :pCollapseTagsTooltip="pCollapseTagsTooltip"
    />
    <PDatePicker
      v-if="pFieldType === 'date'"
      v-model="internalDate"
      class="flex--grow-1"
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
        v-for="(pOption, index) in pOptions"
        :key="index"
        v-model="internalValue"
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
        v-for="({ isChecked, label }, index) in internalCheckboxOptions"
        :key="index"
        :modelValue="isChecked"
        @change="onCheckboxChange(index, $event)"
      >
        {{ label }}
      </PCheckbox>
    </div>
  </PFormItem>
</template>

<script setup lang="ts" generic="T">
import { computed } from 'vue'
import PDatePicker from '../../atoms/PDatePicker'
import PDropdown from '../../molecules/PDropdown'
import PFormItem from '../../atoms/PFormItem'
import PInput from '../../atoms/PInput'
import PRadio from '../../atoms/PRadio'
import PCheckbox from '../../atoms/PCheckbox'
import PEmailInputField from '../../atoms/PEmailInputField'
import dayjs from 'dayjs'
import type { PFieldProps } from './PFieldTypes'
import { getInternalCheckboxOptions, getModelValueOnCheckboxChange } from './PFieldHelper'

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

const formItemLabel = computed(() => {
  return props.pFieldType != 'checkbox' ? props.pLabel : ''
})

const internalValue = computed({
  get() {
    return props.modelValue as T
  },
  set(value: T) {
    emit('update:model-value', value)
  },
})

const internalCheckboxOptions = computed(() => getInternalCheckboxOptions(props.modelValue, props.pOptions ?? []))

const internalDate = computed({
  get() {
    return props.modelValue as string
  },
  set(value: Date | string) {
    const isoValue = value instanceof Date ? dayjs(value).format(props.pValueFormat) : value
    emit('update:model-value', isoValue as T)
  },
})

function onCheckboxChange(optionIndex: number, isChecked: boolean) {
  const modelValue = getModelValueOnCheckboxChange<T>(props.modelValue, props.pOptions ?? [], optionIndex, isChecked)
  if (modelValue) {
    internalValue.value = modelValue as T // "as T" is a temporary trick
  }
}

const onCheckboxToggle = (value: boolean) => {
  emit('update:model-value', value as T)
}

const internalEmail = computed({
  get() {
    return props.modelValue as string
  },
  set(value: string) {
    emit('update:model-value', value as T)
  },
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
