<template>
  <DocumentsActionsBar
    :permissions="permissionsList"
    @p-action-bar-button-clicked="handleActionBarButtonClick"/>

  <DocumentsList
    v-if="documents"
    :documentsListWithTableStructure="documents"
    @on-sort-change="handleSortChange"
    @toolbox-action-triggered="handleToolboxActionTriggered"
    @document-selection-change="handleOnDocumentsSelectionChange"
  />

  <PPagination
    v-if="documents"
    v-model:current-page="currentPage"
    v-model:page-size="currentPageSize"
    :total="documents.documentsPage.totalItems"
    showTotalPageCounter
    :pageSizes="pagesRanges"
    pageSizeSelectorGroupLabel=""
    pageSizeSelectorSuffix="documents"
    @on-page-range-changed="setCurrentPageSize"
  >
    <p>{{ paginationLabel }}</p>
  </PPagination>
  <PLoader
    v-else
    type="gradient"
    size="42"
  />
  <DocumentRename
    v-if="selectedDocuments && selectedDocuments.length === 1"
    v-model="isRenameModalOpened"
    :currentService="currentService"
    :selectedEntity="selectedEntity"
    :document="selectedDocuments[0]"
    @document-rename="handleDocumentRename"
  />
  <DocumentDeleteModal
      :serviceId="currentService"
      :entityId="selectedEntity"
      :isVisible="isDeletePopupVisible"
      :documentIds="documentIdsSelected"
      @confirm-delete-document="handleConfirmDeleteDocument"
      @cancel-delete-document="handleCancelDeleteDocument"
  />
</template>

<script setup lang="ts">
// eslint-disable vitest/require-hookcurrentService

import { ref, watch, computed, ComputedRef } from 'vue'
import DocumentsList from './sections/DocumentsList'
import { fetchFolderDocuments } from '@/services/Documents'
import { DocumentsProps } from './DocumentsTypes'
import type { DocumentsWithTableStructure } from '@/models/Document'
import { Document } from '@/models/Document'
import DocumentsActionsBar from '@/modules/Documents/sections/DocumentsActions'
import { getPermissionsFromDocuments } from '@/modules/Documents/helpers/documentSelectionHelper'
import { useDownloadDocuments } from
  '@/modules/Documents/components/DownloadDocuments/DownloadDocuments'
import { DownloadDocumentsComposableProps }
  // eslint-disable-next-line max-len
  from '@/modules/Documents/components/DownloadDocuments/DownloadDocumentsTypes'
import DocumentRename from './components/DocumentRename'
import DocumentDeleteModal
  from '@/modules/Documents/components/DocumentDeleteModal'
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { PLoader, PPagination } from '@kpmg/styleguide'

const props = defineProps<DocumentsProps>()
const documents = ref<DocumentsWithTableStructure | null>(null)
const currentPage = ref(1)
const pagesRanges = ref([10, 25, 50, 100])
const currentPageSize = ref(10)
const componentSortQueryField = ref('-created')
const isDeletePopupVisible = ref(false)

const paginationLabel = computed(() => {
  if (!documents.value) return

  return `${1 + ((currentPage.value - 1) * currentPageSize.value)}
   - ${((currentPage.value - 1) * currentPageSize.value) +
    documents.value.documentsPage.items.length} 
   sur ${documents.value.documentsPage.totalItems}`
})

const setCurrentPageSize = (selectedRange: number) => {
  currentPageSize.value = selectedRange
}

const skip = computed(() => (currentPage.value - 1) * currentPageSize.value)

// eslint-disable-next-line vitest/require-hook
watch([() => props.selectedFolder, currentPage, currentPageSize], async () => {
  if (!props.selectedFolder) return
  documents.value = await fetchFolderDocuments(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity,
    skip.value,
    currentPageSize.value,
    componentSortQueryField.value
  )
})

const handleSortChange = async (sortQueryField:string) => {
  componentSortQueryField.value = sortQueryField
  if (!props.selectedFolder) return
  documents.value = await fetchFolderDocuments(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity,
    skip.value,
    currentPageSize.value,
    componentSortQueryField.value
  )
}

const selectedDocuments = ref<Document[]>([])
const downloadDocumentsProps:ComputedRef<DownloadDocumentsComposableProps> = computed(() => {
  return {
    selectedDocuments: selectedDocuments.value,
    currentService: props.currentService,
    selectedEntity: props.selectedEntity
  }
})

// documents selection handlers
const handleOnDocumentsSelectionChange = (documentsSelection:Document[]) => {
  selectedDocuments.value = documentsSelection
}

const { handleDownloadDocumentsEvent } =
useDownloadDocuments(downloadDocumentsProps)

// Actions handlers
const handleToolboxActionTriggered = (action: string) => {
  switch (action) {
    case 'download-document':
      handleDownloadDocumentsEvent()
      break
    case 'rename-document':
      handleRenameDocumentEvent()
      break
    case 'delete-document':
      isDeletePopupVisible.value = true
      break
    default:
      break
  }
}

const handleActionBarButtonClick = (actionName:string) => {
  if (selectedDocuments.value.length > 0) {
    switch (actionName) {
      case 'actionbar-download-action-click':
        handleDownloadDocumentsEvent()
        break
      case 'actionbar-delete-action-click':
        isDeletePopupVisible.value = true
        break
      case 'actionbar-rename-action-click':
        handleRenameDocumentEvent()
        break
      default:
        break
    }
  }
}

// Action bar scope
const permissionsList = computed(() => {
  return getPermissionsFromDocuments(selectedDocuments.value)
})

// Rename modal
const isRenameModalOpened = ref(false)
const handleRenameDocumentEvent = () => {
  isRenameModalOpened.value = true
}

const handleDocumentRename = async () => {
  if (!props.selectedFolder) return
  isRenameModalOpened.value = false
  selectedDocuments.value = []
  documents.value = await fetchFolderDocuments(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity
  )
}

const handleConfirmDeleteDocument = async () => {
  if (!props.selectedFolder) return
  isDeletePopupVisible.value = false
  selectedDocuments.value = []
  documents.value = await fetchFolderDocuments(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity,
    skip.value,
    currentPageSize.value,
    componentSortQueryField.value
  )
}

const handleCancelDeleteDocument = () => {
  isDeletePopupVisible.value = false
}

const documentIdsSelected = computed(() => {
  return selectedDocuments.value.map(x => x.id)
})
</script>
