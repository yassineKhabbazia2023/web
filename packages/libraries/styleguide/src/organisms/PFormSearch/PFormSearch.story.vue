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
        pPlaceholder="veuillez saisir la valeur de recherche"
        pSearchInvalidMessage="Minimum 3 caractères"
        @update:p-search="onUpdateSearch"
      />
    </Variant>
  </Story>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { logEvent } from 'histoire/client'
import PFormSearch from '.'

const search = ref('')

function onUpdateSearch(value: string) {
  search.value = value
  logEvent('update:pSearch', value)
}
</script>
