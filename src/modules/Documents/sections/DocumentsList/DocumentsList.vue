<template>
 <section>
  {{ t('ActionsAndFiltersPart') }}
  <PTable
  :data="documentsListWithTableStructure.documentsPage.items"
  style="width: 100%"
  @sort-change="handleSortChange"
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

<i18n lang="yaml">
  fr-FR:
    ActionsAndFiltersPart: "Action and filter sections will be here"
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { DocumentsListProps } from './DocumentsListTypes'
import { PTable, PTableColumn } from '@kpmg/styleguide'
import TableElement from './components/TableElement'
import { returnSortQueryField } from '@/modules/Documents/helpers/sortHelper'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits([
  'on-sort-change'
])

defineProps<DocumentsListProps>()

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

</script>
