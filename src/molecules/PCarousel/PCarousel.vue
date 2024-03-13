<template>
  <ElCarousel
    :height="pHeight"
    :initialIndex="pInitialIndex"
    :trigger="pTrigger"
    :autoplay="pAutoplay"
    :interval="pInterval"
    :arrow="pArrow"
    :loop="pLoop"
    :direction="pDirection"
    :pauseOnHover="pPauseOnHover"
  >
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

withDefaults(defineProps<PCarouselProps>(), {
  pHeight: '300px',
  pInitialIndex: 0,
  pTrigger: 'hover',
  pAutoplay: true,
  pInterval: 3000,
  pArrow: 'hover',
  pLoop: true,
  pDirection: 'horizontal',
  pPauseOnHover: true,
})
</script>
