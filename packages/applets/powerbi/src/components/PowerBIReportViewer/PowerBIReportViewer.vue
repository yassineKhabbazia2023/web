<template>
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
</template>

<script lang="ts" setup>
import { useTemplateRef } from 'vue'
import { PIcon, PDocumentViewer } from '@pulse/styleguide/components'
import type { PowerBIReportViewerProps } from './power-bi-report-viewer.types'

const props = defineProps<PowerBIReportViewerProps>()

const powerbiSection = useTemplateRef('powerbiSection')
const isReportViewerVisible = defineModel<boolean>({ default: false })

const loadBIReportFullscreen = () => {
  const powerbiContainer = powerbiSection.value as HTMLElement
  window.powerbi.embed(powerbiContainer, props.powerBIConfig)
}
</script>

<style scoped lang="scss">
.report-fullscreen__iframe {
  height: calc(100vh - 52px);
  overflow: hidden;
}
</style>
