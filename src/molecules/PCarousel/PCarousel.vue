<template>
  <ElCarousel>
    <PCarouselItem
      v-for="(item, index) in pItems"
      :key="index"
      :pText="item.pText"
      :pImageType="item.pImageType"
      :pImageName="item.pImageName"
    />
  </ElCarousel>
</template>

<script setup lang="ts">
import { ElCarousel } from 'element-plus'
import PCarouselItem from '@/atoms/PCarouselItem'
import type { PCarouselProps } from './PCarouselTypes'

defineProps<PCarouselProps>()
</script>
