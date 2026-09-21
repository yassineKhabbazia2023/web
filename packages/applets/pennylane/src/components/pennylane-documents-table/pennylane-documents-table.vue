<template>
  <PResponsiveTable
    :pData="pennylaneDocuments"
    :pEmptyText="t('noResult')"
    pStripe
    pCardClickable
    @cell-click="onClickCell"
    @card-click="onCardClick"
  >
    <PTableColumn
      :pColumnKey="SELECTION_COLUMN_KEY"
      pWidth="46"
      :pShowOverflowTooltip="false"
    >
      <template #header>
        <PCheckbox
          :model-value="areAllDocumentsSelected"
          :pIndeterminate="isDocumentsSelectionIndeterminate"
          pTestId="pennylane-documents-select-all-checkbox"
          @update:model-value="toggleAllSelectedDocuments"
        />
      </template>
      <template #default="{ row }">
        <span @click.stop>
          <PCheckbox
            :model-value="isDocumentSelected(row.id)"
            pTestId="pennylane-documents-select-checkbox"
            @update:model-value="toggleSelectedDocument(row.id)"
          />
        </span>
      </template>
    </PTableColumn>
    <PTableColumn
      v-for="({ label, prop, sortable }, index) in columns"
      :key="index"
      :pLabel="label"
      :pProp="prop"
      :pSortable="sortable"
      class-name="cursor-pointer"
    >
      <template #default="{ row, column }">
        <div
          v-if="column.property === 'name'"
          class="flex flex--align-items-center overflow-hidden"
        >
          <PIcon
            :pName="row.iconName"
            pSize="16"
            class="margin-right--2"
          />
          <div
            class="
              flex--grow-1
              flex--shrink-1
              overflow-hidden
            "
          >
            <PTooltip
              :pContent="row.name"
            >
              <div
                class="
                  overflow-hidden
                  no-wrap
                  text-overflow--ellipsis
                "
              >
                {{ row.name }}
              </div>
            </PTooltip>
          </div>
        </div>
        <span
          v-if="column.property === 'updatedAt'"
        >
          {{ d(row[column.property]) }}
        </span>
        <PToolbox
          v-if="column.property === 'actions'"
          :pElements="toolboxElements"
          pTrigger="click"
          @p-toolbox-item-clicked="onToolboxItemClick($event, row)"
        >
          <PButton
            class="margin-left--1"
            @click.stop
          >
            <PIcon pName="threeDots" />
          </PButton>
        </PToolbox>
        <span
          v-if="column.property !== 'name' && column.property !== 'updatedAt' && column.property !== 'actions'"
        >
          {{ row[column.property] }}
        </span>
      </template>
    </PTableColumn>

    <template #mobile-title="{ row }">
      <div class="flex flex--align-items-center overflow-hidden">
        <span
          class="margin-right--3"
          @click.stop
        >
          <PCheckbox
            :model-value="isDocumentSelected(row.id)"
            pTestId="pennylane-documents-select-checkbox-mobile"
            @update:model-value="toggleSelectedDocument(row.id)"
          />
        </span>
        <PIcon
          :pName="row.iconName"
          pSize="32"
          class="margin-right--3"
        />
        <div class="overflow-hidden">
          <PTooltip
            :pContent="row.name"
          >
            <p
              class="
                font-bold
                overflow-hidden
                no-wrap
                text-overflow--ellipsis
              "
            >
              {{ row.name }}
            </p>
          </PTooltip>
          <p
            class="
              font-small
              text-color--gray-500
              overflow-hidden
              no-wrap
              text-overflow--ellipsis
            "
          >
            {{ row.path }}
          </p>
          <p class="font-small text-color--gray-500">
            {{ t('fields.updatedAt') }} : {{ d(row.updatedAt) }}
          </p>
        </div>
      </div>
    </template>
  </PResponsiveTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { TableColumnCtx } from '@pulse/styleguide/types'
import { logger } from '@pulse/toolbox'
import {
  PResponsiveTable,
  PTableColumn,
  PIcon,
  PToolbox,
  PButton,
  PTooltip,
  PCheckbox,
} from '@pulse/styleguide/components'
import type {
  PennylaneDocumentsTableFieldKeys,
  PennylaneDocumentsTableProps,
  PennylaneDocumentsTableActionName,
} from './pennylane-documents-table.type'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import type { PennylaneDocument } from '@pulse/common/types'
import { getPennylaneDocumentsFieldsColumns, getToolboxElements } from './pennylane-documents-table.helper'
import { usePennylaneDocumentsTableSelection } from './pennylane-documents-table.composable'
import { downloadDocument } from '@pennylane/helpers/pennylane-documents.helper'
import { PennylaneService } from '@pulse/common/services/pennylane'
import { PNotification, displayNotification } from '@pulse/styleguide'

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      fields: {
        name: 'Name',
        path: 'Location',
        updatedAt: 'Uploaded on',
      },
      actions: {
        download: 'Download',
      },
      messages: {
        'download-in-progress': 'Download in progress',
        'download-success': 'Document downloaded successfully',
        'download-error': 'A technical error occurred while downloading the document',
      },
      noResult: 'No result',
    },
    'fr-FR': {
      fields: {
        name: 'Nom',
        path: 'Emplacement',
        updatedAt: 'Déposé le',
      },
      actions: {
        download: 'Télécharger',
      },
      messages: {
        'download-in-progress': 'Téléchargement en cours',
        'download-success': 'Document téléchargé avec succès',
        'download-error': 'Une erreur technique est survenue lors du téléchargement du document',
      },
      noResult: 'Aucun résultat',
    },
  },
})

const SELECTION_COLUMN_KEY = 'selection'

const props = defineProps<PennylaneDocumentsTableProps>()
const selectedDocumentIds = defineModel<PennylaneDocument['id'][]>('selectedDocumentIds', { default: () => [] })

const {
  areAllDocumentsSelected,
  isDocumentsSelectionIndeterminate,
  isDocumentSelected,
  toggleSelectedDocument,
  toggleAllSelectedDocuments,
} = usePennylaneDocumentsTableSelection(() => props.pennylaneDocuments, selectedDocumentIds)

const toolboxElements = getToolboxElements({
  downloadLabel: t('actions.download'),
})

const labels: Record<PennylaneDocumentsTableFieldKeys, string> = {
  name: t('fields.name'),
  path: t('fields.path'),
  updatedAt: t('fields.updatedAt'),
  actions: '',
}
const columns = getPennylaneDocumentsFieldsColumns(labels)

const emit = defineEmits<{
  'open-document': [FormattedPennylaneDocument],
}>()

// Mobile cards have no columns, so they report the whole row: on desktop, cell-click handles it instead
function onCardClick(row: Record<string, any>) {
  emit('open-document', row as FormattedPennylaneDocument)
}

function onClickCell(
  pennylaneDocument: FormattedPennylaneDocument,
  column: TableColumnCtx<FormattedPennylaneDocument>,
) {
  if (column.property === 'actions' || column.columnKey === SELECTION_COLUMN_KEY) {
    return
  }
  emit('open-document', pennylaneDocument)
}

async function onToolboxItemClick(
  actionName: PennylaneDocumentsTableActionName,
  pennylaneDocument: FormattedPennylaneDocument,
) {
  if (actionName === 'download') {
    const inProgressNotification = PNotification({
      message: t('messages.download-in-progress'),
      iconName: 'loaderGradient',
      showClose: true,
      customClass: 'loading',
      position: 'bottom-right',
      duration: 0,
    })
    try {
      const documentSrc = await PennylaneService.getDocumentContent(
        props.accountNumber,
        props.accountId,
        pennylaneDocument.id,
      )
      inProgressNotification.close()

      await downloadDocument({
        documentSrc: documentSrc,
        documentName: pennylaneDocument.name,
        successMessage: t('messages.download-success'),
        errorMessage: t('messages.download-error'),
      })
    } catch (e) {
      logger.error('Error while downloading document', e)
      inProgressNotification.close()
      displayNotification('error', t('messages.download-error'))
    }

  }
}
</script>
