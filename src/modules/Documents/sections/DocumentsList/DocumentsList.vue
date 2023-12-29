<template>
 <section class="documents-table">
  <PTable
  :pData="documentsListWithTableStructure.documentsPage.items"
  ref="documentsListTable"
  highlightCurrentRow
  pStripe
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
        @actions-dropdown-opened="selectRow(scope?.row, scope?.column)"
        />
      </template>
    </PTableColumn>

    <!-- That is the current way of adding paddings without overriding styleguide -->
    <PTableColumn width="40" label="" />
  </PTable>

  <div class="blur-fade" />
 </section>
</template>

<script setup lang="ts">
import type { DocumentsListProps } from './DocumentsListTypes'
import { PTable, PTableColumn } from '@kpmg/styleguide'
import TableElement from './components/TableElement'
import { returnSortQueryField } from '@/modules/Documents/helpers/sortHelper'
import type { ElTable } from 'element-plus'
import { Document, TableRowDocument } from '@/models/Document'
import { ref } from 'vue'

const emit = defineEmits([
  'on-sort-change',
  'toolbox-action-triggered',
  'actionbar-button-clicked',
  'document-selection-change',
  'on-selection-change',
  'table-row-clicked'
])

const props = defineProps<DocumentsListProps>()

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

const selectRow = (documentRow: TableRowDocument, column:any) => {
  const shouldOpenDrawer = props.documentsListWithTableStructure.documentHeaders
    .filter(h => h.columnName === column.label).length > 0 &&
    column !== undefined &&
    column.label !== 'Actions'

  if (shouldOpenDrawer) {
    emit('table-row-clicked', documentRow)
  } else {
    const documentsListTableInstance =
    documentsListTable.value
      ?.$refs.table as InstanceType<typeof ElTable>

    documentsListTableInstance?.clearSelection()
    documentsListTableInstance?.toggleRowSelection(documentRow, true)
  }

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

<style lang="scss">
  .documents-table {
    position: relative;
    // header height - breadcrumb height - action bar wrapper height
    // - pagination wrapper height - paddings
    height: 100%;
    max-height: calc(100vh - 32px - 52px - 80px - 46px);
    width: 100%;
    overflow-y: auto;

    .blur-fade {
      position: sticky;
      width: 100%;
      height: 32px;
      bottom: 0;
      background: linear-gradient(to bottom, transparent, white);
      z-index: 1;
      pointer-events: none;
    }
  }
</style>
<style>
::-webkit-scrollbar {
    height: 8px;
    width: 8px;
    background: transparent;
}

::-webkit-scrollbar-thumb {
    background: #90939999;
    -webkit-border-radius: 1ex;
    -webkit-box-shadow: 0px 1px 2px #909399AA;
}

::-webkit-scrollbar-corner {
    background: #90939999;
}
</style>
