<template>
  <div v-show="!isLoading">
    <div class="padding-top--6 padding-left--4 margin-bottom--4">
      <PBreadcrumb :pElements="breadcrumbItems" />
    </div>

    <BinDocumentsList
      v-if="binDocuments"
      :binDocuments="binDocuments"
      @restore-document-action="handleRestoreDocument"
      @on-sort-change="handleSortChange"
    />

    <PPagination
      v-if="binDocuments && binDocuments.documentsPage.items.length > 0"
      v-model:p-current-page="currentPage"
      v-model:p-page-size="currentPageSize"
      class="margin-x--6"
      :pTotal="binDocuments.documentsPage.totalItems"
      pShowTotalPageCounter
      :pPageSizes="pagesRanges"
      pPageSizeSelectorSuffix=""
      @on-page-range-changed="setCurrentPageSize"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </div>

  <PLoader
    v-show="isLoading"
    pType="primary"
    size="42"
  />

  <DocumentRestoreModal
    :serviceId="currentBinService"
    :entityId="selectedEntity"
    :isVisible="isRestoring"
    :accountId="accountId"
    :document="documentToRestore"
    @confirm-restore-document="handleConfirmRestoreDocument"
    @cancel-restore-document="handleCancelRestoreDocument"
    @navigate-to-folder="handleNavigate"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import type { BinDocumentProps } from './BinDocumentsTypes'
import type {
  BinDocumentsWithTableStructure,
  BinDocument,
} from '@ged/models/Document'
import BinDocumentsList from './sections/BinDocumentsList'
import { fetchBinDocuments } from '@ged/services/BinDocuments'
import DocumentRestoreModal from '@ged/modules/Bin/components/DocumentRestoreModal'

import { PBreadcrumb, PLoader, PPagination } from '@pulse/styleguide/components'

const emit = defineEmits<{
  'navigate-to-folder': [number]
}>()

const props = defineProps<BinDocumentProps>()
// Bin documents
const binDocuments = ref<null | BinDocumentsWithTableStructure>(null)
const currentPage = ref(1)
const pagesRanges = ref([10, 25, 50, 100])
const currentPageSize = ref(10)
const componentSortQueryField = ref('-deleted')
const isLoading = ref(false)

const paginationLabel = computed(() => {
  if (!binDocuments.value) {
    return
  }

  return `${1 + ((currentPage.value - 1) * currentPageSize.value)}
   - ${((currentPage.value - 1) * currentPageSize.value) +
    binDocuments.value.documentsPage.items.length}
   sur ${binDocuments.value.documentsPage.totalItems}`
})

const setCurrentPageSize = (selectedRange: number) => {
  currentPageSize.value = selectedRange
}

const breadcrumbItems = computed(() => {
  const items = []
  items.push({
    pId: -1,
    pText: 'Corbeille',
  })
  items.push({
    pId: -1,
    pText: props.selectedServiceName,
  })
  return items
})

const skip = computed(() => (currentPage.value - 1) * currentPageSize.value)

watch([() => props.currentBinService, currentPage, currentPageSize], async () => {
  if (!props.currentBinService) {
    return
  }
  await fetchBin()
})

const fetchBin = async () => {
  isLoading.value = true
  binDocuments.value = await fetchBinDocuments(
    props.currentBinService,
    props.selectedEntity,
    props.accountId,
    skip.value,
    currentPageSize.value,
    componentSortQueryField.value,
  )
  isLoading.value = false
}

const handleSortChange = async (sortQueryField:string) => {
  componentSortQueryField.value = sortQueryField
  await fetchBin()
}

// Restoration document
const isRestoring = ref(false)
const documentToRestore = ref<BinDocument | null>(null)

const handleRestoreDocument = (doc: BinDocument) => {
  documentToRestore.value = doc
  isRestoring.value = true
}

const handleConfirmRestoreDocument = async () => {
  isRestoring.value = false
  documentToRestore.value = null
  await fetchBin()
}

const handleCancelRestoreDocument = () => {
  isRestoring.value = false
  documentToRestore.value = null
}

const handleNavigate = (folderId: number) => {
  emit('navigate-to-folder', folderId)
}

// Main component actions
onMounted(async () => {
  await fetchBin()
})
</script>
