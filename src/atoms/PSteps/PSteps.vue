<template>
  <ElSteps
    :space="pSpace"
    :direction="pDirection"
    :active="pActive"
    :processStatus="pProcessStatus"
    :finishStatus="pFinishStatus"
    :simple="pSimple"
    :alignCenter="pAlignCenter"
  >
    <slot />
  </ElSteps>
</template>

<script setup lang="ts">
import { ElSteps } from 'element-plus'
import type { PStepsProps } from './PStepsTypes'

withDefaults(defineProps<PStepsProps>(), {
  pSpace: '',
  pDirection: 'horizontal',
  pActive: 0,
  pProcessStatus: 'process',
  pFinishStatus: 'finish',
  pAlignCenter: undefined,
  pSimple: undefined
})
</script>
