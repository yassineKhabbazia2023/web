<template>
  <ElAutocomplete
    :placement="pPlacement"
    :clearable="pClearable"
    :disabled="pDisabled"
    :valueKey="pValueKey"
    :debounce="pDebounce"
    :placeholder="pPlaceholder"
    :triggerOnFocus="pTriggerOnFocus"
    :fetchSuggestions="fetchSuggestionsWithMinLength"
    :name="pName"
    :label="pLabel"
    :hideLoading="pHideLoading"
    :popperClass="pPopperClass"
    :teleported="pTeleported"
    :highlightFirstItem="pHighlightFirstItem"
    :fitInputWidth="pFitInputWidth"
    :selectWhenUnmatched="pSelectWhenUnmatched"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
    <template #prefix>
      <slot name="prefix" />
    </template>
    <template #suffix>
      <slot name="suffix" />
    </template>
  </ElAutocomplete>
</template>

<script lang="ts" setup>
import { ElAutocomplete } from 'element-plus'
import type { PAutocompleteProps } from './PAutocompleteTypes'

const props = withDefaults(defineProps<PAutocompleteProps>(), {
  pPlaceholder: undefined,
  pClearable: false,
  pDisabled: false,
  pMinLength: 0,
  pValueKey: 'value',
  pPlacement: 'bottom-start',
  pTriggerOnFocus: true,
  pSelectWhenUnmatched: false,
  pFetchSuggestions: undefined,
  pName: undefined,
  pLabel: undefined,
  pHideLoading: false,
  pPopperClass: undefined,
  pTeleported: true,
  pHighlightFirstItem: false,
  pFitInputWidth: false,
})

// Element Plus does not natively support a minimum character threshold on autocomplete
// (its `minlength` is only the native HTML input attribute), so we wrap fetchSuggestions
// to short-circuit with empty results until the query reaches pMinLength.
const fetchSuggestionsWithMinLength = (
  queryString: string,
  callback: (data: Record<string, any>[]) => void,
) => {
  if (queryString.length < props.pMinLength) {
    callback([])
    return
  }
  props.pFetchSuggestions?.(queryString, callback)
}
</script>
