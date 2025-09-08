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
          <PTooltip
            :pContent="scope.row.name"
            pPlacement="top"
          >
            <p class="font-semibold margin-left--2" :data-testid="scope.row.name">
              {{ scope.row.legalName }}
            </p>
          </PTooltip>
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
      <template #default="scope">
        <PToolbox
          trigger="click"
          :pElements="getReportActions(scope.row.status.type)"
          pElementsTestId="report-actions-toolbox"
          @p-toolbox-item-clicked="(event) => handleToolboxItemClick(event, scope.row)"
        >
          <PButton pSize="small">
            <PIcon pName="threeDots" />
          </PButton>
        </PToolbox>
      </template>
    </PTableColumn>
  </PTable>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { DATE_TIME_FORMATS as datetimeFormats } from '@pulse/common/i18n'
import { PTable, PTableColumn, PTag, PAvatar, PButton, PIcon, PTooltip, PToolbox } from '@pulse/styleguide/components'
import type { PToolboxItemProps } from '@pulse/styleguide/types'
import { CurrentUserManager } from '@pulse/common/managers'
import { ACTION_PERMISSIONS } from '@pulse/common/constants'
import { ReportTableProps } from './report-table.types'
import { REPORT_ACTIONS } from './constants/report-table.const'
import { ReportStatus } from '@entities/common/types/BIReports.enums'

const { t, d } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  datetimeFormats,
})

defineProps<ReportTableProps>()

const emit = defineEmits<{
  'update-report-status': [number, number, string, ReportStatus]
  'view-report-fullscreen': [number, string, string, string]
  'delete-report': [string, string]
}>()

const handleToolboxItemClick = (action: string, row: any) => {
  const { accountId, reportId, name, embedReportId, embedReportUrl } = row

  switch (action) {
    case REPORT_ACTIONS.ACTIVATE_REPORT:
      emit('update-report-status', accountId, reportId, name, ReportStatus.ONLINE)
      break

    case REPORT_ACTIONS.DEACTIVATE_REPORT:
      emit('update-report-status', accountId, reportId, name, ReportStatus.OFFLINE)
      break

    case REPORT_ACTIONS.VIEW_REPORT:
      emit('view-report-fullscreen', accountId, name, embedReportId, embedReportUrl)
      break

    case REPORT_ACTIONS.DELETE_REPORT:
      emit('delete-report', embedReportId, name)
      break
  }
}

const getReportActions = (status: ReportStatus): PToolboxItemProps[] => {
  return [
    {
      pIconName: 'eye',
      pValue: t('viewReport'),
      pActionName: REPORT_ACTIONS.VIEW_REPORT,
      pState: 'default',
      display: true,
    },
    {
      pIconName: 'checkCircle',
      pValue: t('activateReport'),
      pActionName: REPORT_ACTIONS.ACTIVATE_REPORT,
      pState: 'default',
      display: status === ReportStatus.OFFLINE,
    },
    {
      pIconName: 'xCircle',
      pValue: t('deactivateReport'),
      pActionName: REPORT_ACTIONS.DEACTIVATE_REPORT,
      pState: 'default',
      display: status === ReportStatus.ONLINE,
    },
    {
      pIconName: 'trash',
      pValue: t('deleteReport'),
      pActionName: REPORT_ACTIONS.DELETE_REPORT,
      pState: 'default',
      display: CurrentUserManager.hasPermission(ACTION_PERMISSIONS.DELETE_REPORT),
    },
  ]
    .filter(({ display }) => display)
    .map(({ pIconName, pValue, pActionName, pState }) => ({
      pIconName,
      pValue,
      pActionName,
      pState,
    })) as PToolboxItemProps[]
}

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
  viewReport: 'View Report'
  companyName: 'Company name'
  customerLabel: 'Customer label:'
  initializedOn: 'Initialized on'
  manualUpload: 'Upload Manually'
  deleteReport: 'Delete Report'
  activateReport: 'Activate Report'
  deactivateReport: 'Deactivate Report'
fr-FR:
  status: 'Statut'
  actions: 'Actions'
  updatedOn: 'Mis à jour le'
  clientCode: 'Code client'
  reportType: 'Type de rapport'
  viewReport: 'Voir le rapport'
  companyName: 'Raison sociale'
  customerLabel: 'Libellé client:'
  initializedOn: 'Initialisé le'
  manualUpload: 'Déposer manuellement'
  deleteReport: 'Supprimer le rapport'
  activateReport: 'Activer le rapport'
  deactivateReport: 'Désactiver le rapport'
</i18n>
