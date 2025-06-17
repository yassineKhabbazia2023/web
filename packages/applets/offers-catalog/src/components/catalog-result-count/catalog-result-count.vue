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
      {{ t('forSearchTerm', { searchTerm }) }}
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

<i18n lang="yaml">
  en-US:
    resultCount: 'No results|1 result|{resultCount} results'
    forSearchTerm: 'for "{searchTerm}"'
    clearSearch: 'Clear search'
  fr-FR:
    resultCount: 'Aucun résultat|1 résultat|{resultCount} résultats'
    forSearchTerm: 'pour "{searchTerm}"'
    clearSearch: 'Effacer la recherche'
</i18n>
