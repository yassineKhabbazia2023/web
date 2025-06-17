<template>
  <Story
    title="4. Organisms/PFormSearch"
    :layout="{
      type: 'single',
      iframe: true
    }"
  >
    <Variant title="Default">
      <PFormSearch
        :pSearch="search"
        :pPlaceholder="placeholder"
        :pAutofocus="autofocus"
        :pMinLength="minLength"
        :pSize="size"
        :pClearable="isClearable"
        :pDebounceDelay="debounceDelay"
        :pSearchInvalidMessage="searchInvalidMessage"
        @update:p-search="onUpdateSearch"
      />
      <template #controls>
        <HstText v-model="placeholder" title="Placeholder" />
        <HstCheckbox v-model="autofocus" title="Autofocus" />
        <HstNumber v-model="minLength" title="minLength" />
        <HstSelect
          v-model="size"
          :options="sizes"
          title="Size"
        />
        <HstCheckbox v-model="isClearable" title="Clearable" />
        <HstNumber v-model="debounceDelay" title="Debounce Delay (ms)" />
      </template>
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { logEvent } from 'histoire/client'
import type { PFormSearchProps } from './PFormSearch.types'

import PFormSearch from '.'

const search = ref('')
const isClearable = ref(false)
const autofocus = ref(false)
const debounceDelay = ref(100)
const minLength = ref(3)
const placeholder = ref('veuillez saisir la valeur de recherche')
const searchInvalidMessage = ref('Minimum 3 caractères')
const size = ref<PFormSearchProps['pSize']>()

const sizes: PFormSearchProps['pSize'][] = ['large', 'default', 'small']

function onUpdateSearch(value: string) {
  search.value = value
  logEvent('update:pSearch', value)
}
</script>
