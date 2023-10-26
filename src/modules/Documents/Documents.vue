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
  </div>
</template>

<script setup lang="ts">
// eslint-disable vitest/require-hook

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

const props = defineProps<DocumentsProps>()
const documents = ref<DocumentsWithTableStructure | null>(null)
const componentSortQueryField = ref('')
const componentStartQueryField = ref(0)
const componentLimitQueryField = ref(10)
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
  }
}

const handleActionBarButtonClick = (actionName:string) => {
  if (selectedDocuments.value.length > 0) {
    switch (actionName) {
      case 'actionbar-download-action-click':
        handleDownloadDocumentsEvent()
    }
  }
}

// Action bar scope
const permissionsList = computed(() => {
  return getPermissionsFromDocuments(selectedDocuments.value)
})

</script>
