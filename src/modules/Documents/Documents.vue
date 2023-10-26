<template>
  <div>
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
  </div>
</template>

<script setup lang="ts">
// eslint-disable vitest/require-hookcurrentService

import { ref, watch, computed, ComputedRef } from 'vue'
import DocumentsList from './sections/DocumentsList'
import { fetchFolderDocuments } from '@/services/Documents'
import { DocumentsProps } from './DocumentsTypes'
import type { DocumentsWithTableStructure } from '@/models/Document'
import { PLoader } from '@kpmg/styleguide'
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

const props = defineProps<DocumentsProps>()
const documents = ref<DocumentsWithTableStructure | null>(null)
const componentSortQueryField = ref('')
const componentStartQueryField = ref(0)
const componentLimitQueryField = ref(10)
const isDeletePopupVisible = ref(false)
// eslint-disable-next-line vitest/require-hook
watch(() => props.selectedFolder, async () => {

  if (!props.selectedFolder) return
  documents.value = await fetchFolderDocuments(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity
  )
})

const handleSortChange = async (sortQueryField:string) => {
  componentSortQueryField.value = sortQueryField
  if (!props.selectedFolder) return
  documents.value = await fetchFolderDocuments(
    props.currentService,
    props.selectedFolder.id,
    props.selectedEntity,
    componentStartQueryField.value,
    componentLimitQueryField.value,
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
    props.selectedEntity
  )
}

const handleCancelDeleteDocument = () => {
  isDeletePopupVisible.value = false
  selectedDocuments.value = []
}

const documentIdsSelected = computed(() => {
  return selectedDocuments.value.map(x => x.id)
})
</script>
