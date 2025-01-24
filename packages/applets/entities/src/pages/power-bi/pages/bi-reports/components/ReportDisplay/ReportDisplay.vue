<template>
  <div class="report-display bg--neutral-gray-50">
    <div
      class="report-display__header bg--base-white flex flex--align-items-center padding-x--6 padding-y--4"
    >
      <PAvatar
        pShape="circle"
        pType="small"
        pColor="orange"
      >
        <PIcon pName="pulse" />
      </PAvatar>
      <h4 class="h4 margin-left--2" data-testid="report-display-account-name">
        {{ defaultEntity?.legalName }}
      </h4>
    </div>
    <div class="report-display__container margin-top--6">
      <section
        ref="powerbiSection"
        class="report-display__iframe margin-x--auto"
        data-testid="report-display-iframe"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import 'powerbi-client'
import * as models from 'powerbi-models'
import { useI18n } from 'vue-i18n'
import { watch, toRefs, computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { PAvatar, PIcon } from '@pulse/styleguide/components'
import { commonStore } from '@pulse/common'
import type { ReportDisplayProps } from './ReportDisplayTypes'
import { fetchBIToken } from '@entities/services/reporting'
import { displayNotification } from '@entities/common/utils'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ReportDisplayProps>()

const reportToken = ref<string>('')
const powerbiSection = ref<HTMLElement>()
const { selectedReport } = toRefs(props)
const { defaultEntity } = storeToRefs(commonStore())

const powerBIConfig = computed(() => ({
  type: 'report',
  accessToken: reportToken.value,
  embedUrl: selectedReport.value.embededReportUrl,
  id: selectedReport.value.embededReportId,
  settings: {
    filterPaneEnabled: false,
    navContentPaneEnabled: true,
  },
  tokenType: models.TokenType.Embed,
}))

const loadPowerBIReport = async () => {
  const powerbiContainer = powerbiSection.value as HTMLElement
  window.powerbi.reset(powerbiContainer)
  try {
    reportToken.value = await fetchBIToken(selectedReport.value.embededReportId)
    window.powerbi.embed(powerbiContainer, powerBIConfig.value)
  } catch {
    displayNotification('error', t('biReportLoadingError'))
  }
}

// If a different report is selected, the new report should be loaded again
watch(selectedReport, () => {
  loadPowerBIReport()
})

// Load the default selected report
onMounted(() => {
  loadPowerBIReport()
})
</script>

<style lang="scss" scoped>
.report-display {
  width: calc(100% - 351px);

  &__iframe {
    height: 80vh;
    width: 90%;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    biReportLoadingError: "The BI report can't be loaded at the moment. Please try again later."
  fr-FR:
    biReportLoadingError: "Le rapport BI ne peut pas être chargé pour le moment. Merci de réessayer plus tard."
</i18n>
