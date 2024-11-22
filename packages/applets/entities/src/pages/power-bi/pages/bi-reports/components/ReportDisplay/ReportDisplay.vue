<template>
  <div class="report-display bg--neutral-gray-50">
    <div
      class="report-display__header bg--base-white flex flex--align-items-center shadow--2 padding-x--6 padding-y--4"
    >
      <PAvatar
        pShape="circle"
        pType="small"
        pColor="orange"
      >
        <PIcon>
          <PIPulse />
        </PIcon>
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
import { watch, toRefs, computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { PAvatar, PIcon, PIPulse } from '@pulse/styleguide/components'
import { commonStore } from '@pulse/common'
import type { ReportDisplayProps } from './ReportDisplayTypes'

const props = defineProps<ReportDisplayProps>()

const powerbiSection = ref<HTMLElement>()
const { selectedReport } = toRefs(props)
const { defaultEntity } = storeToRefs(commonStore())

const powerBIConfig = computed(() => ({
  type: 'report',
  accessToken: props.token,
  embedUrl: selectedReport.value.embededReportUrl,
  id: selectedReport.value.embededReportId,
  settings: {
    filterPaneEnabled: false,
    navContentPaneEnabled: true,
  },
}))

const loadPowerBIReport = () => {
  const powerbiContainer = powerbiSection.value as HTMLElement
  window.powerbi.reset(powerbiContainer)
  window.powerbi.embed(powerbiContainer, powerBIConfig.value)
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
