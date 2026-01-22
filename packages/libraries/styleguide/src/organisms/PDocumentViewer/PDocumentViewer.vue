<template>
  <ElDrawer
    v-model="documentViewerModel"
    class="p-document-viewer"
    :direction="pDirection"
    :showClose="pShowClose"
    :size="pSize"
    :destroyOnClose="pDestroyOnClose"
    modalClass="p-document-viewer-overlay"
  >
    <template #header>
      <div class="p-document-viewer__header shadow--3">
        <div class="p-document-viewer__header-left">
          <PButton
            v-if="pShowCloseButton"
            pPlain
            class="p-document-viewer__btn-back margin-right--2"
            data-testid="document-viewer-back-button"
            @click="documentViewerModel = false"
          >
            <PIcon pName="arrowLeft" />
          </PButton>
          <p class="p-document-viewer__title">
            <span v-if="pHasIcon" class="margin-right--2 p-document-viewer__icon-document">
              <slot name="iconDocument" />
            </span>
            <span class="p-document-viewer__title-text">{{ pTitleDocument }}</span>
          </p>
        </div>
        <div v-if="pHasPagination" class="p-document-viewer__header-right">
          <PButton
            pPlain
            class="el-button--icon margin-right--2 p-document-viewer__btn-previous"
            :pDisabled="!pShowPreviousDocument"
            @click="$emit('previous-document-button-click')"
          >
            <PIcon pName="chevronLeft" />
          </PButton>
          <div class="p-document-viewer__pagination">
            <span class="p-document-viewer__pagination-item">{{ pActiveDocument }}</span>
            <span class="p-document-viewer__pagination-item padding-left--2 padding-right--2">
              {{ SLASH }}
            </span>
            <span class="p-document-viewer__pagination-item">{{ pTotalDocuments }}</span>
          </div>
          <PButton
            pPlain
            class="el-button--icon margin-left--2 p-document-viewer__btn-next"
            :pDisabled="!pShowNextDocument"
            @click="$emit('next-document-button-click')"
          >
            <PIcon pName="chevronRight" />
          </PButton>
        </div>
        <PButton
          v-if="pShowCloseButton"
          pPlain
          class="p-document-viewer__btn-close"
          @click="documentViewerModel = false"
        >
          <PIcon pName="x" />
        </PButton>
      </div>
    </template>
    <div class="p-document-viewer__content">
      <div class="p-document-viewer__content-left" :class="{ 'width--100': !$slots.content }">
        <slot name="media" />
      </div>
      <div v-if="$slots.content" class="p-document-viewer__content-right padding--6">
        <slot name="content" />
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
import { ElDrawer } from 'element-plus'
import { computed } from 'vue'
import PIcon from '../../atoms/PIcon'
import PButton from '../../atoms/PButton'
import type { PDocumentViewerProps } from './PDocumentViewerTypes'

const emit = defineEmits([
  'previous-document-button-click',
  'next-document-button-click',
  'update:modelValue',
])

const SLASH = '/'
const props = withDefaults(defineProps<PDocumentViewerProps>(), {
  pDirection: 'rtl',
  pSize: '100%',
  pDestroyOnClose: true,
  pShowClose: false,
  pHasIcon: true,
  pHasPagination: true,
  pShowCloseButton: true,
  pShowPreviousDocument: true,
  pShowNextDocument: true,
})

const documentViewerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  },
})
</script>

<style lang="scss">
.p-document-viewer-overlay {
  background-color: rgba(var(--p-gray-900-rgb), 0.95);
}
.p-document-viewer {
  background-color: transparent;

  &__header {
    z-index: 1;
  }
  &__content-right {
    background-color: white;
  }
  .el-drawer {
    &__header {
      background-color: white;
    }
  }
}
</style>
