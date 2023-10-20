<template>
 <section>
  <DocumentsActionsBar :permissions="permissionsList"/>
  <PTable
  :data="documentsListWithTableStructure.documentsPage.items"
  style="width: 100%"
  @sort-change="handleSortChange"
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
        :data="scope.row"/>
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
import DocumentsActionsBar from '@/modules/Documents/sections/DocumentsActions'
import { Document } from '@/models/Document'
import { computed, ref } from 'vue'
import { getPermissionsFromDocuments } from '@/modules/Documents/helpers/documentSelectionHelper'

const emit = defineEmits([
  'on-sort-change',
  'on-selection-change'
])

defineProps<DocumentsListProps>()
const seletedDocuments = ref<Document[]>([])
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
const handleSelectionChange = (val: Document[]) => {
  seletedDocuments.value = val
  emit('on-selection-change', seletedDocuments.value)

}

const permissionsList = computed(() => {
  return getPermissionsFromDocuments(seletedDocuments.value)
})
</script>
