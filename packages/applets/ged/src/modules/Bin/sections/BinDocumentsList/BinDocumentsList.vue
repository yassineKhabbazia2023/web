<template>
  <section class="bin-documents-table">
    <PTable
      v-if="binDocuments.documentsPage.items"
      :pData="binDocuments.documentsPage.items"
      ref="documentsListTable"
      highlightCurrentRow
      pStripe
      @sort-change="handleSortChange"
    >
      <!-- That is the current way of adding paddings without overriding styleguide -->
      <PTableColumn width="22" label="" />

      <PTableColumn
        v-for="(
          column, index
        ) in binDocuments.documentHeaders"
        :key="index"
        :label="column.columnName"
        :minWidth="columnSizes[column.columnName]"
        :sortable="sortableColumns.includes(column.columnName)"
      >
        <template #default="scope">
          <BinTableElement
            v-if="scope.row"
            :fieldType="column.fieldType"
            :data="scope.row"
            @restore-document-action="restoreDocument"
          />
        </template>
      </PTableColumn>

      <!-- That is the current way of adding paddings without overriding styleguide -->
      <PTableColumn width="24" label="" />
    </PTable>

    <div class="blur-fade" />
  </section>
</template>

<script setup lang="ts">
/* eslint-disable vitest/require-hook */
import type { BinDocumentsListProps } from './BinDocumentsListTypes'
import BinTableElement from './components/BinTableElement'
import { PTable, PTableColumn } from '@kpmg/styleguide'
import { returnSortQueryField } from '@ged/modules/Documents/helpers/sortHelper'
import type { BinDocument } from '@ged/models/Document'

defineProps<BinDocumentsListProps>()

const emit = defineEmits<{
  'on-sort-change': [string]
  'restore-document-action': [BinDocument]
}>()

const sortableColumns = ['Nom du document', 'Supprimé le']
// Column size calculation is a current topic we're discusing
// Meanwhile, it is done here in a raw manner
const columnSizes: Record<string, number> = {
  'Nom du document': 770,
  'Supprimé le': 160,
  '': 72,
}

const handleSortChange = (data:any) => {
  const columnLabel = data.column.label
  const order = data.order
  const sortQueryField = returnSortQueryField(columnLabel, order)
  emit('on-sort-change', sortQueryField)
}

const restoreDocument = (doc: BinDocument) => {
  emit('restore-document-action', doc)
}
</script>

<style lang="scss" scoped>
  .bin-documents-table {
    position: relative;
    // header height - breadcrumb height
    // - pagination wrapper height - paddings
    height: 100%;
    max-height: calc(100vh - 32px - 80px - 46px);
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
