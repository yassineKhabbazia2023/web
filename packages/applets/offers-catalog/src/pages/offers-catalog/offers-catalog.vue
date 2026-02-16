<template>
  <CatalogDocumentViewer
    v-if="offer !== undefined"
    v-model:isOpened="catalogDocumentViewerIsOpened"
    :offer="offer"
    :offerPdf="offerPdf"
  />
  <CatalogDrawer
    v-if="offer !== undefined"
    ref="catalogDrawer"
    v-model:isOpened="catalogDrawerIsOpened"
    :offer="offer"
    :offerPdf="offerPdf"
    :offerReferents="offerReferents"
    :offerDocuments="offerDocuments"
    :pdfApiCallStatus="pdfApiCallStatus"
    :offerReferentsApiCallStatus="offerReferentsApiCallStatus"
    @open-pdf="onOpenPdf"
  />
  <OffersCatalogHeader
    ref="offersCatalogHeader"
    :searchTerm="searchTerm"
    class="margin-bottom--10"
    @update:search-term="onUpdateSearchTerm"
    @update:ai-enabled="onUpdateAiEnabled"
    @ai-search="onAiSearch"
  />
  <template v-if="isAiSearchLoading">
    <div class="flex flex--justify-content-center padding--10">
      <PLoader
        pType="primary"
        pSize="64"
      />
    </div>
  </template>
  <template v-else-if="isAiSearchError">
    <PAlert
      pType="danger"
      class="margin-horizontal--6"
    >
      {{ t('aiSearchError') }}
    </PAlert>
  </template>
  <template v-else>
    <CatalogResultCount
      :searchTerm="searchTerm"
      :resultCount="filteredOffers.length"
      class="margin-bottom--10"
      @clear-search="onClearSearch"
    />
    <CatalogCardList
      :offers="filteredOffers"
      :apiCallStatus="catalogApiCallStatus"
      @select-offer="onSelectOffer"
    />
  </template>
</template>

<script lang="ts" setup>
import { computed, onMounted, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { PAlert, PLoader } from '@pulse/styleguide/components'
import CatalogCardList from '../../components/catalog-card-list/catalog-card-list.vue'
import CatalogDrawer from '../../components/catalog-drawer/catalog-drawer.vue'
import OffersCatalogHeader from '../../components/offers-catalog-header/offers-catalog-header.vue'
import CatalogDocumentViewer from '../../components/catalog-document-viewer/catalog-document-viewer.vue'
import CatalogResultCount from '../../components/catalog-result-count/catalog-result-count.vue'
import { useOffersCatalog } from './offers-catalog.composable'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { APICallStatus } from '@pulse/common/enums'
import { logger } from '@pulse/toolbox'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const {
  searchTerm,
  filteredOffers,
  offer,
  offerPdf,
  offerReferents,
  offerDocuments,
  catalogDrawerIsOpened,
  pdfApiCallStatus,
  offerReferentsApiCallStatus,
  catalogApiCallStatus,
  aiSearchApiCallStatus,
  catalogDocumentViewerIsOpened,
  loadOffersCatalog,
  setSelectedOffer,
  loadOfferPdf,
  loadOfferReferents,
  filterOffersCatalog,
  searchOffersWithAi,
  resetAiSearch,
} = useOffersCatalog()

const isAiSearchLoading = computed(() => aiSearchApiCallStatus.value === APICallStatus.LOADING)
const isAiSearchError = computed(() => aiSearchApiCallStatus.value === APICallStatus.ERROR)

const offersCatalogHeaderRef = useTemplateRef('offersCatalogHeader')

onMounted(async () => {
  await loadOffersCatalog()
  filterOffersCatalog()
})

const catalogDrawerRef = useTemplateRef('catalogDrawer')

function onSelectOffer(offerId: number) {
  const selectedOffer = filteredOffers.value?.find(({ id }) => id === offerId)
  setSelectedOffer(selectedOffer)
  catalogDrawerRef.value?.openFirstTab()
  loadOfferPdf()
  loadOfferReferents()
  if (selectedOffer === undefined) {
    logger.error(`Offer not found ${offerId}`)
    return
  }
  AmplitudeService.track('Offer Consulted', {
    offer_name: selectedOffer?.title ?? '',
  })
}

function onOpenPdf() {
  catalogDocumentViewerIsOpened.value = true
}

function onUpdateSearchTerm(newSearchTerm: string) {
  searchTerm.value = newSearchTerm

  if (newSearchTerm !== '') {
    AmplitudeService.track('Offer Searched', {
      offer_search: searchTerm.value,
    })
  }

  filterOffersCatalog()
}

async function onAiSearch(question: string) {
  searchTerm.value = question
  await searchOffersWithAi(question)
}

function onUpdateAiEnabled(enabled: boolean) {
  if (enabled === false) {
    resetAiSearch()
  }
  onClearSearch()
}

function onClearSearch() {
  offersCatalogHeaderRef.value?.clearSearch()
  onUpdateSearchTerm('')
}
</script>

<i18n lang="yaml">
  en-US:
    aiSearchError: >-
      An error occurred while loading the results, please try a new search.
      If the problem persists, please contact support.
  fr-FR:
    aiSearchError: >-
      Une erreur est survenue dans le chargement des réponses, veuillez lancer une nouvelle génération.
      Si le problème persiste veuillez contacter le support.
</i18n>
