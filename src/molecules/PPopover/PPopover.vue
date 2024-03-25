<template>
  <ElPopover
    popperClass="el-popper-popover p-popover--shadow"
    :placement="pPlacement"
    :disabled="pDisabled"
    :showArrow="pShowArrow"
    :trigger="pTrigger"
    :title="pTitle"
    :width="212"
  >
    <div class="el-popover__content">
      <slot name="content" />
    </div>
    <template #reference>
      <slot />
    </template>
  </ElPopover>
</template>

<script setup lang="ts">
import { ElPopover } from 'element-plus'
import type { PPopoverProps } from './PPopoverTypes'

withDefaults(defineProps<PPopoverProps>(), {
  pPlacement: 'top',
  pDisabled: false,
})
</script>
