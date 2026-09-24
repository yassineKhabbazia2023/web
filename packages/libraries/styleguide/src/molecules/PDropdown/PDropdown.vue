<template>
  <ElSelect
    v-model="internalModelValue"
    :class="{ 'p-dropdown--selected-value-display': shouldDisplaySelectedValueAsPlaceholder }"
    :multiple="pMultiple"
    :disabled="pDisabled"
    :valueKey="pValueKey"
    :size="pSize"
    :clearable="pClearable"
    :collapseTags="pCollapseTags"
    :collapseTagsTooltip="pCollapseTagsTooltip"
    :multipleLimit="pMultipleLimit"
    :name="pName"
    :effect="pEffect"
    :autocomplete="pAutocomplete"
    :placeholder="displayedPlaceholder"
    :filterable="pFilterable"
    :allowCreate="pAllowCreate"
    :filterMethod="pFilterMethod"
    :remote="pRemote"
    :remoteMethod="pRemoteMethod"
    :remoteShowSuffix="pRemoteShowSuffix"
    :loading="pLoading"
    :loadingText="pLoadingText"
    :noMatchText="pNoMatchText"
    :noDataText="pNoDataText"
    :popperClass="pPopperClass"
    :reserveKeyword="pReserveKeyword"
    :defaultFirstOption="pDefaultFirstOption"
    :teleported="pTeleported"
    :persistent="pPersistent"
    :automaticDropdown="pAutomaticDropdown"
    :fitInputWidth="pFitInputWidth"
    :tagType="pTagType"
    :validateEvent="pValidateEvent"
    :placement="pPlacement"
    :maxCollapseTags="pMaxCollapseTags"
    :popperOptions="pPopperOptions"
    :ariaLabel="pAriaLabel"
    :data-testid="pTestId"
    @change="emit('change', $event)"
  >
    <template
      v-if="pCheckAllLabel"
      #header
    >
      <PCheckbox v-model="internalIsCheckAll">
        {{ pCheckAllLabel }}
      </PCheckbox>
    </template>
    <template
      v-if="$slots.empty !== undefined"
      #empty
    >
      <slot name="empty" />
    </template>
    <template v-if="!hasGroups">
      <ElOption
        v-for="({ pValue, pLabel, pDisabled, pDescription, internalValue }, index) in internalOptions"
        :key="index"
        :value="pValue"
        :label="pLabel"
        :disabled="pDisabled"
        :class="{
          'height--inherit': pHasRadioButton,
          'line-height--inherit': pHasRadioButton,
        }"
      >
        <div
          v-if="pMultiple === true && pHasRadioButton === false"
          class="
            p-dropdown__option-item
            flex
            flex--align-items-center
          "
        >
          <PCheckbox
            :model-value="getIsOptionSelected(internalValue)"
            class="p-dropdown__option-item__checkbox margin-right--2"
          />
          <span class="p-dropdown__option-item__label">
            {{ pLabel }}
          </span>
        </div>
        <div
          v-if="pHasRadioButton === true"
          class="
            flex
            flex--align-items-center
            margin-y--2
          "
        >
          <PRadio
            :model-value="internalModelValue"
            :pLabel="internalValue"
            class="
              p-dropdown--with-radio-button__option-item__radio
              margin-x--2
            "
          />
          <ul
            class="
              flex
              flex--direction-column
              list-style-none
         "
          >
            <li
              class="font-semibold"
              :class="{
                'text-color--jungle-400': internalModelValue === pValue,
              }"
            >
              {{ pLabel }}
            </li>
            <li
              v-if="pDescription !== undefined && pDescription !== ''"
              class="text-wrap--wrap"
            >
              {{ pDescription }}
            </li>
          </ul>
        </div>
      </ElOption>
    </template>
    <template v-if="hasGroups">
      <ElOptionGroup
        v-for="(group, groupIndex) in groups"
        :key="groupIndex"
        :label="group.label"
      >
        <ElOption
          v-for="({ pValue, pLabel, pDisabled }, index) in group.options"
          :key="`${groupIndex}-${index}`"
          :value="pValue"
          :label="pLabel"
          :disabled="pDisabled"
        >
          <div
            v-if="pMultiple === true && pHasRadioButton === false"
            class="
              p-dropdown__option-item
              flex
              flex--align-items-center
            "
          >
            <PCheckbox
              :model-value="getIsOptionSelected(pValue)"
              class="p-dropdown__option-item__checkbox margin-right--2"
            />
            <span class="p-dropdown__option-item__label">
              {{ pLabel }}
            </span>
          </div>
        </ElOption>
      </ElOptionGroup>
    </template>
  </ElSelect>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { ElSelect, ElOptionGroup, ElOption, useFormDisabled } from 'element-plus'
import PCheckbox from '../../atoms/PCheckbox'
import PRadio from '../../atoms/PRadio'
import type { PDropdownProps } from './PDropdownTypes'
import {
  getDropdownGroups,
  getHasGroups,
  getIsCheckAll,
  getAllEnabledValues,
  getInternalOptions,
} from './PDropdownUtils'

const props = withDefaults(defineProps<PDropdownProps>(), {
  pAllowCreate: false,
  pAriaLabel: undefined,
  pAutocomplete: 'off',
  pAutomaticDropdown: false,
  pClearable: false,
  pCollapseTags: false,
  pCollapseTagsTooltip: false,
  pDefaultFirstOption: false,
  pDisabled: undefined,
  pEffect: 'light',
  pFilterable: false,
  pFilterMethod: undefined,
  pFitInputWidth: false,
  pLoading: false,
  pLoadingText: undefined,
  pMaxCollapseTags: 1,
  pMultiple: false,
  pMultipleLimit: 0,
  pName: undefined,
  pNoDataText: undefined,
  pNoMatchText: undefined,
  pPersistent: true,
  pPlaceholder: undefined,
  pPlacement: 'bottom-start',
  pPopperClass: '',
  pRemote: false,
  pRemoteMethod: undefined,
  pRemoteShowSuffix: false,
  pReserveKeyword: true,
  pSize: undefined,
  pTagType: 'info',
  pTeleported: true,
  pValidateEvent: true,
  pValueKey: 'value',
  pPopperOptions: () => ({}),
  pTestId: undefined,
})

const emit = defineEmits<{
  'update:modelValue': [PDropdownProps['modelValue']]
  'change': [any]
}>()

// Element Plus 2.4 normalized a non-array modelValue to [] in multiple mode; 2.14 no longer does
// and would keep the scalar around (e.g. castArray('') giving [''] on the first selection).
if (props.pMultiple === true && Array.isArray(props.modelValue) === false) {
  emit('update:modelValue', [])
}

const groups = computed(() => getDropdownGroups(props.pOptions))
const hasGroups = computed(() => getHasGroups(groups.value))
const hasArrayModelValue = computed(() => (
  Array.isArray(props.modelValue)
  && props.modelValue.length > 0
))
const hasScalarModelValue = computed(() => (
  Array.isArray(props.modelValue) === false
  && isNotNullNorEmpty(props.modelValue)
))
// pDisabled may be undefined so the disabled state can also come from the ElForm context.
const isEffectivelyDisabled = useFormDisabled(computed(() => props.pDisabled))
const shouldDisplaySelectedValueAsPlaceholder = computed(() => {
  const isDisabled = isEffectivelyDisabled.value
  const isMultiple = props.pMultiple

  if (isDisabled === true || isMultiple === true) {
    return false
  }

  const hasScalarSelectedValue = hasScalarModelValue.value
  const hasNonCreatableArraySelectedValue = props.pAllowCreate === false
    && hasArrayModelValue.value

  return hasScalarSelectedValue || hasNonCreatableArraySelectedValue
})
const displayedPlaceholder = computed(() => {
  if (hasArrayModelValue.value && props.pAllowCreate === false) {
    return props.modelValue.join(',')
  }

  return props.pPlaceholder
})
const internalIsCheckAll = computed({
  get: () => getIsCheckAll(props.pOptions, props.modelValue),
  set: (isCheckAll: boolean) => {
    internalModelValue.value = isCheckAll ? getAllEnabledValues(props.pOptions) : []
  },
})

const internalModelValue = computed({
  get: () => props.modelValue,
  set: (modelValue: PDropdownProps['modelValue']) => {
    emit('update:modelValue', modelValue)
  },
})

const internalOptions = computed(() => getInternalOptions(props.pOptions))

function getIsOptionSelected(optionInternalValue: unknown) {
  if (props.pMultiple === false || Array.isArray(internalModelValue.value) === false) {
    return false
  }

  return internalModelValue.value.some((selectedOptionValue) => {
    if (typeof selectedOptionValue === 'object' && selectedOptionValue !== null) {
      return selectedOptionValue[props.pValueKey] === optionInternalValue
    }

    return selectedOptionValue === optionInternalValue
  })
}
</script>

<style lang="scss" scoped>
.p-dropdown {
  &__option-item {
    height: 100%;

    &__checkbox {
      display: flex;
      align-items: center;
      height: 100%;
      pointer-events: none;
    }

    &__label {
      display: flex;
      align-items: center;
      min-height: 100%;
      line-height: 1.2;
    }
  }

  &--with-radio-button {
    &__option-item {
      &__radio {
        :deep(.el-radio__label) {
          display: none;
        }
      }
    }
  }
}
</style>
