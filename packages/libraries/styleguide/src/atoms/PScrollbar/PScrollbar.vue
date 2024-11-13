<template>
  <ElScrollbar
    :height="pHeight"
    :maxHeight="pMaxHeight"
    :native="pNative"
    :wrapStyle="pWrapStyle"
    :viewStyle="pViewStyle"
    :wrapClass="pWrapClass"
    :viewClass="pViewClass"
    :noresize="pNoresize"
    :tag="pTag"
    :always="pAlways"
    :minSize="pMinSize"
    :id="pId"
    :role="pRole"
    :ariaLabel="pAriaLabel"
    :ariaOrientation="pAriaOrientation"
  >
    <slot />
  </ElScrollbar>
</template>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus'
import type { PScrollbarProps } from './PScrollbarTypes'

withDefaults(defineProps<PScrollbarProps>(), {
  pHeight: undefined,
  pMaxHeight: undefined,
  pNative: false,
  pWrapStyle: undefined,
  pViewStyle: undefined,
  pWrapClass: undefined,
  pViewClass: undefined,
  pNoresize: false,
  pTag: 'div',
  pAlways: false,
  pMinSize: 20,
  pId: undefined,
  pRole: undefined,
  pAriaLabel: undefined,
  pAriaOrientation: undefined,
})
</script>

<style lang="scss">
.el-scrollbar__bar {
  &.is-horizontal, &.is-vertical {
    z-index: 2000;
  }
  // Above everything but popup and dialog
}
</style>
