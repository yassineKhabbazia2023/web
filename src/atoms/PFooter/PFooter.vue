<template>
  <ElFooter :height="pHeight">
    <slot />
  </ElFooter>
</template>

<script lang="ts" setup>
import { ElFooter } from 'element-plus'
import type { PFooterProps } from './PFooterTypes'

withDefaults(defineProps<PFooterProps>(), {
  pHeight: '60px'
})
</script>
