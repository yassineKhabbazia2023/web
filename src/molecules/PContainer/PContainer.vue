<template>
  <ElContainer :direction="pDirection">
    <slot />
  </ElContainer>
</template>

<script lang="ts" setup>
import { ElContainer } from 'element-plus'
import type { PContainerProps } from './PContainerTypes'

withDefaults(defineProps<PContainerProps>(), {
  pDirection: 'horizontal'
})
</script>
