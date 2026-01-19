<template>
  <div class="report-actions">
    <div class="report-actions__panel bg--base-white padding--2">
      <PButton
        pSize="default"
        pIconOnly
        @click="handleReportFullscreenDisplay"
      >
        <PIcon
          pName="arrowsAngleExpand"
          :pColor="AppColors.JUNGLE_400"
          pSize="16"
        />
      </PButton>
    </div>
    <PowerBIReportViewer
      v-model="isReportViewerVisible"
      :reportLabel="reportLabel"
      :powerBIConfig="powerBIConfig"
    />
  </div>
</template>

<script setup lang="ts">
import { AppColors } from '@pulse/styleguide'
import { PIcon, PButton } from '@pulse/styleguide/components'
import PowerBIReportViewer from '@powerbi/components/PowerBIReportViewer/PowerBIReportViewer.vue'
import type { ReportActionsProps } from './report-actions.type'

defineProps<ReportActionsProps>()

const isReportViewerVisible = defineModel<boolean>({ default: false })

const handleReportFullscreenDisplay = () => {
  isReportViewerVisible.value = true
}
</script>

<style scoped lang="scss">
.report-actions {
  &__panel {
    height: calc(80vh - 35px);
  }
}
</style>
