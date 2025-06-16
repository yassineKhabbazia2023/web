<template>
  <div
    class="
        offers-catalog-header
        padding--8
        bg--base-blue-pulse
        text-color--base-white

        flex
        flex--direction-column
        flex--align-items-center
        flex--justify-content-center
      "
  >
    <i18n-t
      keypath="sentence"
      tag="div"
      class="
        offers-catalog-header__title
        text-center
      "
    >
      <template #need>
        <span class="text-color--secondary-amethyste">{{ t('need') }}</span>
      </template>
      <template #theOffer>
        <span class="text-color--secondary-amethyste">{{ t('theOffer') }}</span>
      </template>
    </i18n-t>

    <div
      class="flex min-width--full"
    >
      <span class="flex--grow-1 flex--shrink-1 flex--basis-0" />
      <PFormSearch
        :pSearch="searchTerm"
        :pMinLength="0"
        :pSearchInvalidMessage="t('invalidSearch')"
        :pPlaceholder="t('searchPlaceholder')"
        class="
          flex--grow-1
          flex--shrink-1
          flex--basis-300px
          margin-top--6
        "
        @update:p-search="onUpdateSearchTerm"
      />
      <span class="flex--grow-1 flex--shrink-1 flex--basis-0" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { PFormSearch } from '@pulse/styleguide/components'
import type { OffersCatalogHeaderProps } from './offers-catalog-header.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<OffersCatalogHeaderProps>()

const emit = defineEmits<{
  'update:search-term': [string]
}>()

function onUpdateSearchTerm(searchTerm: string) {
  emit('update:search-term', searchTerm)
}
</script>

<style lang="scss" scoped>
.offers-catalog-header {
  &__title {
    font-size: 3.2rem;
    font-weight: 700;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    sentence: 'Got a customer {need}? Find {theOffer}!'
    need: 'need'
    theOffer: 'the right offer'
    invalidSearch: 'search term is invalid'
    searchPlaceholder: 'Describe a need'
  fr-FR:
    sentence: 'Un {need} client ? Trouvez {theOffer} correspondante !'
    need: 'besoin'
    theOffer: "l'offre"
    invalidSearch: 'les critères de recherche sont invalides'
    searchPlaceholder: 'Renseignez un beoin'
</i18n>
