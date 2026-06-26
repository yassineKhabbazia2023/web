<template>
  <PFormItem :pLabel="t('labelTypeReport')" pRequired>
    <PDropdown
      v-model="internalReportUploadInfo.reportTypeId"
      :pPlaceholder="t('placeholderTypeReport')"
      :pOptions="reportTypes"
      data-testid="powerbi-report-types-dropdown"
      @change="handleResetOtherFields"
    />
  </PFormItem>
  <PFormItem :pLabel="t('labelDestinationFolder')" pRequired>
    <PAutocomplete
      v-model="internalReportUploadInfo.accountLabel"
      pClearable
      :pPlaceholder="t('placeholderDestinationFolder')"
      :pFetchSuggestions="handleSearchAccount"
      :pDisabled="!internalReportUploadInfo.reportTypeId"
      data-testid="powerbi-account-search-autocomplete"
      @select="handleSelectAccount"
    >
      <template #prefix>
        <PIcon pName="search" />
      </template>
      <template #default="{ item }">
        <span data-testid="powerbi-account-item">
          {{ `${item.legalName} (${item.accountNumber})` }}
        </span>
      </template>
    </PAutocomplete>
  </PFormItem>
  <PFormItem :pLabel="t('labelNameReport')" pRequired>
    <PDropdown
      v-model="internalReportUploadInfo.reportLabel"
      pAllowCreate
      pFilterable
      :pPlaceholder="t('placeholderNameReport')"
      :pDisabled="!internalReportUploadInfo.accountId"
      :pOptions="reportList"
      data-testid="powerbi-report-name-select"
      @change="handleSelectReportName"
    />
  </PFormItem>
  <div class="flex flex--align-items-center margin-bottom--4">
    <PIcon :color="AppColors.GRAY_300" pName="infoCircle" />
    <span
      class="font-small text-color--neutral-gray-500 margin-left--2"
      data-testid="powerbi-upload-info"
    >
      {{ t('uploadInfo') }}
    </span>
  </div>
  <span class="font-small text-color--neutral-gray-500">
    {{ t('fieldRequired') }}
  </span>
</template>

<script setup lang="ts">
import { logger } from '@pulse/toolbox'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PAutocomplete,
  PDropdown,
  PFormItem,
  PIcon,
} from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import { getSearchParams } from '@pulse/common/utils'
import { PAGE_SIZES } from '@pulse/common/constants'
import { fetchBIReports, fetchReportAccounts } from '@powerbi/services/reporting.service'
import type { Report, ReportInfo } from '@powerbi/types/bi-reports.types'
import type { BIReportInformationProps } from './bi-report-information.types'
import type { Entity } from '@pulse/common/types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      labelTypeReport: 'Report type',
      placeholderTypeReport: 'Select a report type',
      labelDestinationFolder: 'Destination folder',
      placeholderDestinationFolder: 'Search by: name, customer code',
      labelNameReport: 'Name of the report',
      placeholderNameReport: 'Select or enter a name to be displayed on the client side',
      fieldRequired: '* Fields required',
      uploadInfo: 'You can either create a new report or update an existing one',
    },
    'fr-FR': {
      labelTypeReport: 'Type de rapport',
      placeholderTypeReport: 'Sélectionnez un type de rapport',
      labelDestinationFolder: 'Dossier de destination',
      placeholderDestinationFolder: 'Rechercher par : nom, code client',
      labelNameReport: 'Nom du rapport',
      placeholderNameReport: 'Choisir ou saisir un nom qui s\'affichera coté client',
      fieldRequired: '* Champs obligatoires',
      uploadInfo: 'Vous pouvez soit créer un nouveau rapport soit mettre à jour un rapport existant',
    },
  },
})

const props = defineProps<BIReportInformationProps>()
const emit = defineEmits<{
  'update:reportUploadInfo': [ReportInfo]
}>()

type ReportItem = Report & {
  pValue: number
  pLabel: string
}
const reportList = ref<ReportItem[]>([])
const selectedAccountLegalName = ref<string>()

// Computed
const internalReportUploadInfo = computed({
  get() {
    return props.reportUploadInfo
  },
  set(val) {
    emit('update:reportUploadInfo', val)
  },
})

// Functions
const fetchReportNames = async () => {
  const { accountId, reportTypeId } = internalReportUploadInfo.value
  try {
    if (accountId && reportTypeId) {
      const { items } = await fetchBIReports(accountId, reportTypeId)
      reportList.value = items
        .map((item) => ({
          ...item,
          pValue: item.reportId,
          pLabel: item.reportLabel,
        }))

      internalReportUploadInfo.value.reportLabel = items.length === 0 ? `${selectedAccountLegalName.value}` : `${selectedAccountLegalName.value} V${items.length}`
    }
  } catch (error) {
    logger.error('Unable to fetch report names: ', error)
  }
}

const handleResetOtherFields = () => {
  const { reportTypeId, accountId, accountLabel } =
    internalReportUploadInfo.value
  internalReportUploadInfo.value = {
    reportTypeId,
    accountId,
    accountLabel,
  }

  fetchReportNames()
}
const handleSearchAccount = async (queryString: string, callback: any) => {
  const defaulSearch = {
    currentPage: 0,
    limit: PAGE_SIZES[0],
    search: queryString,
    filterByDeploymentStatus: undefined,
  }
  const searchParams = getSearchParams(defaulSearch)
  const { items } = await fetchReportAccounts(searchParams)

  callback(items)
}
const handleSelectAccount = (account: Entity) => {
  internalReportUploadInfo.value.accountId = account.accountId
  internalReportUploadInfo.value.accountLabel = `${account.legalName} (${account.accountNumber})`
  selectedAccountLegalName.value = account.legalName

  fetchReportNames()
}
const handleSelectReportName = (reportId: number) => {
  const report = reportList.value.find(
    (report: Report) => report.reportId === reportId,
  )
  if (report) {
    internalReportUploadInfo.value.reportId = report.reportId
    internalReportUploadInfo.value.reportLabel = report.reportLabel
  }
}
</script>

