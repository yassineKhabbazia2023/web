<template>
  <div v-show="!isLoading">
    <div class="padding-top--5 padding-left--4">
      <PBreadcrumb
        :pElements="breadcrumbItems"
        @p-breadcrumb-item-click="handleFolderNavigation" />
    </div>

    <DocumentsActionsBar
      :permissions="permissionsList"
      @p-action-bar-button-clicked="handleActionBarButtonClick"
      :isAnyDocumentSelected="selectedDocuments.length > 0"
      @p-upload-files-selected="handleUploadFilesSelected"
      :isTransmitDocumentsLoading="isTransmitDocumentsLoading"
      :isSearchShrinkable="isSearchShrinkable"
      @p-search-input="searchDocumentsByKeyWord"
      @search-expand-change="handleSearchExpandChange"
    />

    <DocumentsSearchAlert
      v-if="canDisplaySearchResultAlert"
      :documentsCount="documents?.documentsPage.totalItems ?? 0"
    />

    <div class="documents-list-wrapper">
      <PLoader
        v-if="isSearchLoading"
        class="search-loader"
        pType="gradient"
        size="42"
      />

      <DocumentsList
        v-if="documents"
        :class="isSearchLoading ? 'is-searching' : ''"
        :documentsListWithTableStructure="documents"
        @on-sort-change="handleSortChange"
        @toolbox-action-triggered="handleToolboxActionTriggered"
        @document-selection-change="handleOnDocumentsSelectionChange"
        @table-row-clicked="handleOnRowTableDocumentsClicked"
      />
    </div>
    <PPagination
      v-if="documents && documents.documentsPage.items.length > 0"
      v-model:p-current-page="currentPage"
      v-model:p-page-size="currentPageSize"
      :pTotal="documents.documentsPage.totalItems"
      pShowTotalPageCounter
      :pPageSizes="pagesRanges"
      pPageSizeSelectorGroupLabel=""
      pPageSizeSelectorSuffix="documents"
      @on-page-range-changed="setCurrentPageSize"
    >
      <p>{{ paginationLabel }}</p>
    </PPagination>
  </div>

  <PLoader
    v-show="isLoading"
    pType="gradient"
    size="42" />

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

  <DocumentMove
    v-if="selectedFolder"
    :currentService="currentService"
    :selectedEntity="selectedEntity"
    :folder="selectedFolder"
    :selectedDocuments="selectedDocumentsForMove"
    :isMoveModalOpened="isMoveModalOpened"
    :currentServiceFolder="currentServiceFolder"
    @update-source-folders="propagateUpdateSourceFolders"
    @close-move-documents-modal="handleCloseMoveDocumentsModal"
    @refresh-documents-list="fetchDocuments"
  />

  <DocumentUpload
    v-if="selectedFolder && filesSelected"
    :currentService="currentService"
    :selectedEntity="selectedEntity"
    :folder="selectedFolder"
    :files="filesSelected"
    :isUploadModalOpened="isUploadModalOpened"
    :currentServiceFolder="currentServiceFolder"
    @update-source-folders="propagateUpdateSourceFolders"
    @close-upload-documents-modal="handleCloseUploadDocumentsModal"
    @refresh-documents-list="fetchDocuments"
  />
  <DocumentPreview
    v-if="documentToPreview"
    :openDrawer="isPreviewDrawerOpened"
    :document="documentToPreview"
    :serviceId="currentService"
    :entityId="selectedEntity"
    :selectedDocumentIndex="selectedDocumentIndex"
    :totalDocumentsCount="totalDocumentsCount"
    @next-document-preview-button-click="
      handleNextBuuttonClickedForPreviewDocument
    "
    @previous-document-preview-button-click="
      handlePreviewButtonClickedForPreviewDocument
    "
    @close-drawer="isPreviewDrawerOpened = false"
  />
</template>

<script setup lang="ts">
// eslint-disable vitest/require-hookcurrentService
/* eslint-disable vitest/require-hook */
import { ref, watch, computed, ComputedRef } from 'vue'
import DocumentsList from './sections/DocumentsList'
import {
  fetchFolderDocuments,
  fetchDocumentsByKeyWord
} from '@/services/Documents'
import { DocumentsProps } from './DocumentsTypes'
import type {
  DocumentsWithTableStructure,
  TableRowDocument
} from '@/models/Document'
import { Document } from '@/models/Document'
import { Folder } from '@/models/Folder'
import { findFolderDeepById } from '@/modules/Treeview/helpers/folderArrayHelper'

import DocumentsActionsBar from '@/modules/Documents/sections/DocumentsActions'
import { getPermissionsFromDocuments } from '@/modules/Documents/helpers/documentSelectionHelper'

import { useDownloadDocuments } from
  '@/modules/Documents/components/DownloadDocuments/DownloadDocuments'
import { DownloadDocumentsComposableProps }
  from '@/modules/Documents/components/DownloadDocuments/DownloadDocumentsTypes'
import { TransmitDocumentsComposableProps }
  from '@/modules/Documents/components/DocumentsTransmit/TransmitDocumentsTypes'
import { useTransmitDocuments } from
  '@/modules/Documents/components/DocumentsTransmit/TransmitDocuments'

import DocumentRename from './components/DocumentRename'
import DocumentMove from './components/DocumentsMove'
import DocumentPreview from './components/DocumentPreview'
import DocumentDeleteModal from '@/modules/Documents/components/DocumentDeleteModal'
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { PBreadcrumb, PLoader, PPagination } from '@kpmg/styleguide'
import DocumentUpload from '@/modules/Documents/components/DocumentsUpload'
import { getBreadcrumbItems } from '@/modules/common/helpers/folderHelper'
import { deepCopy } from '../common/utils/deepCopy'
import DocumentsSearchAlert from '@/modules/Documents/components/DocumentsSearchAlert'

const emit = defineEmits<{
  'change-selected-folder': [Folder]
  'update-source-folders': [Folder]
}>()
const props = defineProps<DocumentsProps>()
const documents = ref<DocumentsWithTableStructure | null>(null)
const currentPage = ref(1)
const pagesRanges = ref([10, 25, 50, 100])
const currentPageSize = ref(10)
const componentSortQueryField = ref('-created')
const isDeletePopupVisible = ref(false)
const isLoading = ref(false)
const isTransmitDocumentsLoading = ref(false)
const isSearchLoading = ref(false)
const isSearchExpanded = ref(false)
const searchContent = ref('')

const canDisplaySearchResultAlert = computed(() =>
  searchContent.value && isSearchExpanded.value && !isSearchLoading.value)

const isPreviewDrawerOpened = ref(false)
const paginationLabel = computed(() => {
  if (!documents.value) return

  return `${1 + (currentPage.value - 1) * currentPageSize.value}
   - ${
     (currentPage.value - 1) * currentPageSize.value +
     documents.value.documentsPage.items.length
   } 
   sur ${documents.value.documentsPage.totalItems}`
})

const setCurrentPageSize = (selectedRange: number) => {
  currentPageSize.value = selectedRange
}

const breadcrumbItems = computed(() => {
  const items =
    getBreadcrumbItems(
      props.currentServiceFolder,
      props.selectedFolder?.id ?? 0
    ) ?? []
  items.unshift({
    pId: -1,
    pText: 'Documents'
  })
  return items
})

const fetchDocuments = async () => {
  if (!props.selectedFolder) return
  // eslint-disable-next-line max-len
  if (isSearchExpanded.value && searchContent.value) {
    await searchDocumentsByKeyWord(searchContent.value)
  } else {
    isLoading.value = true
    documents.value = await fetchFolderDocuments(
      props.currentService,
      props.selectedFolder.id,
      props.selectedEntity,
      skip.value,
      currentPageSize.value,
      componentSortQueryField.value
    )
    isLoading.value = false
  }

}

const skip = computed(() => (currentPage.value - 1) * currentPageSize.value)
const isSearchShrinkable = computed(() => searchContent.value === '')
// eslint-disable-next-line vitest/require-hook
watch([() => props.selectedFolder, currentPage, currentPageSize], async () => {
  if (!props.selectedFolder) return
  await fetchDocuments()
},
{
  immediate: true
})

const handleSortChange = async (sortQueryField: string) => {
  componentSortQueryField.value = sortQueryField
  await fetchDocuments()
}

const selectedDocuments = ref<Document[]>([])
const documentToPreview = ref<Document>()
const selectedDocumentIndex = ref<number>(1)
const totalDocumentsCount = ref<number>(0)

const selectedDocumentsForMove = ref<Document[]>(
  deepCopy(selectedDocuments.value)
)
const downloadDocumentsProps: ComputedRef<DownloadDocumentsComposableProps> =
  computed(() => {
    return {
      selectedDocuments: selectedDocuments.value,
      currentService: props.currentService,
      selectedEntity: props.selectedEntity
    }
  })

const transmitDocumentsProps = computed<TransmitDocumentsComposableProps>(
  () => ({
    selectedDocumentsIds: documentIdsSelected.value,
    currentService: props.currentService,
    selectedEntity: props.selectedEntity
  })
)
// documents selection handlers
const handleOnDocumentsSelectionChange = (documentsSelection: Document[]) => {
  selectedDocuments.value = documentsSelection
  if (documentsSelection.length) {
    selectedDocumentsForMove.value = documentsSelection
  }
}

const handleOnRowTableDocumentsClicked = (document: TableRowDocument) => {
  isPreviewDrawerOpened.value = true
  documentToPreview.value = document
  if (documents.value) {
    selectedDocumentIndex.value = document._rowIndex + 1

    totalDocumentsCount.value = currentPageSize.value
  }
}

const { handleDownloadDocumentsEvent } = useDownloadDocuments(
  downloadDocumentsProps
)

const { handleTransmitDocumentsEvent } = useTransmitDocuments(
  transmitDocumentsProps
)

const handleTransmitDocuments = async () => {
  isTransmitDocumentsLoading.value = true
  await handleTransmitDocumentsEvent()
  isTransmitDocumentsLoading.value = false
  setTimeout(async () => {
    await fetchDocuments()
  }, 300)
}

// Actions handlers
const handleToolboxActionTriggered = async (action: string) => {
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
    case 'move-document':
      handleMoveDocumentEvent()
      break
    case 'transmit-document':
      await handleTransmitDocuments()
      break
    default:
      break
  }
}

const handleActionBarButtonClick = async (actionName: string) => {
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
      case 'actionbar-move-action-click':
        handleMoveDocumentEvent()
        break
      case 'actionbar-transmit-action-click':
        await handleTransmitDocuments()
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
  isRenameModalOpened.value = false
  selectedDocuments.value = []
  await fetchDocuments()
}
const isMoveModalOpened = ref(false)
const handleMoveDocumentEvent = () => {
  isMoveModalOpened.value = true
}

const handleConfirmDeleteDocument = async () => {
  isDeletePopupVisible.value = false
  selectedDocuments.value = []
  await fetchDocuments()
}

const handleCancelDeleteDocument = () => {
  isDeletePopupVisible.value = false
}

const documentIdsSelected = computed(() => {
  return selectedDocuments.value.map((document) => document.id)
})

const handleSearchExpandChange = (value: boolean) => {
  isSearchExpanded.value = value
}

const searchDocumentsByKeyWord = async (value: string) => {
  if (!props.selectedFolder) return

  searchContent.value = value
  isSearchLoading.value = true

  documents.value = await fetchDocumentsByKeyWord(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity,
    skip.value,
    currentPageSize.value,
    componentSortQueryField.value,
    value
  )
  isSearchLoading.value = false
}

// upload modal
const filesSelected = ref<File[]>([])
const isUploadModalOpened = ref(false)

const handleUploadFilesSelected = (files: File[]) => {
  if (files && files.length) {
    filesSelected.value.push(...files)
    isUploadModalOpened.value = true
  }
}

// Documents upload scope
const propagateUpdateSourceFolders = (createdFolder: Folder) => {
  emit('update-source-folders', createdFolder)
}

const handleCloseUploadDocumentsModal = () => {
  isUploadModalOpened.value = false
  filesSelected.value = []
}
const handleCloseMoveDocumentsModal = () => {
  isMoveModalOpened.value = false
}

const handleFolderNavigation = (id: number) => {
  const folder = findFolderDeepById(props.currentServiceFolder, id)
  if (folder) {
    emit('change-selected-folder', folder)
  }
}
const handleNextBuuttonClickedForPreviewDocument = () => {
  if (documents.value) {
    documentToPreview.value =
      documents.value?.documentsPage.items[selectedDocumentIndex.value]
    if (documentToPreview.value) {
      selectedDocumentIndex.value = selectedDocumentIndex.value + 1

      totalDocumentsCount.value = currentPageSize.value
    }
  }
}
const handlePreviewButtonClickedForPreviewDocument = () => {
  if (documents.value) {
    documentToPreview.value =
      documents.value.documentsPage.items[selectedDocumentIndex.value - 2]
    if (documentToPreview.value) {
      selectedDocumentIndex.value = selectedDocumentIndex.value - 1

      totalDocumentsCount.value = currentPageSize.value
    }
  }
}
</script>
<style lang="scss">
.documents-breadcrumb {
  padding: 24px 0 0 16px;
}
.documents-list-wrapper {
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;

  .p-loader {
    font-size: 42px;
    margin: 0 auto;
    position: absolute;
    z-index: 99999;
  }
}
  .is-searching {
    .el-table {
      opacity: 0;
    }
  }
</style>
