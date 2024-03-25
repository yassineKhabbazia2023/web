<template>
  <ElSelect
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
    <template #header>
      <slot name="header" />
    </template>
    <slot />
  </ElSelect>
</template>

<script lang="ts" setup>
import { ElSelect } from 'element-plus'
import type { PSelectProps } from './PSelectTypes'

withDefaults(defineProps<PSelectProps>(), {
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
</script>
