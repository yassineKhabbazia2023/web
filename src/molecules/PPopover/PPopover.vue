<template>
  <el-popover
    popperClass="el-popper-popover p-popover--shadow"
    :placement="placement"
    :disabled="disabled"
    :showArrow="showArrow"
    :trigger="trigger"
    :title="title"
    :width="212"
  >
    <div class="el-popover__content">
      <slot name="content" />
    </div>
    <template #reference>
      <slot />
    </template>
  </el-popover>
</template>

<script setup lang="ts">
import type { PlacementOptions } from '@/constants/placementOptions'
import type { TriggerOptionsType } from '@/constants/triggerOptions'
import { ElPopover } from 'element-plus'
interface PPopoverProps {
  placement?: PlacementOptions
  disabled?: boolean
  showArrow?: boolean
  trigger: TriggerOptionsType
  title: string
}

withDefaults(defineProps<PPopoverProps>(), {
  placement: 'top',
  disabled: false
})
</script>
