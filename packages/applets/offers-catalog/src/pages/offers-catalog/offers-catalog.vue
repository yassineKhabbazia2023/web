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
    class="margin-bottom--10"
  />
  <CatalogCardList
    :offers="offers"
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
  offers,
  offer,
  offerPdf,
  catalogDrawerIsOpened,
  pdfLoadingStatus,
  catalogLoadingStatus,
  catalogDocumentViewerIsOpened,
  loadOffersCatalog,
  setSelectedOffer,
  loadOfferPdf,
} = useOffersCatalog()

onMounted(() => {
  loadOffersCatalog()
})

function onSelectOffer(offerId: number) {
  const selectedOffer = offers.value?.find(({ id }) => id === offerId)
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
</script>
