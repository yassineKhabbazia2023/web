<template>
  <ElImage :src="resolvedImage" :fit="pFit"></ElImage>
</template>

<script setup lang="ts">
import { ElImage } from 'element-plus'
import { imageResolver } from '@/utils/imageResolver'
import type { PImageProps } from './PImageTypes'

const props = withDefaults(defineProps<PImageProps>(), {
  pFit: 'fill',
})
const resolvedImage = imageResolver(props.pType, props.pName)
</script>
