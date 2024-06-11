<template>
  <div>
    <BIReportSubmitted
      v-if="isUploaded"
      :accountLabel="reportUploadInfo.accountLabel"
      @submit-new-report="handleResetUploadInfo"
    />
    <div
      v-else-if="isUploading"
      class="flex flex--justify-content-center margin-top--6"
      data-testid="submit-bi-report-loader"
    >
      <PLoader pType="primary" pSize="50" />
    </div>
    <PForm
      v-else
      class="upload-report-bi radius--2 padding--6 shadow--4"
      pRequireAsteriskPosition="right"
      pLabelPosition="top"
    >
      <PRow :pGutter="48">
        <PCol :pSpan="24" :pMd="12">
          <UploadBIReport
            ref="uploadBIReport"
            @upload-report="handleReportUpload"
            :isDisabled="!!reportFile"
          />
        </PCol>
        <PCol :pSpan="24" :pMd="12">
          <div
            v-if="isLoading"
            class="flex flex--justify-content-center margin-y--4"
            data-testid="rights-list-loader"
          >
            <PLoader pType="primary" pSize="50" />
          </div>
          <BIReportInformation
            v-else
            :reportTypes="reportTypesDropdownValues"
            v-model:reportUploadInfo="reportUploadInfo"
          />
        </PCol>
      </PRow>
      <div class="text-right margin-top--4">
        <PButton
          pType="primary"
          pSize="default"
          pPlain
          @click="handleResetUploadInfo"
          data-testid="powerbi-reset-button"
        >
          {{ t('reset') }}
        </PButton>
        <PButton
          pType="primary"
          pSize="default"
          class="margin-left--4"
          :pDisabled="isValidationButtonDisabled"
          @click="handleUploadBIReport"
          data-testid="powerbi-validation-button"
        >
          {{ t('validate') }}
        </PButton>
      </div>
    </PForm>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted, computed } from 'vue'
import { PButton, PCol, PForm, PRow, PLoader } from '@kpmg/styleguide'
import UploadBIReport from './components/UploadBIReport'
import BIReportSubmitted from './components/BIReportSubmitted'
import BIReportInformation from './components/BIReportInformation'
import { fetchBIReportTypes, uploadBIreport } from '@/services/reporting'
import type { ReportInfo } from './SubmitBIReportTypes'
import type { ReportType } from '@/pages/power-bi/pages/bi-reports/BIReportsTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const isLoading = ref(true)
const isUploaded = ref(false)
const isUploading = ref(false)

const uploadBIReport = ref()
const reportFile = ref<File>()
const reportTypes = ref<ReportType[]>([])
const reportUploadInfo = ref<ReportInfo>({})

const reportTypesDropdownValues = computed(() =>
  reportTypes.value.map((reportType: ReportType) => ({
    pValue: reportType.reportTypeId,
    pLabel: reportType.customerLabel,
  })),
)
const isValidationButtonDisabled = computed(() => {
  const { accountId, reportTypeId, reportLabel } = reportUploadInfo.value

  return !reportFile.value || !accountId || !reportTypeId || !reportLabel
})

// Event listeners
const handleReportUpload = (report: File) => {
  reportFile.value = report
}
const handleResetUploadInfo = () => {
  if (uploadBIReport.value) {
    uploadBIReport.value.deleteUploadedReport()
  }
  reportUploadInfo.value = {}
  reportFile.value = undefined
  isUploaded.value = false
}
const handleUploadBIReport = async () => {
  isUploading.value = true
  try {
    const { accountId, reportTypeId, reportLabel, reportId } =
      reportUploadInfo.value
    if (accountId && reportTypeId && reportFile.value) {
      await uploadBIreport(
        accountId,
        reportTypeId,
        reportFile.value,
        reportLabel,
        reportId,
      )
      isUploaded.value = true
    }
  } catch (error) {
    handleResetUploadInfo()
    console.error('Unable to upload BI report: ', error)
  } finally {
    isUploading.value = false
  }
}

onMounted(async () => {
  try {
    reportTypes.value = await fetchBIReportTypes()
  } catch (error) {
    console.error('Unable to fetch report types: ', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<i18n lang="yaml">
en-US:
  reset: 'Reset'
  validate: 'Validate the deposit'
fr-FR:
  reset: 'Réinitialiser'
  validate: 'Valider le depôt'
</i18n>
