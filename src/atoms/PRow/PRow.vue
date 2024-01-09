<template>
  <ElRow
    :gutter="pGutter"
    :justify="pJustify"
    :align="pAlign"
    :tag="pTag"
  >
    <slot />
  </ElRow>
</template>

<script lang="ts" setup>
import { ElRow } from 'element-plus'
import type { PRowProps } from './PRowTypes'

withDefaults(defineProps<PRowProps>(), {
  pGutter: 0,
  pJustify: 'start',
  pAlign: undefined,
  pTag: 'div'
})
</script>
