<template>
  <div
    class="
      pennylane-terms-viewer-toolbar
      flex
      flex--align-items-center
      flex--justify-content-space-between
      padding-x--3
      padding-y--2
    "
  >
    <div class="pennylane-terms-viewer-toolbar__spacer" />

    <div class="flex flex--align-items-center flex-gap--1">
      <PButton
        p-type="tertiary"
        p-size="small"
        :disabled="canZoomOut === false"
        @click="$emit('zoom-out')"
      >
        <PIcon
          pName="zoomOut"
          pSize="16"
        />
      </PButton>

      <span class="pennylane-terms-viewer-toolbar__zoom-label font-small">
        {{ zoomPercentage }}
      </span>

      <PButton
        p-type="tertiary"
        p-size="small"
        :disabled="canZoomIn === false"
        @click="$emit('zoom-in')"
      >
        <PIcon
          pName="zoomIn"
          pSize="16"
        />
      </PButton>
    </div>

    <div class="pennylane-terms-viewer-toolbar__spacer flex flex--justify-content-flex-end">
      <PTooltip :pContent="t('widgets.pennylaneAmendmentFlow.step3.downloadPdf')">
        <PButton
          p-type="tertiary"
          p-size="small"
          @click="downloadDocument"
        >
          <PIcon
            pName="download"
            pSize="16"
          />
        </PButton>
      </PTooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PIcon, PTooltip } from '@pulse/styleguide/components'
import { downloadTermsPdf } from '../../pennylane-terms.helper'
import type { PennylaneTermsViewerToolbarProps } from './pennylane-terms-viewer-toolbar.types'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

defineProps<PennylaneTermsViewerToolbarProps>()

defineEmits<{
  'zoom-in': []
  'zoom-out': []
}>()

function downloadDocument() {
  downloadTermsPdf()
}
</script>

<style lang="scss" scoped>
.pennylane-terms-viewer-toolbar {
  background-color: var(--p-black-rock-900);
  min-height: 40px;
  flex-shrink: 0;

  &__spacer {
    flex: 1;
  }

  &__zoom-label {
    min-width: 45px;
    text-align: center;
    color: var(--p-white);
  }

  :deep(.p-button--tertiary) {
    color: var(--p-white);

    &:hover:not(:disabled) {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &:disabled {
      color: var(--p-gray-500);
    }
  }
}
</style>
