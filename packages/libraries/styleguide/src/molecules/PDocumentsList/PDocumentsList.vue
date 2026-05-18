<template>
  <PTable
    :pData="pData"
    :pStripe="pStripe"
    pRowKey="documentId"
  >
    <PTableColumn
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
      pLabel="Déposé le"
      pProp="documentDepositDate"
      pSortable
      :pSortMethod="sortByDepositDate"
    />

    <PTableColumn
      pLabel="Options"
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
import { getIconName } from '../../utils/fileExtension'
import type { DocumentsListItem, PDocumentsListProps } from './PDocumentsListTypes'

withDefaults(defineProps<PDocumentsListProps>(), {
  pStripe: false,
})

const emit = defineEmits<{
  download: [documentId: string]
  option: [event: string, documentId: string]
}>()

const hasCustomOptions = (row: DocumentsListItem): boolean => {
  return row.options !== undefined && row.options.length > 0
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

