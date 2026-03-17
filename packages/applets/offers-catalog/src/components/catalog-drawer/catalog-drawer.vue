<template>
  <PDrawer
    v-model:modelValue="internalIsOpened"
    :p-title="offer.title"
    pSize="60%"
    @close-drawer-button="closeDrawer"
  >
    <PTabs
      v-model:modelValue="currentTab"
    >
      <PTabPane
        v-for="tab in tabs"
        :key="tab.name"
        :pLabel="tab.label"
        :pName="tab.name"
        :pIconName="tab.iconName"
      />
      <CatalogDrawerContentRecommendation
        v-if="currentTab === CatalogDrawerTabs.RECOMMENDATION"
        :offerId="offer.id"
        :offerResponseId="offerResponseId"
      />
      <CatalogDrawerContentPdf
        v-if="currentTab === CatalogDrawerTabs.PDF"
        :offer="offer"
        :offerPdf="offerPdf"
        :apiCallStatus="pdfApiCallStatus"
        @open-pdf="onOpenPdf"
      />
      <CatalogDrawerContentReferents
        v-if="currentTab === CatalogDrawerTabs.CONTACTS"
        :offerReferents="offerReferents"
        :apiCallStatus="offerReferentsApiCallStatus"
      />
      <CatalogDrawerContentDocuments
        v-if="currentTab === CatalogDrawerTabs.DOCUMENTS"
        :offerDocuments="offerDocuments"
        :apiCallStatus="offerReferentsApiCallStatus"
      />
    </PTabs>

    <template #footer>
      <div class="flex flex--justify-content-flex-end">
        <PButton
          pType="primary"
          pPlain
          data-testid="catalog-drawer-close-button"
          @click="closeDrawer"
        >
          {{ t('close') }}
        </PButton>
      </div>
    </template>
  </PDrawer>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { computed, ref } from 'vue'
import { CatalogDrawerTabs } from './catalog-drawer.enums'
import type { CatalogDrawerProps } from './catalog-drawer.types'
import { CatalogDrawerManager } from './catalog-drawer.manager'
import { PDrawer, PButton, PTabs, PTabPane } from '@pulse/styleguide/components'
import CatalogDrawerContentPdf from '../catalog-drawer-content-pdf/catalog-drawer-content-pdf.vue'
import CatalogDrawerContentReferents from '../catalog-drawer-content-referents/catalog-drawer-content-referents.vue'
import CatalogDrawerContentDocuments from '../catalog-drawer-content-documents/catalog-drawer-content-documents.vue'
import CatalogDrawerContentRecommendation from '../catalog-drawer-content-recommendation/catalog-drawer-content-recommendation.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      close: 'Close',
      tabs: {
        recommendation: 'Recommendation',
        pdf: 'Offer Sheet',
        contacts: 'Reference Contacts',
        documents: 'Offer\'s documents',
      },
    },
    'fr-FR': {
      close: 'Fermer',
      tabs: {
        recommendation: 'Recommandation',
        pdf: 'Fiche de l\'offre',
        contacts: 'Contacts référents',
        documents: 'Documents de l\'offre',
      },
    },
  },
})

const props = defineProps<CatalogDrawerProps>()
const emit = defineEmits<{
  'update:is-opened': [boolean]
  'open-pdf': []
}>()

function closeDrawer() {
  internalIsOpened.value = false
}

const tabs = computed(() => CatalogDrawerManager.getTabs(
  {
    pdf: t('tabs.pdf'),
    contacts: t('tabs.contacts'),
    documents: t('tabs.documents'),
    recommendation: t('tabs.recommendation'),
  },
  props.isSmartSearchEnabled,
))
const currentTab = ref<CatalogDrawerTabs>(CatalogDrawerTabs.PDF)

const internalIsOpened = computed({
  get() {
    return props.isOpened
  },
  set(value: boolean) {
    emit('update:is-opened', value)
  },
})

function onOpenPdf() {
  emit('open-pdf')
}

function openFirstTab() {
  currentTab.value = tabs.value[0].name
}

defineExpose({
  openFirstTab,
})
</script>

