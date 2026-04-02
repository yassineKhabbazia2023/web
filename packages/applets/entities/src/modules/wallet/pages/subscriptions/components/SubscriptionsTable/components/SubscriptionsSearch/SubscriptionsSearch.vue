<template>
  <PFormSearch
    ref="formSearchRef"
    v-model:p-search="search"
    :p-placeholder="t('searchPlaceholder')"
    :p-search-invalid-message="t('searchInvalidMessage')"
    :p-min-length="3"
    :p-debounce-delay="300"
    p-clearable
    p-size="default"
    data-testid="subscriptions-search"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTemplateRef } from 'vue'
import { PFormSearch } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      searchPlaceholder: 'Search by legal name or customer code',
      searchInvalidMessage: 'Minimum 3 characters required',
    },
    'fr-FR': {
      searchPlaceholder: 'Rechercher par raison sociale ou code client',
      searchInvalidMessage: '3 caractères minimum requis',
    },
  },
})

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
