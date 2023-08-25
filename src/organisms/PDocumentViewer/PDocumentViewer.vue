<template>
  <el-drawer
    v-model="documentViewerModel"
    class="p-document-viewer"
    :direction="direction"
    :showClose="showClose"
    :size="size"
    :appendToBody="appendToBody"
    :lockScroll="lockScroll"
    :closeOnClickModal="closeOnClickModal"
    :closeOnPressEscape="closeOnPressEscape"
    :openDelay="openDelay"
    :closeDelay="closeDelay"
    :destroyOnClose="destroyOnClose"
    :modal="modal"
    :withHeader="withHeader"
    :fullscreen="fullscreen"
    :modalFade="modalFade">
    <template #header>
      <div class="p-document-viewer__header shadow--3">
        <div class="p-document-viewer__header-left margin-right--2">
          <PButton
            v-if="showCloseButton"
            type="generic"
            plain
            @click="documentViewerModel = false"
            class="el-button--icon p-document-viewer__btn-close margin-right--2"
          >
            <PIcon>
              <PIArrowLeft />
            </PIcon>
          </PButton>
          <p class="p-document-viewer__title">
            <span v-if="hasIcon" class="margin-right--2 p-document-viewer__icon-document">
              <slot name="iconDocument" />
            </span>
            {{ titleDocument }}
          </p>
        </div>
        <div class="p-document-viewer__header-right" v-if="hasPagination">
          <PButton
            type="generic"
            plain
            class="el-button--icon margin-right--2 p-document-viewer__btn-previous"
            :disabled="!showPreviousDocument"
            @click="$emit('previous-document-button-click')"
          >
            <PIcon>
              <PIChevronLeft />
            </PIcon>
          </PButton>
          <div class="p-document-viewer__pagination">
            <span class="p-document-viewer__pagination-item">{{ activeDocument }}</span>
            <span class="p-document-viewer__pagination-item padding-left--2 padding-right--2">
              /
            </span>
            <span class="p-document-viewer__pagination-item">{{ totalDocuments }}</span>
          </div>
          <PButton
            type="generic"
            plain
            class="el-button--icon margin-left--2 p-document-viewer__btn-next"
            :disabled="!showNextDocument"
            @click="$emit('next-document-button-click')"
          >
            <PIcon>
              <PIChevronRight />
            </PIcon>
          </PButton>
        </div>
      </div>
    </template>
    <div class="p-document-viewer__content">
      <div class="p-document-viewer__content-right">
        <slot name="media" />
      </div>
      <div class="p-document-viewer__content-left padding--6">
        <slot name="content" />
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ElDrawer } from 'element-plus'
import { computed } from 'vue'
import { type PDocumentViewerProps } from './PDocumentViewerProps'

const emit = defineEmits([
  'previous-document-button-click',
  'next-document-button-click',
  'update:modelValue'
])

const props = withDefaults(defineProps<PDocumentViewerProps>(), {
  direction: 'rtl',
  size: '100%',
  appendToBody: false,
  lockScroll: true,
  closeOnClickModal: true,
  closeOnPressEscape: true,
  openDelay: 0,
  closeDelay: 0,
  destroyOnClose: false,
  trapFocus: false,
  draggable: false,
  center: false,
  alignCenter: false,
  modal: true,
  showClose: false,
  withHeader: true,
  fullscreen: true,
  modalFade: true,
  title: '',
  customClass: '',
  hasIcon: true,
  hasPagination: true,
  showCloseButton: true,
  showPreviousDocument: true,
  showNextDocument: true
})

const documentViewerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>
