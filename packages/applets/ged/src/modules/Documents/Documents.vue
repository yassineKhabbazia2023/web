<template>
  <div
    v-show="!isLoading"
    class="
      documents
      flex
      flex--direction-column
      height--100
    "
  >
    <div>
      <AccountInformation
        :accountAvatarColor="selectedEntityAvatarColor"
        :accountName="selectedEntityName"
        :accountNumber="selectedEntity"
      />

    </div>
    <div class="padding-top--4 padding-left--4">
      <PBreadcrumb
        :pElements="breadcrumbItems"
        @p-breadcrumb-item-click="handleFolderNavigation" />
    </div>

    <DocumentsActionsBar
      :hasFiltersEnabled="docSearchFilters != null"
      :isAnyDocumentSelected="selectedDocuments.length > 0"
      :isSearchShrinkable="isSearchShrinkable"
      :isSearchOpen="isSearchExpanded"
      :isTransmitDocumentsLoading="isTransmitDocumentsLoading"
      :permissions="permissionsList"
      @p-action-bar-button-clicked="handleActionBarButtonClick"
      @p-search-input="searchDocumentsByKeyWord"
      @p-upload-files-selected="handleUploadFilesSelected"
      @search-expand-change="handleSearchExpandChange"
    />

    <DocumentsSearchAlert
      v-if="canDisplaySearchResultAlert"
      :documentsCount="documents?.documentsPage.totalItems ?? 0"
    />

    <div
      class="flex--grow-1 position--relative"
      :class="
        {
          'documents--is-drag-overed': isDropZoneVisible,
          'documents--not-valid-drop-zone': isAllowedDropZone
        }"
      @drop.prevent="handleDropFromExplorer"
      @dragover.prevent="handleDragOverFromExplorer"
      @dragleave="handleDragLeaveFromExplorer"
    >
      <div
        class="documents-list-wrapper"
        :class="{ 'height--100': isSearchLoading }"
      >
        <PLoader
          v-if="isSearchLoading"
          class="search-loader"
          pType="primary"
          size="42"
        />

        <DocumentsList
          v-if="documents"
          :class="[
            isSearchLoading ? 'is-searching' : '',
            isInSearchScope ? 'documents-table--search' : '',
          ]"
          :documentsListWithTableStructure="documents"
          :isInSearchScope="isInSearchScope"
          :currentService="currentService"
          @on-sort-change="handleSortChange"
          @toolbox-action-triggered="handleToolboxActionTriggered"
          @document-selection-change="handleOnDocumentsSelectionChange"
          @table-row-clicked="handleOnRowTableDocumentsClicked"
        />
      </div>
      <PPagination
        v-if="documents && documents.documentsPage.items.length > 0 && !isSearchLoading"
        v-model:p-current-page="currentPage"
        v-model:p-page-size="currentPageSize"
        :pTotal="documents.documentsPage.totalItems"
        pShowTotalPageCounter
        :pPageSizes="pagesRanges"
        pTestIdRoot="ged-documents"
        pPageSizeSelectorGroupLabel=""
        pPageSizeSelectorSuffix="documents"
        @on-page-range-changed="setCurrentPageSize"
      >
        <p>{{ paginationLabel }}</p>
      </PPagination>

      <Transition>
        <DocumentsDropZone
          v-if="isDropZoneVisible"
          :isAllowedDropZone="isAllowedDropZone"
        />
      </Transition>
    </div>
  </div>

  <div
    v-show="isLoading"
    class="
      loader
      height--100
      flex
      flex--align-items-center
      flex--justify-content-center
    "
  >
    <PLoader
      pType="primary"
      size="42"
    />
  </div>

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
    :documentIds="deletableSelectedDocumentsIds"
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

  <DocumentsDropModal
    v-if="selectedFolder"
    :isVisible="isDropFromExplorerConfirmationModalVisible"
    :targetFolderName="selectedFolder.name"
    :numberOfUploadedFiles="validDroppedFiles.length"
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

  <DocumentSearchFiltrer
    v-if="isFiltersDrawerOpened"
    v-model="isFiltersDrawerOpened"
    :filters="docSearchFilters"
    @close-filters-drawer="isFiltersDrawerOpened = false"
    @reset-filters-drawer="handleResetFilters"
    @apply-filters-drawer="handleApplyFilters"
  />
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { ref, toRefs, watch, computed } from 'vue'
import {
  fetchFolderDocuments,
  fetchDocumentsByKeyWord,
} from '@ged/services/Documents'
import type { DocumentsProps } from './DocumentsTypes'
import type { Folder } from '@ged/models/Folder'
import { findFolderDeepById } from '@ged/modules/Treeview/helpers/folderArrayHelper'

import DocumentsList from './sections/DocumentsList'
import type {
  Document,
  DocumentsWithTableStructure,
  TableRowDocument,
} from '@ged/models/Document'

import DocumentsActionsBar from '@ged/modules/Documents/sections/DocumentsActions'
import { getPermissionsFromDocuments } from '@ged/modules/Documents/helpers/documentSelectionHelper'

import { useDownloadDocuments } from
  '@ged/modules/Documents/components/DownloadDocuments/DownloadDocuments'
import type { DownloadDocumentsComposableProps }
  from '@ged/modules/Documents/components/DownloadDocuments/DownloadDocumentsTypes'
import type { TransmitDocumentsComposableProps }
  from '@ged/modules/Documents/components/DocumentsTransmit/TransmitDocumentsTypes'
import { useTransmitDocuments } from
  '@ged/modules/Documents/components/DocumentsTransmit/TransmitDocuments'

import DocumentRename from './components/DocumentRename'
import DocumentMove from './components/DocumentsMove'
import DocumentPreview from './components/DocumentPreview'
import DocumentDeleteModal from '@ged/modules/Documents/components/DocumentDeleteModal'
import { PBreadcrumb, PLoader, PPagination } from '@pulse/styleguide/components'
import DocumentUpload from '@ged/modules/Documents/components/DocumentsUpload'
import { getBreadcrumbItems }
  from '@ged/modules/common/helpers/folderHelper'
import { usePiaStatusSync } from './composable/PiaStatusSync'
import { deepCopy } from '../common/utils/deepCopy'
import DocumentSearchFiltrer from './components/DocumentSearchFiltrer'
import type { DocumentSearchFilters } from '@ged/models/DocumentSearchFilters'
import DocumentsSearchAlert from '@ged/modules/Documents/components/DocumentsSearchAlert'
import { validInputMaxLength }
  from '@ged/modules/common/helpers/inputValidationHelper'
import DocumentsDropZone from './components/DocumentsDropZone'
import { useDragAndDropFromExplorer } from './composable/DragAndDropFromExplorer'
import DocumentsDropModal from './components/DocumentsDropModal'
import { Permissions } from '@ged/models/Permissions'
import AccountInformation from './components/AccountInformation'

/* The more features we add the more this component becomes bloated.
We created a refactor task, which, unfortunately has been placed far back in the backlog.
This will give us time to make many parts of the code composable to lighten this component. */

const emit = defineEmits<{
  'change-selected-folder': [Folder]
  'update-source-folders': [Folder]
}>()
const props = defineProps<DocumentsProps>()
const documents = ref<DocumentsWithTableStructure | null>(null)
const isDeletePopupVisible = ref(false)
const isLoading = ref(false)
const isTransmitDocumentsLoading = ref(false)
const isSearchLoading = ref(false)
const isSearchExpanded = ref(false)
const searchContent = ref('')
const canPerformSearch = computed(() =>
  searchContent.value.trim() !== '' &&
  validInputMaxLength(searchContent.value))
const isInSearchScope =
computed<boolean>(() => isSearchExpanded.value && canPerformSearch.value)
const canDisplaySearchResultAlert = computed(() =>
  isInSearchScope.value && canPerformSearch.value && !isSearchLoading.value)
const isPreviewDrawerOpened = ref(false)
const docSearchFilters = ref<DocumentSearchFilters | null>(null)

const componentSortQueryField = ref('-created')

const fetchDocuments = async () => {
  if (!props.selectedFolder) return

  if (isInSearchScope.value) {
    await searchDocumentsByKeyWord(searchContent.value)
  } else {
    isLoading.value = true
    documents.value = await fetchFolderDocuments(
      props.currentService,
      props.selectedFolder.id,
      props.selectedEntity,
      skip.value,
      currentPageSize.value,
      componentSortQueryField.value,
      docSearchFilters.value,
    )

    // When we delete or move documents we're checking if the response is empty
    // in that case we just fallback to page one
    if (currentPage.value > 1 && !documents.value.documentsPage.items.length) {
      currentPage.value = 1
    }

    isLoading.value = false
  }
}
// Breadcrumb

const breadcrumbItems = computed(() => {
  const items = getBreadcrumbItems(props.currentServiceFolder, props.selectedFolder?.id ?? 0) ?? []
  items.unshift({
    pId: -1,
    pText: 'Documents',
  })
  return items
})

// Pagination

const currentPage = ref(1)
const pagesRanges = ref([10, 25, 50, 100])
const currentPageSize = ref(10)
const totalDocumentsCount = ref<number>(0)

const skip = computed(() => (currentPage.value - 1) * currentPageSize.value)

watch([currentPage, currentPageSize, isInSearchScope], async () => {
  if (!props.selectedFolder) return
  await fetchDocuments()
})

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

const isSearchShrinkable = computed(() => searchContent.value === '')

watch([() => props.selectedFolder], async () => {
  if (!props.selectedFolder) return
  docSearchFilters.value = null
  currentPage.value = 1
  await fetchDocuments()
},
{
  immediate: true,
})

// Sort
const handleSortChange = async (sortQueryField:string) => {
  componentSortQueryField.value = sortQueryField
  await fetchDocuments()
}

const selectedDocuments = ref<Document[]>([])
const documentToPreview = ref<Document>()
const selectedDocumentIndex = ref<number>(1)

const selectedDocumentsForMove = ref<Document[]>(deepCopy(selectedDocuments.value))
const downloadDocumentsProps:ComputedRef<DownloadDocumentsComposableProps> = computed(() => {
  return {
    selectedDocuments: selectedDocuments.value,
    currentService: props.currentService,
    selectedEntity: props.selectedEntity,
  }
})

const transmitDocumentsProps = computed<TransmitDocumentsComposableProps>(() => ({
  selectedDocumentsIds: documentIdsSelected.value,
  currentService: props.currentService,
  selectedEntity: props.selectedEntity,
}),
)
// documents selection handlers
const handleOnDocumentsSelectionChange = (documentsSelection:Document[]) => {
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

const { handleDownloadDocumentsEvent } =
useDownloadDocuments(downloadDocumentsProps)

const { handleTransmitDocumentsEvent } =
useTransmitDocuments(transmitDocumentsProps)

const handleTransmitDocuments = async () => {
  isTransmitDocumentsLoading.value = true
  await handleTransmitDocumentsEvent()
  isTransmitDocumentsLoading.value = false
  setTimeout(async () => {
    await fetchDocuments()
  }, 300)
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

const handleGoToSearchedDocument = () => {
  setTimeout(() => {
    isSearchExpanded.value = false
    searchContent.value = ''

    handleFolderNavigation(selectedDocuments.value[0].folder.id)
  }, 300)
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

const deletableSelectedDocumentsIds = computed(() => {
  return selectedDocuments.value
    .filter((document) => document.permissions.includes(Permissions.CAN_DELETE_DOCUMENT))
    .map((document) => document.id)
})

const handleSearchExpandChange = (value: boolean) => {
  isSearchExpanded.value = value
}

const searchDocumentsByKeyWord = async (value: string) => {
  if (!props.selectedFolder) return

  isSearchLoading.value = true

  searchContent.value = value

  if (!canPerformSearch.value) {
    isSearchLoading.value = false
    return
  }

  documents.value = await fetchDocumentsByKeyWord(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity,
    skip.value,
    currentPageSize.value,
    componentSortQueryField.value,
    value,
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

// Document notification
const { selectedFolder } = toRefs(props)
usePiaStatusSync(selectedFolder, documents)
// Document search filters scope

const isFiltersDrawerOpened = ref(false)

const handleResetFilters = async () => {
  isFiltersDrawerOpened.value = false
  docSearchFilters.value = null
  await fetchDocuments()
}

const handleApplyFilters = async (val: DocumentSearchFilters) => {
  isFiltersDrawerOpened.value = false
  docSearchFilters.value = val
  await fetchDocuments()
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
    case 'go-to-document':
      handleGoToSearchedDocument()
      break
  }
}

const handleActionBarButtonClick = async (actionName: string) => {
  switch (actionName) {
    case 'actionbar-download-action-click':
      if (selectedDocuments.value.length === 0) break
      handleDownloadDocumentsEvent()
      break
    case 'actionbar-delete-action-click':
      if (selectedDocuments.value.length === 0) break
      isDeletePopupVisible.value = true
      break
    case 'actionbar-rename-action-click':
      if (selectedDocuments.value.length === 0) break
      handleRenameDocumentEvent()
      break
    case 'actionbar-move-action-click':
      if (selectedDocuments.value.length === 0) break
      handleMoveDocumentEvent()
      break
    case 'actionbar-transmit-action-click':
      if (selectedDocuments.value.length === 0) break
      await handleTransmitDocuments()
      break
    case 'actionbar-filter-action-click':
      isFiltersDrawerOpened.value = true
      break
    default:
      break
  }
}

// Drag and drop -> Composable
const { currentService, selectedEntity } = toRefs(props)
const {
  isDropZoneVisible,
  isAllowedDropZone,
  isDropFromExplorerConfirmationModalVisible,
  handleDropFromExplorer,
  handleDragOverFromExplorer,
  handleDragLeaveFromExplorer,
  validDroppedFiles,
} = useDragAndDropFromExplorer(
  currentService,
  selectedEntity,
  selectedFolder,
  refreshDocumentsList,
)

// This function is exposed in order to let parent component refresh the documents list
// this is usefull for the drag and drop as the events are handled in the Tree module
// which has no direct relation with the Documents module
async function refreshDocumentsList() {
  await fetchDocuments()
}

defineExpose({
  refreshDocumentsList,
  // FIXME: should not expose variables for UT purpose (should change UT)
  documents,
  isSearchExpanded,
  searchContent,
  selectedDocuments,
  isSearchLoading,
  isPreviewDrawerOpened,
  isRenameModalOpened,
  isFiltersDrawerOpened,
})
</script>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

.documents {

  &--is-drag-overed *:not(.documents-drop-zone){
    pointer-events: none;
    position: relative;
    z-index: -1;
  }
}

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
  :deep(.is-searching) {
    .el-table {
      display: none;
    }
  }
</style>
