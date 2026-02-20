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
    <div
      v-if="isAccountInformationVisible === true"
      class="margin-bottom--4"
    >
      <PEntityHeader
        :pLegalName="currentEntityName"
        :pAccountNumber="currentEntity"
        pSize="small"
        class="padding-left--4 padding-top--4"
      />
    </div>
    <div class="padding-left--4">
      <PBreadcrumb
        :pElements="breadcrumbItems"
        @p-breadcrumb-item-click="handleBreadcrumbClick"
      />
    </div>

    <DocumentsActionsBar
      :hasFiltersEnabled="docSearchFilters != null"
      :isAnyDocumentSelected="selectedDocuments.length > 0"
      :isCurrentServiceReadOnly="isCurrentServiceReadOnly"
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
          @table-row-double-clicked="handleDocumentPreview"
          @document-name-clicked="handleDocumentPreview"
        />
      </div>
      <PPagination
        v-if="documents && documents.documentsPage.items.length > 0 && !isSearchLoading"
        v-model:p-current-page="currentPage"
        v-model:p-page-size="currentPageSize"
        class="margin-x--6"
        :pTotal="documents.documentsPage.totalItems"
        pShowTotalPageCounter
        :pPageSizes="pagesRanges"
        pTestIdRoot="ged-documents"
        pPageSizeSelectorSuffix=""
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
    :currentEntity="currentEntity"
    :accountId="accountId"
    :document="selectedDocuments[0]"
    @document-rename="handleDocumentRename"
  />

  <DocumentDeleteModal
    :serviceId="currentService"
    :entityId="currentEntity"
    :accountId="accountId"
    :isVisible="isDeletePopupVisible"
    :documentIds="deletableSelectedDocumentsIds"
    @confirm-delete-document="handleConfirmDeleteDocument"
    @cancel-delete-document="handleCancelDeleteDocument"
  />

  <DocumentMove
    v-if="selectedFolder"
    :currentService="currentService"
    :currentEntity="currentEntity"
    :accountId="accountId"
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
    :currentServiceName="currentServiceName"
    :currentEntity="currentEntity"
    :accountId="accountId"
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
    :entityId="currentEntity"
    :accountId="accountId"
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

  <DocumentSearchFilter
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
import { GedContext } from '@pulse/common/enums'
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
import { PBreadcrumb, PLoader, PPagination, PEntityHeader } from '@pulse/styleguide/components'
import DocumentUpload from '@ged/modules/Documents/components/DocumentsUpload'
import { getBreadcrumbItems }
  from '@ged/modules/common/helpers/folderHelper'
import { usePiaStatusSync } from './composable/PiaStatusSync'
import { deepCopy } from '../common/utils/deepCopy'
import DocumentSearchFilter from './components/DocumentSearchFilter'
import type { DocumentSearchFilters } from '@ged/models/DocumentSearchFilters'
import DocumentsSearchAlert from '@ged/modules/Documents/components/DocumentsSearchAlert'
import { validInputMaxLength }
  from '@ged/modules/common/helpers/inputValidationHelper'
import DocumentsDropZone from './components/DocumentsDropZone'
import { useDragAndDropFromExplorer } from './composable/DragAndDropFromExplorer'
import DocumentsDropModal from './components/DocumentsDropModal'
import { Permissions } from '@ged/models/Permissions'
import {
  trackDocumentConsulted,
  trackDocumentMoveFlowStart,
  trackDocumentRenameFlowStart,
  trackDocumentDeleteFlowStart,
  trackDocumentDownloadFlowStart,
  trackDocumentTransmitFlowStart,
  trackDocumentSearch,
  trackBreadcrumbUsage,
} from '@ged/services/tracking/tracking.service'
import { TriggerSource } from '@ged/services/tracking/tracking.types'

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
  if (!props.selectedFolder) {
    return
  }

  if (isInSearchScope.value) {
    await searchDocumentsByKeyWord(searchContent.value)
  } else {
    isLoading.value = true
    documents.value = await fetchFolderDocuments({
      serviceId: props.currentService,
      folderId: props.selectedFolder.id,
      entityId: props.currentEntity,
      accountId: props.accountId,
      skip: skip.value,
      limit: currentPageSize.value,
      sort: componentSortQueryField.value,
      filters: docSearchFilters.value,
    })

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

function handleBreadcrumbClick(id: number) {
  trackBreadcrumbUsage()
  handleFolderNavigation(id)
}

// Pagination

const currentPage = ref(1)
const pagesRanges = ref([10, 25, 50, 100])
const currentPageSize = ref(10)
const totalDocumentsCount = ref<number>(0)

const skip = computed(() => (currentPage.value - 1) * currentPageSize.value)

watch([currentPage, currentPageSize, isInSearchScope], async () => {
  if (!props.selectedFolder) {
    return
  }
  await fetchDocuments()
})

const paginationLabel = computed(() => {
  if (!documents.value) {
    return
  }

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
  if (!props.selectedFolder) {
    return
  }
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
  currentPage.value = 1

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
    currentEntity: props.currentEntity,
    accountId: props.accountId,
  }
})

const transmitDocumentsProps = computed<TransmitDocumentsComposableProps>(() => ({
  selectedDocumentsIds: documentIdsSelected.value,
  currentService: props.currentService,
  currentEntity: props.currentEntity,
  accountId: props.accountId,
}),
)
// documents selection handlers
const handleOnDocumentsSelectionChange = (documentsSelection:Document[]) => {
  selectedDocuments.value = documentsSelection
  if (documentsSelection.length) {
    selectedDocumentsForMove.value = documentsSelection
  }
}

const handleDocumentPreview = (document: TableRowDocument) => {
  isPreviewDrawerOpened.value = true
  documentToPreview.value = document
  if (documents.value) {
    selectedDocumentIndex.value = document._rowIndex + 1

    totalDocumentsCount.value = currentPageSize.value
  }
  trackDocumentConsulted(props.gedContext)
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
  if (!props.selectedFolder) {
    return
  }

  isSearchLoading.value = true

  searchContent.value = value

  if (!canPerformSearch.value) {
    isSearchLoading.value = false
    return
  }

  documents.value = await fetchDocumentsByKeyWord({
    serviceId: props.currentService,
    folderId: props.selectedFolder.id,
    entityId: props.currentEntity,
    accountId: props.accountId,
    skip: skip.value,
    limit: currentPageSize.value,
    sort: componentSortQueryField.value,
    search: value,
  })
  isSearchLoading.value = false
  trackDocumentSearch(value)
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
      trackDocumentDownloadFlowStart(TriggerSource.CONTEXT_MENU)
      break
    case 'rename-document':
      handleRenameDocumentEvent()
      trackDocumentRenameFlowStart(TriggerSource.CONTEXT_MENU)
      break
    case 'delete-document':
      isDeletePopupVisible.value = true
      trackDocumentDeleteFlowStart(TriggerSource.CONTEXT_MENU)
      break
    case 'move-document':
      handleMoveDocumentEvent()
      trackDocumentMoveFlowStart(TriggerSource.CONTEXT_MENU)
      break
    case 'transmit-document':
      await handleTransmitDocuments()
      trackDocumentTransmitFlowStart(TriggerSource.CONTEXT_MENU)
      break
    case 'go-to-document':
      handleGoToSearchedDocument()
      break
  }
}

const handleActionBarButtonClick = async (actionName: string) => {
  switch (actionName) {
    case 'actionbar-download-action-click':
      if (selectedDocuments.value.length === 0) {
        break
      }
      trackDocumentDownloadFlowStart(TriggerSource.ACTION_BAR)
      handleDownloadDocumentsEvent()
      break
    case 'actionbar-delete-action-click':
      if (selectedDocuments.value.length === 0) {
        break
      }
      isDeletePopupVisible.value = true
      trackDocumentDeleteFlowStart(TriggerSource.ACTION_BAR)
      break
    case 'actionbar-rename-action-click':
      if (selectedDocuments.value.length === 0) {
        break
      }
      trackDocumentRenameFlowStart(TriggerSource.ACTION_BAR)
      handleRenameDocumentEvent()
      break
    case 'actionbar-move-action-click':
      if (selectedDocuments.value.length === 0) {
        break
      }
      trackDocumentMoveFlowStart(TriggerSource.ACTION_BAR)
      handleMoveDocumentEvent()
      break
    case 'actionbar-transmit-action-click':
      if (selectedDocuments.value.length === 0) {
        break
      }
      trackDocumentTransmitFlowStart(TriggerSource.ACTION_BAR)
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
const { currentService, currentServiceName, currentEntity, accountId } = toRefs(props)
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
  currentServiceName,
  currentEntity,
  accountId,
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

const isAccountInformationVisible = computed(() => props.gedContext !== GedContext.ACCOUNTING)
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
