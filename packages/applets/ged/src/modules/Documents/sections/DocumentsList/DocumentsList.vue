<template>
  <section v-bind="$attrs" class="documents-table">
    <PTable
      v-if="documentsListWithTableStructure.documentsPage.items"
      ref="documentsListTable"
      :pData="documentsListWithTableStructure.documentsPage.items"
      highlightCurrentRow
      pStripe
      data-testid="ged-documents-list"
      :rowClassName="tableRowClassName"
      currentRowKey="id"
      :emptyText="t('noSearchData')"
      class="ged-documents-list"
      @sort-change="handleSortChange"
      @row-click="selectRow"
      @row-dblclick="handleRowDoubleClick"
      @selection-change="handleSelectionChange"
      @row-contextmenu="contextMenuTrigger"
    >
      <!-- Align selection column and header -->
      <PTableColumn width="4" label="" />

      <PTableColumn type="selection" />
      <PTableColumn
        v-for="(column, index) in documentsListWithTableStructure.documentHeaders"
        :key="index"
        :label="column.columnName"
        :width="columnSizes[column.columnName]"
        :sortable="sortableColumns.includes(column.columnName)"
        :align="getRowAlignmentClass(index, documentsListWithTableStructure.documentHeaders)"
      >
        <template #default="scope">
          <TableElement
            v-if="scope.row"
            :isInSearchScope="isInSearchScope"
            :fieldType="column.fieldType"
            :fieldName="column.columnName"
            :data="scope.row"
            @actions-dropdown-opened="selectRow"
            @document-name-clicked="handleDocumentNameClick"
            @toolbox-action-triggered="handleToolboxActionTriggered"
          />
        </template>
      </PTableColumn>
    </PTable>

    <div class="blur-fade" />
    <PToolbox
      ref="tableToolbox"
      trigger="contextmenu"
      :pElements="toolboxBasicData"
      :pCoordinates="toolboxCoordinates"
      :teleported="false"
      @p-toolbox-item-clicked="contextMenuHandleToolboxActionTriggered"
    >
      <div />
    </PToolbox>
  </section>

  <!-- This is necessary because of how the dragImage is working in the drag and drop API
  when making the reference element hidden, it has to be placed in the  -->
  <Teleport to="body">
    <DocumentDragGhost
      ref="ghostRef"
      :displayedName="draggedFilenameToUse"
      :numberOfDocuments="draggedDocuments.length"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { PTable, PTableColumn, PToolbox } from '@pulse/styleguide/components'
import TableElement from './components/TableElement'
import { returnSortQueryField } from '@ged/modules/Documents/helpers/sortHelper'
import { generateToolboxBasicData } from '@ged/modules/common/helpers/toolboxHelper'
import type { ElDropdown, ElTable } from 'element-plus'
import type { Coordinate, Document, TableRowDocument } from '@ged/models/Document'
import { ref, watch, computed, useTemplateRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocumentsDragAndDrop } from './composables/DocumentsDragAndDrop'
import DocumentDragGhost from './components/DocumentDragGhost'
import { getRowAlignmentClass, getRowClasses, getDocumentIndex, getShouldOpenDrawer } from './documents-list.manager'
import { DocumentsListProps, DocumentListTableColumn } from './documents-list.types'
import type { DocumentAction } from '@ged/modules/Documents/DocumentsTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})
const tableToolbox = useTemplateRef('tableToolbox')
const toolboxCoordinates = ref<Coordinate>({
  x: 0,
  y: 0,
})
const toolboxBasicData = ref()
const contextmenuRow = ref<TableRowDocument>()

const emit = defineEmits([
  'on-sort-change',
  'toolbox-action-triggered',
  'actionbar-button-clicked',
  'document-selection-change',
  'on-selection-change',
  'table-row-clicked',
  'document-name-clicked',
  'table-row-double-clicked',
])

const props = defineProps<DocumentsListProps>()
const documentsListTable = ref<InstanceType<typeof ElTable>>()
const selectedDocuments = ref<DocumentsListProps['documentsListWithTableStructure']['documentsPage']['items']>([])
const sortableColumns = ['Nom du document', 'Déposé le']
const columnSizes: Record<string, number> = {
  '': 125,
  'Déposé le': 125,
  Statut: 125,
  Actions: 71,
}

const isInSearchScope = ref(props.isInSearchScope)
watch(
  () => [props.isInSearchScope],
  () => {
    isInSearchScope.value = props.isInSearchScope
  },
)

const draggedDocuments = ref<Document[]>([])
const draggedFilenameToUse = computed(() => selectedDocuments.value.at(0)?.name ?? '')
const currentService = computed(() => props.currentService)
const { isDragging } = useDocumentsDragAndDrop(
  selectedDocuments,
  currentService,
  draggedDocuments,
)

// Behaviours
const handleSortChange = (data:any) => {
  const columnLabel = data.column.label
  const order = data.order
  const sortQueryField = returnSortQueryField(columnLabel, order)
  emit('on-sort-change', sortQueryField)
}

const handleToolboxActionTriggered = (action: DocumentAction) => {
  emit('toolbox-action-triggered', action)
}

const contextMenuHandleToolboxActionTriggered = (action: DocumentAction) => {
  if (contextmenuRow.value) {
    if (!selectedDocuments.value.includes(contextmenuRow.value)) {
      selectRow(contextmenuRow.value, { label: t('actions') })
    }
    handleToolboxActionTriggered(action)
  }
}


const tableRowClassName = ({
  row,
}: {
  row: Document
}) => {
  return getRowClasses({
    document: row,
    draggedDocuments: draggedDocuments.value,
    isDragging: isDragging.value,
  })
}

const selectRow = (documentRow: TableRowDocument, _column: DocumentListTableColumn) => {
  // Need to cast as we Vue / TS doesn't infer the $refs value
  const documentsListTableInstance =
    documentsListTable.value
      ?.$refs.table as InstanceType<typeof ElTable>
  documentsListTableInstance?.clearSelection()
  documentsListTableInstance?.toggleRowSelection(documentRow, true)
}

function handleDocumentNameClick(document: TableRowDocument, column:any) {
  const shouldOpenDrawer = getShouldOpenDrawer(props.documentsListWithTableStructure.documentHeaders, column)
  document._rowIndex = getDocumentIndex(document, props.documentsListWithTableStructure.documentsPage.items)
  if (shouldOpenDrawer) {
    emit('document-name-clicked', document)
  }
}

function handleRowDoubleClick(document: TableRowDocument, column:any) {
  const shouldOpenDrawer = getShouldOpenDrawer(props.documentsListWithTableStructure.documentHeaders, column)
  document._rowIndex = getDocumentIndex(document, props.documentsListWithTableStructure.documentsPage.items)

  if (shouldOpenDrawer) {
    emit('table-row-double-clicked', document)
  }
}

const handleSelectionChange = (documentsSelection:Document[]) => {
  selectedDocuments.value = documentsSelection
  emit('document-selection-change', selectedDocuments.value)
  // Need to cast as we Vue / TS deosn't infer the $refs value
  const documentsListTableInstance =
    documentsListTable.value
      ?.$refs.table as InstanceType<typeof ElTable>

  if (documentsSelection.length === 0) {
    documentsListTableInstance?.setCurrentRow(undefined)
  }
}

const getToolboxBasicData = (permissions: string[], isInSearchScope: boolean) => {
  if (permissions) {
    return generateToolboxBasicData('Documents', permissions, isInSearchScope)
  } else {
    return []
  }
}

const contextMenuTrigger = (row: TableRowDocument, _: any, event: MouseEvent) => {
  event.preventDefault()
  setToolboxStyle(event.clientX, event.clientY)
  toolboxBasicData.value = getToolboxBasicData(row.permissions, props.isInSearchScope)
  contextmenuRow.value = row
  // Cast to avoid the build error : Property 'handleOpen' does not exist
  const dropdownInstance = tableToolbox.value?.$refs?.dropdownRef as InstanceType<typeof ElDropdown> | undefined
  if (dropdownInstance) {
    dropdownInstance.handleOpen()
  }
}

const setToolboxStyle = (clientX: number, clientY: number) => {
  const tableBody = document.querySelector('.el-table__body')
  if (!tableBody) {
    return
  }
  const buffer = 60
  const tableRect = tableBody.getBoundingClientRect()
  const offsetX = clientX - tableRect.left
  const offsetY = clientY - tableRect.top + buffer
  toolboxCoordinates.value.x = offsetX
  toolboxCoordinates.value.y = offsetY
}
</script>

<style lang="scss" scoped>
  .documents-table {
    position: relative;
    // header height - entity information height - breadcrumb height - action bar wrapper height
    // - pagination wrapper height - paddings
    height: 100%;
    max-height: calc(100vh - 48px - 32px - 52px - 80px - 46px);
    width: 100%;
    overflow-y: auto;

    &--search {
      // when search is enabled, the alert changes the remaining height of the page
      // Taking the same calculation - alert height - alert top padding
      max-height: calc(100vh - 48px - 32px - 52px - 80px - 46px - 41px - 8px);
    }

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
<style lang="scss">
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

.ged-documents-list {
  .current-row > td:first-child {
    border-left: 4px solid var(--p-jungle-400);

    .cell {
      padding-left: 0.8rem;
    }
  }
}
</style>
<i18n lang="json">
{
  "en-US": {
    "noSearchData": "Aucun résultat"
  },
  "fr-FR": {
    "noSearchData": "Aucun résultat"
  }
}
</i18n>
