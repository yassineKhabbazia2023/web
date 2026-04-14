<template>
  <PFormSearch
    ref="formSearchRef"
    v-model:p-search="search"
    :p-placeholder="t('entities.history.searchPlaceholder')"
    :p-search-invalid-message="t('entities.history.searchInvalidMessage')"
    p-clearable
    p-size="small"
    data-testid="history-search"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTemplateRef } from 'vue'
import { PFormSearch } from '@pulse/styleguide/components'

const { t } = useI18n()

const search = defineModel<string>('search', { default: '' })

const formSearchRef = useTemplateRef('formSearchRef')

const clearSearch = () => {
  formSearchRef.value?.clearSearch()
  search.value = ''
}

defineExpose({
  clearSearch,
})
</script>
