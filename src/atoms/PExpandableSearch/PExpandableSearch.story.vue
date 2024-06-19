<template>
  <Story title="2. Atoms/ExpandableSearch" icon="tabler:search">
    <Variant title="Basic Usage">
      <PExpandableSearch
        :pPlaceholder="pPlaceholder"
        v-model:pSearchContent="pSearchContent"
        :pIsSearchShrinkable ="pIsSearchShrinkable "
        :pIsSearchOpen="pIsSearchOpen"
        pType="default"
        :pFocusOnExpand="pFocusOnExpand"
        @update:p-search-content="logEvent('input', $event)"
        @search-expand-change="logEvent('search-expand-change', $event)"
        @enter="logEvent('enter', $event)"
      />
      <template #controls>
        <HstText v-model="pPlaceholder" title="Placeholder" />
        <HstCheckbox v-model="pIsSearchShrinkable " title="pIsSearchShrinkable "/>
        <HstCheckbox v-model="pIsSearchOpen " title="pIsSearchOpen "/>
        <HstCheckbox v-model="pFocusOnExpand " title="pFocusOnExpand "/>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import { logEvent } from 'histoire/client'
import PExpandableSearch from './'
import { ref } from 'vue'

const pPlaceholder = ref('')
const pSearchContent = ref('')
const pIsSearchShrinkable = ref(true)
const pIsSearchOpen = ref(false)
const pFocusOnExpand = ref(false)
</script>
