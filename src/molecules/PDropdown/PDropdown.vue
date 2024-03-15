<template>
  <PSelect
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
    :popperClass="pPoppperClass"
    :reserveKeyword="pReserveKeyword"
    :defaultFirstOption="pDefaultFirstOption"
    :teleported="pTeleported"
    :persistent="pPersistent"
    :automaticDropdown="pAutomaticDropdown"
    :clearIcon="pClearIcon"
    :fitInputWidth="pFitInputWidth"
    :suffixIcon="pSuffixIcon"
    :suffixTransition="pSuffixTransition"
    :tagType="pTagType"
    :validateEvent="pValidateEvent"
    :placement="pPlacement"
    :maxCollapseTags="pMaxCollapseTags"
    :popperOptions="pPopperOptions"
    :ariaLabel="pAriaLabel"
  >
    <template v-if="!hasGroups">
      <POption
        v-for="({ pValue, pLabel, pDisabled }, index) in pOptions"
        :key="index"
        :pValue="pValue"
        :pLabel="pLabel"
        :pDisabled="pDisabled"
      />
    </template>
    <template v-if="hasGroups">
      <POptionGroup
        v-for="(group, groupIndex) in groups"
        :key="groupIndex"
        :pLabel="group.label"
      >
        <POption
          v-for="({ pValue, pLabel, pDisabled }, index) in group.options"
          :key="`${groupIndex}-${index}`"
          :pValue="pValue"
          :pLabel="pLabel"
          :pDisabled="pDisabled"
        />
      </POptionGroup>
    </template>
  </PSelect>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { PDropdownProps } from './PDropdownTypes'
import { getDropdownGroups, getHasGroups } from './PDropdownUtils'

const props = withDefaults(defineProps<PDropdownProps>(), {
  pAllowCreate: false,
  pAriaLabel: undefined,
  pAutocomplete: 'off',
  pAutomaticDropdown: false,
  pClearable: false,
  pClearIcon: undefined,
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
  pSuffixIcon: undefined,
  pSuffixTransition: true,
  pTagType: 'info',
  pTeleported: true,
  pValidateEvent: true,
  pValueKey: 'value',
  pPopperOptions: () => ({}),
})

const groups = computed(() => getDropdownGroups(props.pOptions))
const hasGroups = computed(() => getHasGroups(groups.value))
</script>
