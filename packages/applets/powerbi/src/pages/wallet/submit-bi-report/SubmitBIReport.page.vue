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
    <!--I used v-show instead of v-if to preserve the imported file when the spinner is displayed-->
    <PForm
      v-show="!isUploading && !isUploaded"
      pRequireAsteriskPosition="right"
    >
      <PRow :pGutter="48">
        <PCol :pSpan="24" :pMd="12">
          <UploadBIReport
            ref="uploadBIReport"
            :isDisabled="!!reportFile"
            @upload-report="handleReportUpload"
            @delete-report="handleDeleteReport"
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
            v-model:reportUploadInfo="reportUploadInfo"
            :reportTypes="reportTypesDropdownValues"
          />
        </PCol>
      </PRow>
      <div class="text-right margin-top--4">
        <PButton
          pType="secondary"
          pSize="default"
          pPlain
          data-testid="powerbi-reset-button"
          @click="handleResetUploadInfo"
        >
          {{ t('reset') }}
        </PButton>
        <PButton
          pType="primary"
          pSize="default"
          class="margin-left--4"
          :pDisabled="isReportFormIncomplete || isReportSubmissionDisabled"
          data-testid="powerbi-validation-button"
          @click="handleUploadBIReport"
        >
          {{ t('validate') }}
        </PButton>
      </div>
    </PForm>
  </div>
</template>

<script lang="ts" setup>
import { logger } from '@pulse/toolbox'
import { useI18n } from 'vue-i18n'
import { ref, onMounted, computed } from 'vue'
import {
  PButton,
  PCol,
  PForm,
  PRow,
  PLoader,
} from '@pulse/styleguide/components'
import { displayNotification } from '@pulse/styleguide'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { fetchBIReportTypes, uploadBIreport } from '@powerbi/services/reporting.service'
import { ReportTypeEnum } from '@powerbi/enums/bi-reports.enum'
import { AmplitudePowerBIDepositMethod, AmplitudePowerBIDepositType } from '@powerbi/enums/amplitude-tracking.enum'
import { AMPLITUDE_DEPOSIT_TYPE_MAPPING } from '@powerbi/constants/amplitude-tracking.const'
import type { ReportType, ReportInfo } from '@powerbi/types/bi-reports.types'

import UploadBIReport from '@powerbi/components/UploadBIReport/UploadBIReport.vue'
import BIReportSubmitted from '@powerbi/components/BIReportSubmitted/BIReportSubmitted.vue'
import BIReportInformation from '@powerbi/components/BIReportInformation/BIReportInformation.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      reset: 'Reset',
      validate: 'Validate the deposit',
      reportUploadFailed: 'A problem occurred when submitting your report. Please try again or contact the support',
    },
    'fr-FR': {
      reset: 'Réinitialiser',
      validate: 'Valider le dépôt',
      reportUploadFailed: 'Un problème est survenu lors du dépôt de votre rapport. Veuillez réessayer ou contacter le support\n',
    },
  },
})

const isLoading = ref(true)
const isUploaded = ref(false)
const isUploading = ref(false)

const uploadBIReport = ref()
const reportFile = ref<File>()
const reportTypes = ref<ReportType[]>([])
const reportUploadInfo = ref<ReportInfo>({})
const isReportSubmissionDisabled = ref(false)

const reportTypesDropdownValues = computed(() =>
  reportTypes.value.map((reportType: ReportType) => ({
    pValue: reportType.reportTypeId,
    pLabel: `${reportType.collaboratorLabel} (${reportType.customerLabel})`,
  })),
)
const isReportFormIncomplete = computed(() => {
  const { accountId, reportTypeId, reportLabel } = reportUploadInfo.value

  return !reportFile.value || !accountId || !reportTypeId || !reportLabel
})

const getDepositType = (reportTypeId: number): AmplitudePowerBIDepositType => {
  const reportType = reportTypes.value.find((type) => type.reportTypeId === reportTypeId)
  const typeName = reportType?.name?.toLowerCase() as ReportTypeEnum

  return AMPLITUDE_DEPOSIT_TYPE_MAPPING[typeName] ?? AmplitudePowerBIDepositType.PERSONNALISE
}

// Event listeners
const handleReportUpload = (report: File) => {
  reportFile.value = report
}
const handleDeleteReport = () => {
  reportFile.value = undefined
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
      AmplitudeService.track('Power BI Deposit Completed', {
        powerbi_deposit_type: getDepositType(reportTypeId),
        powerbi_deposit_method: AmplitudePowerBIDepositMethod.MANUAL,
      })
      isUploaded.value = true
    }
  } catch (error) {
    isReportSubmissionDisabled.value = true
    displayNotification('error', t('reportUploadFailed'))
    //I've added a setTimeout to prevent bombarding the API by validating multiple times in quick succession
    setTimeout(() => {
      isReportSubmissionDisabled.value = false
    }, 2000)
    logger.error('Unable to upload BI report: ', error)
  } finally {
    isUploading.value = false
  }
}

onMounted(async () => {
  try {
    reportTypes.value = await fetchBIReportTypes()
    const { reportTypeId } = reportTypes.value.find((r) => r.name === ReportTypeEnum.FORMS) as ReportInfo

    reportUploadInfo.value = {
      reportTypeId,
    }
  } catch (error) {
    logger.error('Unable to fetch report types: ', error)
  } finally {
    isLoading.value = false
  }
})
</script>

