<template>
  <Story title="2. Atoms/ExpandableSearch" icon="tabler:search">
    <Variant title="Basic Usage">
      <PExpandableSearch
        :pPlaceholder="placeholder"
        :pIsSearchShrinkable ="pIsSearchShrinkable "
        :pIsSearchOpen="pIsSearchOpen"
        @input="logEvent('input', $event)"
        @search-expand-change="logEvent('search-expand-change', $event)"
        @enter="logEvent('enter', $event)"
      />
      <template #controls>
        <HstText v-model="placeholder" title="Placeholder" />
        <HstCheckbox v-model="pIsSearchShrinkable " title="pIsSearchShrinkable "/>
        <HstCheckbox v-model="pIsSearchOpen " title="pIsSearchOpen "/>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'
import PExpandableSearch from './'
import { ref } from 'vue'

const placeholder = ref('')
const pIsSearchShrinkable = ref(true)
const pIsSearchOpen = ref(false)
</script>
