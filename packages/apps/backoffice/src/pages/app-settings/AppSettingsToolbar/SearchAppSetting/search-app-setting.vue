<template>
  <PFormSearch
    data-testid="search-app-setting-input"
    :pSearch="modelValue"
    class="search-app-setting"
    pPlaceholder="Rechercher par clé..."
    pSearchInvalidMessage="3 caractères minimum requis"
    :pMinLength="3"
    pSize="small"
    pClearable
    @update:p-search="handleSearchChange"
  />
</template>

<script setup lang="ts">
import { PFormSearch } from '@pulse/styleguide/components'
import { useDebounce } from '@toolbox/main'

const modelValue = defineModel<string>({ default: '' })

const debouncedSearch = useDebounce((value: string) => {
  modelValue.value = value
})

const handleSearchChange = (value: string) => {
  debouncedSearch(value ?? '')
}
</script>

<style lang="scss" scoped>
.search-app-setting {
  width: 400px;
}
</style>
