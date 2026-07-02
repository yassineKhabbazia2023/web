<template>
  <PTable
    :pData="pData"
    :pStripe="pStripe"
    pRowKey="documentId"
    @selection-change="onSelectionChange"
  >
    <PTableColumn
      v-if="pSelectable"
      pType="selection"
      pWidth="48"
    />

    <PTableColumn
      v-if="isColumnVisible('name')"
      pLabel="Nom du document"
      pProp="documentName"
      pSortable
    >
      <template #default="{ row }">
        <div
          class="
            p-documents-list__name-cell
            flex
            flex--align-items-center
          "
        >
          <PIcon
            class="margin-right--2"
            :pName="getIconName(row.documentName, 'filetypeNone')"
            pSize="16"
          />
          <span
            class="
              overflow-hidden
              text-overflow--ellipsis
              no-wrap
            "
          >{{ row.documentName }}</span>
        </div>
      </template>
    </PTableColumn>

    <PTableColumn
      v-if="isColumnVisible('depositedBy')"
      pLabel="Déposé par"
      pProp="documentDepositedBy"
      pSortable
    >
      <template #default="{ row }">
        <div
          class="
            p-documents-list__deposited-by-cell
            flex
            flex--align-items-center
          "
        >
          <PAvatar
            v-if="hasDepositedBy(row)"
            class="margin-right--2"
            pType="xsmall"
            pColor="fuschia"
          >
            {{ row.documentDepositedByInitials }}
          </PAvatar>
          <span
            class="
              overflow-hidden
              text-overflow--ellipsis
              no-wrap
            "
          >{{ row.documentDepositedBy }}</span>
        </div>
      </template>
    </PTableColumn>

    <PTableColumn
      v-if="isColumnVisible('depositDate')"
      pLabel="Déposé le"
      pProp="documentDepositDate"
      pWidth="100"
      pSortable
      :pSortMethod="sortByDepositDate"
    />

    <PTableColumn
      v-if="isColumnVisible('options')"
      pLabel="Actions"
      pAlign="right"
      pWidth="160"
    >
      <template #default="{ row }">
        <div
          class="
            p-documents-list__options-cell
            flex
            flex--align-items-center
            flex--justify-content-flex-end
          "
        >
          <template v-if="hasCustomOptions(row)">
            <PButton
              v-for="option in row.options"
              :key="option.event"
              class="el-button--icon"
              @click="onOptionClick(option.event, row.documentId)"
            >
              <PIcon :pName="option.iconName" />
            </PButton>
          </template>
          <PButton
            v-else
            class="el-button--icon"
            @click="onDownloadClick(row.documentId)"
          >
            <PIcon pName="download" />
          </PButton>
        </div>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script lang="ts" setup>
import PTable from '../../atoms/PTable'
import PTableColumn from '../../atoms/PTableColumn'
import PIcon from '../../atoms/PIcon'
import PButton from '../../atoms/PButton'
import PAvatar from '../../atoms/PAvatar'
import { getIconName } from '../../utils/fileExtension'
import { PDOCUMENTS_LIST_DEFAULT_COLUMNS } from './PDocumentsListTypes'
import type { DocumentsListItem, PDocumentsListColumn, PDocumentsListProps } from './PDocumentsListTypes'

const props = withDefaults(defineProps<PDocumentsListProps>(), {
  pStripe: false,
  pVisibleColumns: () => PDOCUMENTS_LIST_DEFAULT_COLUMNS,
  pSelectable: false,
})

const isColumnVisible = (column: PDocumentsListColumn): boolean =>
  props.pVisibleColumns.includes(column)

const emit = defineEmits<{
  download: [documentId: string]
  option: [event: string, documentId: string]
  'selection-change': [selected: DocumentsListItem[]]
}>()

const onSelectionChange = (selected: DocumentsListItem[]): void => {
  emit('selection-change', selected)
}

const hasCustomOptions = (row: DocumentsListItem): boolean => {
  return row.options !== undefined && row.options.length > 0
}

const hasDepositedBy = (row: DocumentsListItem): boolean => {
  return row.documentDepositedBy !== undefined && row.documentDepositedBy !== ''
}

const parseDepositDate = (date: string): number => {
  const [day, month, year] = date.split('/').map(Number)
  return new Date(year, month - 1, day).getTime()
}

const sortByDepositDate = (a: DocumentsListItem, b: DocumentsListItem): number => {
  return parseDepositDate(a.documentDepositDate) - parseDepositDate(b.documentDepositDate)
}

const onDownloadClick = (documentId: string): void => {
  emit('download', documentId)
}

const onOptionClick = (event: string, documentId: string): void => {
  emit('option', event, documentId)
}
</script>

