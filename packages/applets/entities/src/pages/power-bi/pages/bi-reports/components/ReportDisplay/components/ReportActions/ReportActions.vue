<template>
  <div class="report-actions">
    <div class="report-actions__panel bg--base-white padding--2">
      <PButton
        pSize="default"
        pIconOnly
        @click="handleFullscreenReportDisplay"
      >
        <PIcon
          pName="arrowsAngleExpand"
          :pColor="AppColors.PRIMARY"
          pSize="16"
        />
      </PButton>
    </div>
    <PDocumentViewer
      v-model="isReportViewerVisible"
      pSize="100%"
      :pHasPagination="false"
      :pTitleDocument="reportLabel"
      :pActiveDocument="1"
      :pTotalDocuments="1"
      @opened="loadBIReportFullscreen"
    >
      <template #iconDocument>
        <PIcon pName="filetypePbx" />
      </template>
      <template #media>
        <section
          ref="powerbiSection"
          class="report-fullscreen__iframe"
          data-testid="fullscreen-report-iframe"
        />
      </template>
    </PDocumentViewer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AppColors } from '@pulse/styleguide'
import { PIcon, PButton, PDocumentViewer } from '@pulse/styleguide/components'
import type { ReportActionsProps } from './report-actions.type'

const props = defineProps<ReportActionsProps>()

const isReportViewerVisible = ref(false)
const powerbiSection = ref<HTMLElement>()

const handleFullscreenReportDisplay = () => {
  isReportViewerVisible.value = true
}

const loadBIReportFullscreen = () => {
  const powerbiContainer = powerbiSection.value as HTMLElement
  window.powerbi.embed(powerbiContainer, props.powerBIConfig)
}
</script>

<style scoped lang="scss">
.report-actions {
  &__panel {
    height: calc(80vh - 35px);
  }
}
.report-fullscreen {
  width: calc(100% - 351px);

  &__iframe {
    height: calc(100vh - 52px);
    overflow: hidden;
  }
}
</style>
