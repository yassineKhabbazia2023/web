<template>
  <ElPopperArrow :arrowOffset="pArrowOffset" />
</template>

<script lang="ts" setup>
import { ElPopperArrow } from 'element-plus'
import type { PPopperArrowProps } from './PPopperArrowTypes'

withDefaults(defineProps<PPopperArrowProps>(), {
  pArrowOffset: 5,
})
</script>
