<template>
  <div
    v-if="isLoading"
    class="
      documents-list__loader
      flex
      flex--justify-content-center
      margin-top--10
    "
    data-testid="documents-list-loader"
  >
    <PLoader pType="primary" pSize="48" />
  </div>
  <PDocumentsList
    v-else
    :pData="documentsListItems"
    :pVisibleColumns="visibleColumns"
    :pSelectable="selectable"
    pStripe
    @download="downloadDocument"
    @selection-change="onSelectionChange"
  />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { PDocumentsList, PLoader } from '@pulse/styleguide/components'
import type { DocumentsListItem } from '@pulse/styleguide/types'
import { useDocumentsList } from './documents-list.composable'
import type { DocumentsListProps } from './documents-list.types'

defineProps<DocumentsListProps>()

const selectedDocuments = defineModel<DocumentsListItem[]>('selectedDocuments', { default: () => [] })

const { documentsListItems, isLoading, downloadDocument } = useDocumentsList()

const onSelectionChange = (selected: DocumentsListItem[]): void => {
  selectedDocuments.value = selected
}

// Drop any stale selection when the underlying documents change (e.g. after a reload):
// el-table also clears its own checkboxes on data change, keeping model and UI in sync.
watch(documentsListItems, () => {
  selectedDocuments.value = []
})
</script>
