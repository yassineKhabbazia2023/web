<template>
  <Story title="2. Atoms/ExpandableSearch" icon="tabler:search">
    <Variant title="Basic Usage">
      <PExpandableSearch
        :pPlaceholder="placeholder"
        :pIsSearchShrinkable ="pIsSearchShrinkable "
        @input="logEvent('input', $event)" />
      <template #controls>
        <HstText v-model="placeholder" title="Placeholder" />
        <HstCheckbox v-model="pIsSearchShrinkable " title="pIsSearchShrinkable "/>
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
</script>
