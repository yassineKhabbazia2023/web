<template>
  <ElAvatar
    v-bind="props"
    :fit="pFit"
    size="default"
    :color="pColor"
    :src="pSrc"
    :shape="pShape"
  >
    <slot />
  </ElAvatar>
</template>

<script setup lang="ts">
import { ElAvatar } from 'element-plus'
import type { PAvatarProps } from './PAvatar'

const props = withDefaults(defineProps<PAvatarProps>(), {
  pType: 'default',
  pFit: 'cover',
  pColor: 'persian-gradient',
  pSrc: '',
  pShape: 'circle'
})
</script>
