<template>
  <ElCarouselItem>
    <div class="top">
      <p class="text">
        {{ text }}
      </p>
    </div>
    <div class="bottom">
      <PImage
        :type="imageType"
        :name="imageName"
        fit="fill"
      />
    </div>
    <slot />
  </ElCarouselItem>
</template>

<script lang="ts" setup>
import { ElCarouselItem } from 'element-plus'
import PImage from '@/atoms/PImage'

export interface PCarouselItemProps {
  text: string,
  imageType: string,
  imageName: string
}
defineProps<PCarouselItemProps>()

</script>
