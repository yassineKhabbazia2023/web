<template>
  <PTable
    :pData="reports"
    tableLayout="fixed"
    showOverflowTooltip
    pStripe
  >
    <PTableColumn
      :pLabel="t('companyName')"
      pProp="name"
      pSortable
      pMinWidth="120px"
    >
      <template #default="scope">
        <div class="flex flex--align-items-center overflow-hidden">
          <PAvatar
            pColor="amethyste"
            pType="xsmall"
          >
            <PIcon pName="pulse" />
          </PAvatar>
          <p
            class="font-semibold margin-left--2"
          >
            {{ scope.row.name }}
          </p>
        </div>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('clientCode')"
      pProp="accountNumber"
      pSortable
    />
    <PTableColumn
      :pLabel="t('reportType')"
      pProp="reportType"
      pSortable
    >
      <template #default="scope">
        <PTooltip
          :pContent="`${t('customerLabel')} ${scope.row.type.customerLabel}`"
          pPlacement="top"
        >
          <p>{{ scope.row.type.collaboratorLabel }}</p>
        </PTooltip>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('initializedOn')"
      pProp="initializedOn"
      pSortable
    >
      <template #default="scope">
        <p>{{ getReportFormattedDate(scope.row.creationDate) }}</p>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('updatedOn')"
      pProp="updatedOn"
      pSortable
    >
      <template #default="scope">
        <p>{{ getReportFormattedDate(scope.row.dataUpdateDate) }}</p>
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('status')"
      :pWidth="150"
      pProp="status"
      pSortable
    >
      <template #default="scope">
        <PTag
          :pContent="scope.row.status.text"
          :pColor="scope.row.status.color"
          :pIconLeftName="scope.row.status.iconName"
          pEffect="light"
          style="width: 70%"
          pRound
        />
      </template>
    </PTableColumn>
    <PTableColumn
      :pLabel="t('actions')"
      :pWidth="100"
      pProp="actions"
    >
      <template #default="">
        <PButton pSize="small">
          <PIcon pName="threeDots" />
        </PButton>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DATE_TIME_FORMATS as datetimeFormats } from '@entities/constants'
import { PTable, PTableColumn, PTag, PAvatar, PButton, PIcon, PTooltip } from '@pulse/styleguide/components'
import { ReportTableProps } from './report-table.types'

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

defineProps<ReportTableProps>()

const getReportFormattedDate = (dateString: string) => {
  return dateString ? d(new Date(dateString), 'short') : '-'
}
</script>

<i18n lang="yaml">
en-US:
  status: 'Status'
  actions: 'Actions'
  updatedOn: 'Updated on'
  clientCode: 'Client code'
  reportType: 'Report type'
  companyName: 'Company name'
  customerLabel: 'Customer label:'
  initializedOn: 'Initialized on'
  manualUpload: 'Upload Manually'
fr-FR:
  status: 'Statut'
  actions: 'Actions'
  updatedOn: 'Mis à jour le'
  clientCode: 'Code client'
  reportType: 'Type de rapport'
  companyName: 'Raison sociale'
  customerLabel: 'Libellé client:'
  initializedOn: 'Initialisé le'
  manualUpload: 'Déposer manuellement'
</i18n>
