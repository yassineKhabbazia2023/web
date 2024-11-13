<template>
  <Story title="3. Molecules/Autocomplete" icon="ph:list-dashes">
    <Variant title="Basic Usage">
      <PAutocomplete
        v-model="state"
        :pClearable="clearable"
        pPlaceholder="Please Input"
        @select="handleSelect"
        :pFetchSuggestions="querySearch"
        :pTriggerOnFocus="triggerOnFocus"
      >
        <template #prefix>
          <PIcon pName="search" />
        </template>
        <template #default="{ item }">
          <div class="value">
            {{ item.value }}
          </div>
          <span class="link">
            {{ item.link }}
          </span>
        </template>
      </PAutocomplete>
      <template #controls>
        <HstCheckbox v-model="clearable" title="Clearable" />
        <HstCheckbox v-model="triggerOnFocus" title="Trigger on focus" />
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { logEvent } from 'histoire/client'
import PIcon from '../../atoms/PIcon'
import PAutocomplete from '../../molecules/PAutocomplete'

interface LinkItem {
  value: string
  link: string
}
const clearable = ref(true)
const triggerOnFocus = ref(false)
const state = ref('')
const links = ref<LinkItem[]>([])

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value
  // call callback function to return suggestion objects
  cb(results)
}

function createFilter(queryString: string) {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

function handleSelect(value: any) {
  logEvent('select', value)
}

onMounted(() => {
  links.value = loadAll()
})
</script>

<docs lang="md">
## Basic usage

You can get some recommended tips based on the current input.

Autocomplete component provides input suggestions. The `fetch-suggestions` attribute is a method that returns suggested input. In this example, `querySearch(queryString, cb)` returns suggestions to Autocomplete via `cb(data)` when suggestions are ready.

## Custom template

Customize how suggestions are displayed.

Use `scoped slot` to customize suggestion items. In the scope, you can access the suggestion object via the `item` key.

## Remote search

Search data from server-side.

<div class="reponsive-iframe-container">
  <iframe class="reponsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D4229%253A15195%26mode%3Ddev" allowfullscreen></iframe>
</div>
</docs>
