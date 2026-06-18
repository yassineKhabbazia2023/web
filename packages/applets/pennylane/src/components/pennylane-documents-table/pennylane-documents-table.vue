<template>
  <PResponsiveTable
    :pData="pennylaneDocuments"
    :empty-text="t('noResult')"
    pStripe
    pCardClickable
    @cell-click="onClickCell"
    @row-click="onRowClick"
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
import { TableColumnCtx } from 'element-plus'
import { logger } from '@pulse/toolbox'
import { PResponsiveTable, PTableColumn, PIcon, PToolbox, PButton, PTooltip } from '@pulse/styleguide/components'
import type {
  PennylaneDocumentsTableFieldKeys,
  PennylaneDocumentsTableProps,
  PennylaneDocumentsTableActionName,
} from './pennylane-documents-table.type'
import type { FormattedPennylaneDocument } from '@pennylane/types/pennylane-documents.type'
import { getPennylaneDocumentsFieldsColumns, getToolboxElements } from './pennylane-documents-table.helper'
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

const props = defineProps<PennylaneDocumentsTableProps>()

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

function onRowClick(row: Record<string, any>) {
  emit('open-document', row as FormattedPennylaneDocument)
}

function onClickCell(
  pennylaneDocument: FormattedPennylaneDocument,
  column: TableColumnCtx<FormattedPennylaneDocument>,
) {
  if (column.property === 'actions') {
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
