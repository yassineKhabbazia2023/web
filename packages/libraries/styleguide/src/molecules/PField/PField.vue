<template>
  <PFormItem
    :pProp="pFieldKey"
    :pLabel="formItemLabel"
    :pRules="pRules"
    :class="pCssClass"
    :data-testid="fieldTestId"
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
      :model-value="internalCheckboxValue"
      :pRounded="pRounded"
      :data-testid="pTestId"
      @update:model-value="onCheckboxToggle"
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
      :pSuffixIconName="pSuffixIconName"
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
      :pFilterable="pFilterable"
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
        v-model="internalRadioValue"
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
        :model-value="isChecked"
        @update:model-value="onCheckboxChange(index, $event)"
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
import type { PRadioValue } from '../../atoms/PRadio/PRadioTypes'
import { getInternalCheckboxOptions, getModelValueOnCheckboxChange } from './PFieldHelper'

const props = withDefaults(defineProps<Omit<PFieldProps<T>, 'modelValue'>>(), {
  pReadonly: false,
  pDisabled: undefined,
  pFilterable: false,
  pTestId: undefined,
  pDropdownOptions: () => [],
  pPlaceholder: undefined,
  pRules: () => [],
  pFormat: 'DD/MM/YYYY',
  pValueFormat: 'YYYY-MM-DD',
})

const modelValue = defineModel<T>()

const formItemLabel = computed(() => {
  return props.pFieldType !== 'checkbox' ? props.pLabel : ''
})

// Expose a stable hook on the form-item root (falls through to el-form-item) so
// tests can scope the field and its native el-form-item__error without touching the control's testid.
const fieldTestId = computed(() => {
  return props.pTestId !== undefined ? `${props.pTestId}-field` : undefined
})

const internalValue = computed({
  get() {
    return modelValue.value as T
  },
  set(value: T) {
    modelValue.value = value
  },
})

const internalCheckboxOptions = computed(() => {
  return getInternalCheckboxOptions(modelValue.value, props.pOptions ?? [])
})

const internalRadioValue = computed({
  get() {
    return modelValue.value as PRadioValue | undefined
  },
  set(value: PRadioValue | undefined) {
    modelValue.value = value as T
  },
})

const internalCheckboxValue = computed(() => {
  if (typeof modelValue.value === 'boolean') {
    return modelValue.value
  }

  return props.pChecked === true
})

const internalDate = computed({
  get() {
    return modelValue.value as string
  },
  set(value: Date | string) {
    const isoValue = value instanceof Date ? dayjs(value).format(props.pValueFormat) : value
    modelValue.value = isoValue as T
  },
})

function onCheckboxChange(optionIndex: number, isChecked: boolean) {
  const updatedModelValue = getModelValueOnCheckboxChange<T>(
    modelValue.value,
    props.pOptions ?? [],
    optionIndex,
    isChecked,
  )
  if (updatedModelValue !== undefined) {
    internalValue.value = updatedModelValue as T // "as T" is a temporary trick
  }
}

const onCheckboxToggle = (value: boolean) => {
  modelValue.value = value as T
}

const internalEmail = computed({
  get() {
    return modelValue.value as string
  },
  set(value: string) {
    modelValue.value = value as T
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
