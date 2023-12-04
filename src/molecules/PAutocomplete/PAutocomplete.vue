<template>
  <ElAutocomplete
    :placement="pPlacement"
    :clearable="pClearable"
    :disabled="pDisabled"
    :valueKey="pValueKey"
    :debounce="pDebounce"
    :placeholder="pPlaceholder"
    :triggerOnFocus="pTriggerOnFocus"
    :fetchSuggestions="pFetchSuggestion"
    :name="pName"
    :label="pLabel"
    :hideLoading="pHideLoading"
    :popperClass="pPopperClass"
    :teleported="pTeleported"
    :highlightFirstItem="pHighlightFirstItem"
    :fitInputWidth="pFitInputWidth"
  >
    <slot />
  </ElAutocomplete>
</template>

<script lang="ts" setup>
import { ElAutocomplete } from 'element-plus'
import type { PAutocompleteProps } from './PAutocompleteTypes'

withDefaults(defineProps<PAutocompleteProps>(), {
  pPlaceholder: '',
  pClearable: false,
  pDisabled: false,
  pValueKey: 'value',
  pDebounce: 300,
  pPlacement: 'bottom-start',
  pTriggerOnFocus: true,
  pSelectWhenUnmatched: false,
  pFetchSuggestion: undefined,
  pName: '',
  pLabel: '',
  pHideLoading: false,
  pPopperClass: '',
  pTeleported: true,
  pHighlightFirstItem: false,
  pFitInputWidth: false
})
</script>
