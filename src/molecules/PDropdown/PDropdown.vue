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
  pMultiple: false,
  pDisabled: false,
  pValueKey: 'value',
  pSize: undefined,
  pClearable: false,
  pCollapseTags: false,
  pCollapseTagsTooltip: false,
  pMultipleLimit: 0,
  pName: undefined,
  pEffect: 'light',
  pAutocomplete: 'off',
  pPlaceholder: undefined,
  pFilterable: false,
  pAllowCreate: false,
  pFilterMethod: undefined,
  pRemote: false,
  pRemoteMethod: undefined,
  pRemoteShowSuffix: false,
  pLoading: false,
  pLoadingText: undefined,
  pNoMatchText: undefined,
  pNoDataText: undefined,
  pPoppperClass: '',
  pReserveKeyword: true,
  pDefaultFirstOption: false,
  pTeleported: true,
  pPersistent: true,
  pAutomaticDropdown: false,
  pClearIcon: undefined,
  pFitInputWidth: false,
  pSuffixIcon: undefined,
  pSuffixTransition: true,
  pTagType: 'info',
  pValidateEvent: true,
  pPlacement: 'bottom-start',
  pMaxCollapseTags: 1,
  pPopperOptions: () => ({}),
  pAriaLabel: undefined,
})

const groups = computed(() => getDropdownGroups(props.pOptions))
const hasGroups = computed(() => getHasGroups(groups.value))
</script>
