<template>
  <div v-show="!isLoading">
    <PBreadcrumb
      class="documents-breadcrumb"
      :pElements="breadcrumbItems"
      @p-breadcrumb-item-click="handleFolderNavigation"
    >
    </PBreadcrumb>

    <DocumentsActionsBar
      :permissions="permissionsList"
      @p-action-bar-button-clicked="handleActionBarButtonClick"
      :isAnyDocumentSelected="selectedDocuments.length > 0"
      @p-upload-files-selected="handleUploadFilesSelected"/>

    <DocumentsList
      v-if="documents"
      :documentsListWithTableStructure="documents"
      @on-sort-change="handleSortChange"
      @toolbox-action-triggered="handleToolboxActionTriggered"
      @document-selection-change="handleOnDocumentsSelectionChange"
    />

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
    @refresh-documents-list = "fetchDocuments"
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
    @refresh-documents-list = "fetchDocuments"
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
import { TransmitDocumentsComposableProps }
  // eslint-disable-next-line max-len
  from '@/modules/Documents/components/DocumentsTransmit/TransmitDocumentsTypes'
import { useTransmitDocuments } from
  '@/modules/Documents/components/DocumentsTransmit/TransmitDocuments'
import DocumentRename from './components/DocumentRename'
import DocumentMove from './components/DocumentsMove'
import DocumentDeleteModal
  from '@/modules/Documents/components/DocumentDeleteModal'
// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
import { PBreadcrumb, PLoader, PPagination } from '@kpmg/styleguide'
import DocumentUpload from '@/modules/Documents/components/DocumentsUpload'
import { Folder } from '@/models/Folder'
import { getBreadcrumbItems }
  from '@/modules/common/helpers/folderHelper'
import {
  findFolderDeepById
} from '@/modules/Treeview/helpers/folderArrayHelper'
import { deepCopy } from '../common/utils/deepCopy'

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

const breadcrumbItems = computed(() => {
  const items = getBreadcrumbItems(props.currentServiceFolder, props.selectedFolder?.id ?? 0) ?? []
  items.unshift({
    pId: -1,
    pText: 'Documents'
  })
  return items
})

const skip = computed(() => (currentPage.value - 1) * currentPageSize.value)

// eslint-disable-next-line vitest/require-hook
watch([() => props.selectedFolder, currentPage, currentPageSize], async () => {
  await fetchDocuments()
})

const handleSortChange = async (sortQueryField:string) => {
  componentSortQueryField.value = sortQueryField
  await fetchDocuments()
}

const selectedDocuments = ref<Document[]>([])

const selectedDocumentsForMove = ref<Document[]>(deepCopy(selectedDocuments.value))
const downloadDocumentsProps:ComputedRef<DownloadDocumentsComposableProps> = computed(() => {
  return {
    selectedDocuments: selectedDocuments.value,
    currentService: props.currentService,
    selectedEntity: props.selectedEntity
  }
})

const transmitDocumentsProps = computed<TransmitDocumentsComposableProps>(() => ({
  selectedDocumentsIds: documentIdsSelected.value,
  currentService: props.currentService,
  selectedEntity: props.selectedEntity
})
)
// documents selection handlers
const handleOnDocumentsSelectionChange = (documentsSelection:Document[]) => {
  selectedDocuments.value = documentsSelection
  if (documentsSelection.length) {
    selectedDocumentsForMove.value = documentsSelection
  }
}

const { handleDownloadDocumentsEvent } =
useDownloadDocuments(downloadDocumentsProps)

const { handleTransmitDocumentsEvent } =
useTransmitDocuments(transmitDocumentsProps)

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
    case 'move-document':
      handleMoveDocumentEvent()
      break
    case 'transmit-document':
      handleTransmitDocumentsEvent()
      break
    default:
      break
  }
}

const handleActionBarButtonClick = (actionName: string) => {
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
        handleTransmitDocumentsEvent()
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
  return selectedDocuments.value.map(x => x.id)
})

const fetchDocuments = async () => {
  if (!props.selectedFolder) return
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
</script>
<style lang="scss">
  .documents-breadcrumb {
    padding: 24px 0 0 16px;
  }
</style>
