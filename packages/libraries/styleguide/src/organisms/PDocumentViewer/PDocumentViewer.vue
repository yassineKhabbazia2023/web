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
        <div class="p-document-viewer__header-left margin-right--2">
          <PButton
            v-if="pShowCloseButton"
            pType="generic"
            pPlain
            @click="documentViewerModel = false"
            class="el-button--icon p-document-viewer__btn-close margin-right--2"
          >
            <PIcon pName="arrowLeft" />
          </PButton>
          <p class="p-document-viewer__title">
            <span v-if="pHasIcon" class="margin-right--2 p-document-viewer__icon-document">
              <slot name="iconDocument" />
            </span>
            {{ pTitleDocument }}
          </p>
        </div>
        <div class="p-document-viewer__header-right" v-if="pHasPagination">
          <PButton
            pType="generic"
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
            pType="generic"
            pPlain
            class="el-button--icon margin-left--2 p-document-viewer__btn-next"
            :pDisabled="!pShowNextDocument"
            @click="$emit('next-document-button-click')"
          >
            <PIcon pName="chevronRight" />
          </PButton>
        </div>
      </div>
    </template>
    <div class="p-document-viewer__content">
      <div class="p-document-viewer__content-left">
        <slot name="media" />
      </div>
      <div class="p-document-viewer__content-right padding--6">
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
  destroyOnClose: true,
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
  background-color: rgba(var(--el-color-neutral-gray-900-rgb), 0.95);
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
