<template>
  <div
    class="flex flex--direction-column"
  >
    <div
      class="
        flex
        flex--wrap
        flex-gap--2
        flex--justify-content-space-between
        flex--align-items-center
        margin-bottom--4
        margin-top--2
      "
    >
      <PFormSearch
        v-model:pSearch="searchTerm"
        class="
          flex--grow-1
          flex--basis-250px
          max-width-500
        "
        :pMinLength="1"
        :pSearchInvalidMessage="t('searchInvalidMessage')"
        :pPlaceholder="t('searchPlaceholder')"
        pSize="small"
        pClearable
        data-testid="pennylane-ged-v2-search"
        @update:p-search="onUpdateSearchDocument"
      />
      <PButton
        :pDisabled="selectedDocumentIds.length === 0"
        :pLoading="isDownloadingArchive"
        class="flex--shrink-0"
        pTestId="pennylane-ged-v2-download-button"
        @click="downloadSelectedDocuments"
      >
        <PIcon
          v-if="isDownloadingArchive === false"
          pName="download"
        />
        <span :class="{ 'padding-left--2': isDownloadingArchive === false }">
          {{ downloadButtonLabel }}
        </span>
      </PButton>
    </div>

    <PAlert
      v-if="shouldDisplayAlert"
      pType="information"
      class="margin-bottom--4"
      data-testid="pennylane-ged-v2-search-alert"
    >
      <template #bold-text>
        {{ t('searchResults.count', { count: totalDocuments }) }}
      </template>
      {{ t('searchResults.description') }}
    </PAlert>

    <PennylaneDocumentsWrapper
      v-model:selected-document-ids="selectedDocumentIds"
      :accountId
      :accountNumber
      :apiCallStatus
      :accountName
      :displayMode="PennylaneDocumentWrapperDisplayMode.IN_TABLE"
      :pennylaneDocuments
      :isSearchActive
      amplitudeLocalisation="documents rydge conseil"
    />

    <PPagination
      v-if="totalDocuments > 0 && apiCallStatus === APICallStatus.SUCCESS"
      v-model:p-current-page="currentPage"
      v-model:p-page-size="currentPageSize"
      class="margin-x--2 margin-top--1"
      :pTotal="totalDocuments"
      pShowTotalPageCounter
      :pPageSizes="pageSizes"
      pTestId="pennylane-ged-v2"
      pPageSizeSelectorSuffix=""
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, computed, watch, onMounted } from 'vue'
import PennylaneDocumentsWrapper from '@pennylane/components/pennylane-documents-wrapper/pennylane-documents-wrapper.vue'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { useCurrentEntityStore } from '@pulse/common/stores'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { APICallStatus } from '@pulse/common/enums'
import { PennylaneDocumentWrapperDisplayMode } from '@pennylane/enums/pennylane-documents-wrapper.enum'
import { logger } from '@pulse/toolbox'
import { getFormattedPennylaneDocuments } from '@pennylane/helpers/pennylane-documents.helper'
import { PPagination, PFormSearch, PAlert, PButton, PIcon } from '@pulse/styleguide/components'
import { useResponsive } from '@pulse/styleguide'
import { PAGE_SIZES, MOBILE_PAGE_SIZES } from '@pulse/common/constants'
import { getPaginationLabel } from '@pulse/common/utils'
import type { PennylaneDocument } from '@pulse/common/types'
import { useGedV2DocumentsArchiveDownload } from './ged-v2.composable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      searchPlaceholder: 'Search for a document name',
      searchInvalidMessage: 'Search term is invalid',
      searchResults: {
        count: '{count} résultats',
        description: 'dans ce dossier et les sous-dossiers',
      },
      download: {
        label: 'Download',
        inProgress: 'Download in progress',
        success: 'Download completed successfully',
        error: 'Download failed',
      },
    },
    'fr-FR': {
      searchPlaceholder: 'Rechercher un nom de document',
      searchInvalidMessage: 'Le terme de recherche est invalide',
      searchResults: {
        count: '{count} résultats',
        description: 'dans ce dossier et les sous-dossiers',
      },
      download: {
        label: 'Télécharger',
        inProgress: 'Téléchargement en cours',
        success: 'Téléchargement réalisé avec succès',
        error: 'Échec du téléchargement',
      },
    },
  },
})

const currentEntityStore = useCurrentEntityStore()
const { isMobile } = useResponsive()

const pennylaneDocuments = ref<FormattedPennylaneDocument[]>([])
const apiCallStatus = ref<APICallStatus>(APICallStatus.IDLE)
const totalDocuments = ref<number>(0)
const searchTerm = ref<string>('')
const selectedDocumentIds = ref<PennylaneDocument['id'][]>([])

const accountId = computed(() => currentEntityStore.currentEntityId ?? 0)
const accountName = computed(() => currentEntityStore.currentEntity?.legalName ?? '')
const accountNumber = computed(() => currentEntityStore.currentEntityAccountNumber)

const { isDownloadingArchive, downloadSelectedDocuments } = useGedV2DocumentsArchiveDownload({
  accountNumber,
  accountId,
  selectedDocumentIds,
  successMessage: () => t('download.success'),
  errorMessage: () => t('download.error'),
})

const currentPage = ref(1)
const pageSizes = computed(() => isMobile.value ? [5, ...MOBILE_PAGE_SIZES, ...PAGE_SIZES] : PAGE_SIZES)
const currentPageSize = ref(pageSizes.value[0])

const paginationLabel = computed(() => getPaginationLabel('sur', {
  currentPage: currentPage.value,
  limit: currentPageSize.value,
  data: pennylaneDocuments.value,
  totalItems: totalDocuments.value,
}))

const downloadButtonLabel = computed<string>(() =>
  isDownloadingArchive.value ? t('download.inProgress') : t('download.label'),
)

const isSearchActive = computed<boolean>(() => searchTerm.value.trim().length > 0)

const shouldDisplayAlert = computed<boolean>(() =>
  isSearchActive.value === true && apiCallStatus.value === APICallStatus.SUCCESS,
)

const fetchDocuments = async () => {
  const pathPrefix = 'Pennylane'
  selectedDocumentIds.value = []
  try {
    apiCallStatus.value = APICallStatus.LOADING
    const documentQueryResult = await PennylaneService.getDocuments(
      accountNumber.value,
      accountId.value,
      currentPage.value,
      currentPageSize.value,
      searchTerm.value.trim() || undefined,
    )

    pennylaneDocuments.value = getFormattedPennylaneDocuments(documentQueryResult.items, pathPrefix)
    totalDocuments.value = documentQueryResult.totalItems
    apiCallStatus.value = APICallStatus.SUCCESS
  } catch (e) {
    logger.error('Error while loading pennylane documents', e)
    apiCallStatus.value = APICallStatus.ERROR
  }
}

function onUpdateSearchDocument() {
  currentPage.value = 1
  fetchDocuments()
}

watch([currentPage, currentPageSize], fetchDocuments)

onMounted(fetchDocuments)
</script>
