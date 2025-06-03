<template>
  <OffersCatalogHeader
    class="margin-bottom--10"
  />
  <CatalogCardList
    :offers="offers"
  />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { logger } from '@pulse/core'
import CatalogCardList from '../../components/catalog-card-list/catalog-card-list.vue'
import OffersCatalogHeader from '../../components/offers-catalog-header/offers-catalog-header.vue'
import { getOffersCatalog } from '../../services/offers-catalog.service'
import type { OfferDescription } from '../../types/offers-catalog.types'

const offers = ref<OfferDescription[]>([])
onMounted(async () => {
  try {
    const offersCatalog = await getOffersCatalog()
    offers.value = offersCatalog.offers
  } catch (e) {
    logger.error('Error while loading offersCatalog', e)
  }
})
</script>
