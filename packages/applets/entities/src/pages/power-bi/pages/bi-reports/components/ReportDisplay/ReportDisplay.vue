<template>
  <div class="report-display bg--neutral-gray-50">
    <div
      class="report-display__header bg--base-white flex flex--align-items-center padding-x--6 padding-y--4"
    >
      <PAvatar
        pShape="circle"
        pType="small"
        :pColor="entityAvatarColor"
      >
        <PIcon pName="pulse" />
      </PAvatar>
      <h4 class="h4 margin-left--2" data-testid="report-display-account-name">
        {{ selectedEntity?.legalName }}
      </h4>
    </div>
    <div class="report-display__container flex margin-top--6 padding--4">
      <section
        ref="powerbiSection"
        class="report-display__iframe"
        data-testid="report-display-iframe"
      />
      <ReportActions
        :reportLabel="selectedReport.reportLabel"
        :powerBIConfig="powerBIConfig"
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
import { useSelectedEntityStore } from '@pulse/common/stores'
import type { ReportDisplayProps } from './ReportDisplayTypes'
import { fetchBIToken } from '@entities/services/reporting'
import { displayNotification } from '@entities/common/utils'
import ReportActions from './components/ReportActions'
import { getAvatarColorFromKey } from '@pulse/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<ReportDisplayProps>()

const reportToken = ref<string>('')
const powerbiSection = ref<HTMLElement>()
const { selectedReport } = toRefs(props)

const selectedEntityStore = useSelectedEntityStore()
const { selectedEntity } = storeToRefs(selectedEntityStore)

const powerBIConfig = computed(() => ({
  type: 'report',
  accessToken: reportToken.value,
  embedUrl: selectedReport.value.embededReportUrl,
  uniqueId: selectedReport.value.embededReportId,
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
    const { embededReportId, accountId } = selectedReport.value
    reportToken.value = await fetchBIToken(embededReportId, accountId)
    window.powerbi.embed(powerbiContainer, powerBIConfig.value)
  } catch {
    displayNotification('error', t('biReportLoadingError'))
  }
}

const entityAvatarColor = computed(() => getAvatarColorFromKey(selectedEntity.value?.accountNumber))

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

  &__header {
    border-bottom: 1px solid var(--el-border-color);
  }

  &__iframe {
    height: 80vh;
    width: 100%;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    biReportLoadingError: "The BI report can't be loaded at the moment. Please try again later."
  fr-FR:
    biReportLoadingError: "Le rapport BI ne peut pas être chargé pour le moment. Merci de réessayer plus tard."
</i18n>
