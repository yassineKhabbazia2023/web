<template>
  <div class="height--100 flex flex--direction-column position--relative">
    <div
      v-if="isLoading === true"
      class="
        pennylane-terms-viewer__loading-state
        flex
        flex--justify-content-center
        flex--align-items-center
      "
    >
      <PLoader
        pType="gradient"
        pSize="50"
      />
    </div>

    <div
      v-else-if="isError === true"
      class="
        pennylane-terms-viewer__error-state
        flex
        flex--justify-content-center
        flex--align-items-flex-start
      "
    >
      <PAlert pType="danger">
        {{ t('widgets.pennylaneAmendmentFlow.step3.errorLoadingDocument') }}
      </PAlert>
    </div>

    <template v-else>
      <PennylaneTermsViewerToolbar
        :zoom-percentage="zoomPercentage"
        :can-zoom-in="canZoomIn"
        :can-zoom-out="canZoomOut"
        :account-id="props.accountId"
        @zoom-in="zoomIn"
        @zoom-out="zoomOut"
      />

      <div
        ref="pdfContainer"
        class="pennylane-terms-viewer__container width--100 margin-x--auto"
        role="document"
        aria-label="Pennylane terms and conditions PDF document"
      >
        <div class="pennylane-terms-viewer__content flex flex--direction-column flex--align-items-center">
          <canvas
            v-for="index in numPages"
            :key="index"
            :ref="el => handleCanvasRef(el, index - 1)"
            :data-page="index"
            :data-last-page="index === numPages"
            class="pennylane-terms-viewer__page bg--white shadow--1 margin-x--auto"
          />
        </div>

        <div
          v-if="shouldShowScrollButton === true"
          class="pennylane-terms-viewer__button-wrapper flex flex--justify-content-flex-end"
        >
          <PButton
            p-type="secondary"
            p-size="small"
            class="pennylane-terms-viewer__button margin-right--4"
            @click="scrollToBottom"
          >
            {{ t('widgets.pennylaneAmendmentFlow.step3.scrollToBottom') }}
            <PIcon
              class="margin-left--2"
              pName="arrowDown"
              pSize="12"
            />
          </PButton>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { toRef, computed } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { GlobalWorkerOptions } from 'pdfjs-dist'
import { PLoader, PAlert, PButton, PIcon } from '@pulse/styleguide/components'
import { usePennylaneTermsViewer } from './pennylane-terms-viewer.composable'
import PennylaneTermsViewerToolbar from './pennylane-terms-viewer-toolbar.vue'
import type { PennylaneTermsViewerProps } from './pennylane-terms-viewer.types'

GlobalWorkerOptions.workerPort = new Worker(
  new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url),
  { type: 'module' },
)

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const props = defineProps<PennylaneTermsViewerProps>()
const emit = defineEmits<{
  'scroll-complete': []
}>()

const accountIdRef = toRef(props, 'accountId')

const {
  isLoading,
  isError,
  numPages,
  pdfContainer,
  isAtBottom,
  zoomPercentage,
  canZoomIn,
  canZoomOut,
  setCanvasRef,
  scrollToBottom,
  zoomIn,
  zoomOut,
} = usePennylaneTermsViewer(accountIdRef, () => emit('scroll-complete'))

const shouldShowScrollButton = computed(() =>
  isLoading.value === false && isError.value === false && isAtBottom.value === false,
)

/**
 * Wraps setCanvasRef for v-for template ref callback.
 * Required because Vue ref callbacks receive Element | ComponentPublicInstance | null.
 */
function handleCanvasRef(el: Element | ComponentPublicInstance | null, pageIndex: number) {
  setCanvasRef(el as HTMLCanvasElement | null, pageIndex)
}
</script>

<style lang="scss" scoped>
.pennylane-terms-viewer {
  &__loading-state,
  &__error-state {
    min-height: 400px;
  }

  &__container {
    overflow-y: auto;
    background-color: var(--p-gray-100);
    border: 1px solid var(--p-gray-300);
    border-top: none;
    max-height: 345px;
    padding: 1.6rem 1.6rem 0;
  }

  &__content {
    min-width: 100%;
  }

  &__page {
    display: block;
    margin-bottom: 1.6rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__button-wrapper {
    position: sticky;
    bottom: 8px;
    z-index: 10;
    min-width: 100%;
    align-self: flex-start;
    left: 0;
  }
}
</style>
