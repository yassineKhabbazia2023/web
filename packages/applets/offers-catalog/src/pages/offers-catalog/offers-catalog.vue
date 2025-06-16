<template>
  <CatalogDocumentViewer
    v-if="offer !== undefined"
    v-model:isOpened="catalogDocumentViewerIsOpened"
    :offer="offer"
    :offerPdf="offerPdf"
  />
  <CatalogDrawer
    v-if="offer !== undefined"
    v-model:isOpened="catalogDrawerIsOpened"
    :offer="offer"
    :offerPdf="offerPdf"
    :loadingStatus="pdfLoadingStatus"
    @open-pdf="onOpenPdf"
  />
  <OffersCatalogHeader
    :searchTerm="searchTerm"
    class="margin-bottom--10"
    @update:search-term="onUpdateSeachTerm"
  />
  <CatalogCardList
    :offers="filteredOffers"
    :loadingStatus="catalogLoadingStatus"
    @select-offer="onSelectOffer"
  />
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import CatalogCardList from '../../components/catalog-card-list/catalog-card-list.vue'
import CatalogDrawer from '../../components/catalog-drawer/catalog-drawer.vue'
import OffersCatalogHeader from '../../components/offers-catalog-header/offers-catalog-header.vue'
import CatalogDocumentViewer from '../../components/catalog-document-viewer/catalog-document-viewer.vue'
import { useOffersCatalog } from './offers-catalog.composable'
import { amplitudeService } from '@pulse/common'
import { logger } from '@pulse/core'

const {
  searchTerm,
  filteredOffers,
  offer,
  offerPdf,
  catalogDrawerIsOpened,
  pdfLoadingStatus,
  catalogLoadingStatus,
  catalogDocumentViewerIsOpened,
  loadOffersCatalog,
  setSelectedOffer,
  loadOfferPdf,
  filterOffersCatalog,
} = useOffersCatalog()

onMounted(async () => {
  await loadOffersCatalog()
  filterOffersCatalog()
})

function onSelectOffer(offerId: number) {
  const selectedOffer = filteredOffers.value?.find(({ id }) => id === offerId)
  setSelectedOffer(selectedOffer)
  loadOfferPdf()
  if (selectedOffer === undefined) {
    logger.error(`Offer not found ${offerId}`)
    return
  }
  amplitudeService.track('Offer Consulted', {
    offer_name: selectedOffer?.title ?? '',
  })
}

function onOpenPdf() {
  catalogDocumentViewerIsOpened.value = true
}

function onUpdateSeachTerm(newSearchTerm: string) {
  searchTerm.value = newSearchTerm
  filterOffersCatalog()
}
</script>
