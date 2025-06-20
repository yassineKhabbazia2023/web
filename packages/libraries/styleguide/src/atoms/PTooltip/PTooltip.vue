<template>
  <ElTooltip
    popperClass="p-tooltip shadow--4"
    :content="pContent ?? ''"
    :disabled="isEnabled === false"
    :placement="pPlacement"
    :showAfter="pShowAfter"
    :hideAfter="pHideAfter"
  >
    <slot />
  </ElTooltip>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTooltip } from 'element-plus'
import type { PTooltipProps } from './PTooltipTypes'

const props = withDefaults(defineProps<PTooltipProps>(), {
  disabled: false,
  pPlacement: 'top',
})

const isEnabled = computed(() => {
  return props.disabled === false &&
    props.pContent !== undefined &&
    props.pContent.length > 0
})
</script>

<style lang="scss">
.el-popper {
  white-space: pre-line; // This update helps to avoid using v-html
}
</style>
