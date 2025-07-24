<template>
  <ElSelect
    v-model="internalModelValue"
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
    :placeholder="pPlaceholder"
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
    :suffixTransition="pSuffixTransition"
    :tagType="pTagType"
    :validateEvent="pValidateEvent"
    :placement="pPlacement"
    :maxCollapseTags="pMaxCollapseTags"
    :popperOptions="pPopperOptions"
    :ariaLabel="pAriaLabel"
    @change="emit('change', $event)"
  >
    <template
      v-if="pCheckAllLabel"
      #header
    >
      <PCheckbox
        v-model="internalIsCheckAll"
        @change="internalIsCheckAll = $event"
      >
        {{ pCheckAllLabel }}
      </PCheckbox>
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
              margin-left--2
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
                'text-color--base-persian': internalModelValue === pValue,
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
        />
      </ElOptionGroup>
    </template>
  </ElSelect>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { ElSelect, ElOptionGroup, ElOption } from 'element-plus'
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
  pDisabled: false,
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
  pPoppperClass: '',
  pRemote: false,
  pRemoteMethod: undefined,
  pRemoteShowSuffix: false,
  pReserveKeyword: true,
  pSize: undefined,
  pSuffixTransition: true,
  pTagType: 'info',
  pTeleported: true,
  pValidateEvent: true,
  pValueKey: 'value',
  pPopperOptions: () => ({}),
})

const emit = defineEmits<{
  'update:modelValue': [PDropdownProps['modelValue']]
  'change': [any]
}>()

const groups = computed(() => getDropdownGroups(props.pOptions))
const hasGroups = computed(() => getHasGroups(groups.value))
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
</script>

<style lang="scss" scoped>
.p-dropdown {
  &--with-radio-button {
    &__option-item {
      &__radio {
        margin-right: 8px;
        color: red;
        :deep(.el-radio__label) {
          display: none;
        }
      }
    }
  }
}
</style>
