<template>
 <section>
  <PTable
  :data="documentsListWithTableStructure.documentsPage.items"
  style="width: 100%"
  ref="documentsListTable"
  highlightCurrentRow
  @sort-change="handleSortChange"
  @row-click="selectRow"
  @selection-change="handleSelectionChange"
  >
    <!-- That is the current way of adding paddings without overriding styleguide -->
    <PTableColumn width="32" label="" />

    <PTableColumn type="selection" />
    <PTableColumn
      v-for="(column, index) in documentsListWithTableStructure.documentHeaders"
      :key="index"
      :label="column.columnName"
      :minWidth="columnSizes[column.columnName]"
      :sortable="sortableColumns.includes(column.columnName)"
    >
      <template #default="scope">
        <TableElement
        :fieldType="column.fieldType"
        :fieldName="column.columnName"
        :data="scope.row"
        @toolbox-action-triggered="handleToolboxActionTriggered"
        @actions-dropdown-opened="selectRow(scope?.row)"
        />
      </template>
    </PTableColumn>

    <!-- That is the current way of adding paddings without overriding styleguide -->
    <PTableColumn width="40" label="" />
  </PTable>
 </section>
</template>

<script setup lang="ts">
import type { DocumentsListProps } from './DocumentsListTypes'
import { PTable, PTableColumn } from '@kpmg/styleguide'
import TableElement from './components/TableElement'
import { returnSortQueryField } from '@/modules/Documents/helpers/sortHelper'
import type { ElTable } from 'element-plus'
import { Document } from '@/models/Document'
import { ref } from 'vue'

const emit = defineEmits([
  'on-sort-change',
  'toolbox-action-triggered',
  'actionbar-button-clicked',
  'document-selection-change',
  'on-selection-change'
])

defineProps<DocumentsListProps>()

const documentsListTable = ref<InstanceType<typeof ElTable>>()
const selectedDocuments = ref<Document[]>([])
const sortableColumns = ['Nom du document', 'Déposé le']
const columnSizes: Record<string, number> = {
  'Nom du document': 590,
  '': 199,
  'Déposé le': 199,
  Statut: 199,
  Actions: 71
}

// Behaviours
const handleSortChange = (data:any) => {
  const columnLabel = data.column.label
  const order = data.order
  const sortQueryField = returnSortQueryField(columnLabel, order)
  emit('on-sort-change', sortQueryField)
}

const handleToolboxActionTriggered = (action: string) => {
  emit('toolbox-action-triggered', action)
}

const selectRow = (documentRow: Document) => {
  const documentsListTableInstance =
    documentsListTable.value
      ?.$refs.table as InstanceType<typeof ElTable>

  documentsListTableInstance?.clearSelection()
  documentsListTableInstance?.toggleRowSelection(documentRow, true)
}

const handleSelectionChange = (documentsSelection:Document[]) => {
  selectedDocuments.value = documentsSelection
  emit('document-selection-change', selectedDocuments.value)
  const documentsListTableInstance =
    documentsListTable.value
      ?.$refs.table as InstanceType<typeof ElTable>

  if (documentsSelection.length === 0) {
    documentsListTableInstance?.setCurrentRow(undefined)
  }
}

</script>
