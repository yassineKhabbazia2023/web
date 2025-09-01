<template>
  <PTable
    :pData="pennylaneDocuments"
    @row-click="onClickRow"
  >
    <PTableColumn
      v-for="({ label, prop, sortable }, index) in columns"
      :key="index"
      :pLabel="label"
      :pProp="prop"
      :pSortable="sortable"
      class-name="cursor-pointer"
    >
      <template #default="{ row, column }">
        <PIcon
          v-if="column.property === 'name'"
          :pName="row.iconName"
          pSize="16"
          class="margin-right--2"
        />
        <span
          v-if="column.property === 'updatedAt'"
        >
          {{ d(row[column.property]) }}
        </span>
        <span
          v-if="column.property !== 'updatedAt'"
        >
          {{ row[column.property] }}
        </span>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PTable, PTableColumn, PIcon } from '@pulse/styleguide/components'
import type { PennylaneDocumentsTableFieldKeys, PennylaneDocumentsTableProps } from './pennylane-documents-table.type'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { getPennylaneDocumentsFieldsColumns } from './pennylane-documents-table.helper'

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<PennylaneDocumentsTableProps>()

const labels: Record<PennylaneDocumentsTableFieldKeys, string> = {
  name: t('fields.name'),
  path: t('fields.path'),
  updatedAt: t('fields.updatedAt'),
}
const columns = getPennylaneDocumentsFieldsColumns(labels)

const emit = defineEmits<{
  'open-document': [FormattedPennylaneDocument],
}>()

function onClickRow(pennylaneDocument: FormattedPennylaneDocument) {
  emit('open-document', pennylaneDocument)
}
</script>

<i18n lang="yaml">
  en-US:
    fields:
      name: 'Name'
      path: 'Location'
      updatedAt: 'Uploaded on'
  fr-FR:
    fields:
      name: 'Nom'
      path: 'Emplacement'
      updatedAt: 'Déposé le'
</i18n>
