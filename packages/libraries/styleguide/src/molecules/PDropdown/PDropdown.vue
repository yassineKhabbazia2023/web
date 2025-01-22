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
        v-for="({ pValue, pLabel, pDisabled }, index) in pOptions"
        :key="index"
        :value="pValue"
        :label="pLabel"
        :disabled="pDisabled"
      />
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
import type { PDropdownProps } from './PDropdownTypes'
import { getDropdownGroups, getHasGroups, getIsCheckAll, getAllEnabledValues } from './PDropdownUtils'

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
</script>
