<template>
  <ElCarouselItem>
    <div class="top">
      <p class="text">
        {{ pText }}
      </p>
    </div>
    <div class="bottom">
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
