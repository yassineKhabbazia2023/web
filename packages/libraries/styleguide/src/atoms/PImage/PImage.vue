<template>
  <ElImage
    :src="resolvedImage"
    :fit="pFit"
  />
</template>

<script setup lang="ts">
import { ElImage } from 'element-plus'
import { imageResolver } from '../../utils/imageResolver'
import type { PImageProps } from './PImageTypes'
import imagesList from './imagesList.json'
import { computed } from 'vue'

const props = withDefaults(defineProps<PImageProps>(), {
  pFit: 'fill',
})

const resolvedImage = computed(() => imageResolver(props.pName, imagesList))
</script>
