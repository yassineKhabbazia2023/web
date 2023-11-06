<template>
  <ElCarouselItem class="p-carousel-item">
    <div class="p-carousel-item__top">
      <p class="p-carousel-item__text">
        {{ pText }}
      </p>
    </div>
    <div class="p-carousel-item__bottom">
      <PImage
        :pType="pImageType"
        :pName="pImageName"
        pFit="fill"
      />
    </div>
    <slot />
  </ElCarouselItem>
</template>

<script lang="ts" setup>
import { ElCarouselItem } from 'element-plus'
import PImage from '@/atoms/PImage'
import type { PCarouselItemProps } from './PCarouselItemTypes'

defineProps<PCarouselItemProps>()
</script>
