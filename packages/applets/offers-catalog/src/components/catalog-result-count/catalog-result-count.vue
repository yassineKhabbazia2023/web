<template>
  <div
    v-if="searchTerm !== ''"
    class="
      flex
      flex--align-items-center
      text-color--neutral-gray-900
    "
  >
    <p class="h2">
      {{ t('resultCount', { resultCount }, resultCount) }}
    </p>
    <PButton
      class="
        text-underline
        font-normal
      "
      @click="emit('clear-search')"
    >
      {{ t('clearSearch') }}
    </PButton>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PButton } from '@pulse/styleguide/components'
import type { CatalogResultCountProps } from './catalog-result-count.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      resultCount: '0 result for your search|1 result|{resultCount} results',
      clearSearch: 'Clear search',
    },
    'fr-FR': {
      resultCount: '0 résultat pour votre recherche|1 résultat|{resultCount} résultats',
      clearSearch: 'Effacer la recherche',
    },
  },
})

defineProps<CatalogResultCountProps>()

const emit = defineEmits<{
  'clear-search': []
}>()
</script>

<style lang="scss" scoped>
.catalog-result-count {
  &__clear-search {
    font-size: 1.4rem;
  }
}
</style>

