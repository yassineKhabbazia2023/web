<template>
  <ElPopper
    :role="pRole"
  >
    <slot />
  </ElPopper>
</template>

<script lang="ts" setup>
import { ElPopper } from 'element-plus'
import type { PPopperProps } from './PPopperTypes'

withDefaults(defineProps<PPopperProps>(), {
  pRole: 'tooltip'
})
</script>
