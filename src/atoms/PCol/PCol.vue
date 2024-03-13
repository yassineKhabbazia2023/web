<template>
  <ElCol
    :span="pSpan"
    :offset="pOffset"
    :push="pPush"
    :pull="pPull"
    :xs="pXs"
    :sm="pSm"
    :md="pMd"
    :lg="pLg"
    :xl="pXl"
    :tag="pTag"
  >
    <slot />
  </ElCol>
</template>

<script lang="ts" setup>
import { ElCol } from 'element-plus'
import type { PColProps } from './PColTypes'

withDefaults(defineProps<PColProps>(), {
  pSpan: 24,
  pOffset: 0,
  pPush: 0,
  pPull: 0,
  pXs: undefined,
  pSm: undefined,
  pMd: undefined,
  pLg: undefined,
  pXl: undefined,
  pTag: 'div',
})
</script>
