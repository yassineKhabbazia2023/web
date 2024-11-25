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
        <PIcon>
          <PISearch />
        </PIcon>
      </template>
      <template #default="{ item }">
        <span data-testid="powerbi-account-item">
          {{ `${item.legalName} (${item.accountNumber})` }}
        </span>
      </template>
    </PAutocomplete>
  </PFormItem>
  <PFormItem :pLabel="t('labelNameReport')" pRequired>
    <PSelect
      v-model="internalReportUploadInfo.reportLabel"
      pAllowCreate
      pFilterable
      :pPlaceholder="t('placeholderNameReport')"
      :pDisabled="!internalReportUploadInfo.accountId"
      data-testid="powerbi-report-name-select"
      @change="handleSelectReportName"
    >
      <POption
        v-for="reportLabel in reportList"
        :key="reportLabel.reportId"
        :pLabel="reportLabel.reportLabel"
        :pValue="reportLabel.reportId"
      />
    </PSelect>
  </PFormItem>
  <div class="flex flex--align-items-center margin-bottom--4">
    <PIcon :color="AppColors.GRAY_300">
      <PIInfoCircle />
    </PIcon>
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
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PAutocomplete,
  PDropdown,
  PFormItem,
  PIcon,
  PISearch,
  PSelect,
  POption,
  PIInfoCircle,
} from '@pulse/styleguide/components'
import { AppColors } from '@pulse/styleguide'
import { getSearchParams } from '@entities/pages/wallet/pages/folders/DeployUtils'
import { PAGE_SIZES } from '@entities/constants'
import { fetchBIReports, fetchReportAccounts } from '@entities/services/reporting'
import type { Report } from '@entities/pages/power-bi/pages/bi-reports/BIReportsTypes'
import type { BIReportInformationProps } from './BIReportInformationTypes'
import type { ReportInfo } from '../../SubmitBIReportTypes'
import type { Entity } from '@pulse/common'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<BIReportInformationProps>()
const emit = defineEmits<{
  'update:reportUploadInfo': [ReportInfo]
}>()

const reportList = ref<Report[]>([])

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
    }
  } catch (error) {
    console.error('Unable to fetch report names: ', error)
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
    filterByDeploymentStatus: '',
  }
  const searchParams = getSearchParams(defaulSearch)
  const { items } = await fetchReportAccounts(searchParams)

  callback(items)
}
const handleSelectAccount = (account: Entity) => {
  internalReportUploadInfo.value.accountId = account.accountId
  internalReportUploadInfo.value.accountLabel = `${account.legalName} (${account.accountNumber})`
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

<i18n lang="yaml">
en-US:
  labelTypeReport: 'Report type'
  placeholderTypeReport: 'Select a report type'
  labelDestinationFolder: 'Destination folder'
  placeholderDestinationFolder: 'Search by: name, IBS'
  labelNameReport: 'Name of the report'
  placeholderNameReport: 'Select or enter a name to be displayed on the client side'
  fieldRequired: '* Fields required'
  uploadInfo: 'You can either create a new report or update an existing one'
fr-FR:
  labelTypeReport: 'Type de rapport'
  placeholderTypeReport: 'Sélectionnez un type de rapport'
  labelDestinationFolder: 'Dossier de destination'
  placeholderDestinationFolder: 'Rechercher par : nom, IBS'
  labelNameReport: 'Nom du rapport'
  placeholderNameReport: "Choisir ou saisir un nom qui s'affichera coté client"
  fieldRequired: '* Champs obligatoires'
  uploadInfo: 'Vous pouvez soit créer un nouveau rapport soit mettre à jour un rapport existant'
</i18n>
