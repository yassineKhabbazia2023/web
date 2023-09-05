<template>
  <el-carousel>
    <PCarouselItem
      v-for="(item, index) in items"
      :key="index"
      :text="item.text"
      :imageType="item.imageType"
      :imageName="item.imageName"
    />
  </el-carousel>
</template>

<script setup lang="ts">
import { ElCarousel } from 'element-plus'
import PCarouselItem from '@/atoms/PCarouselItem'

export interface PCarouselItemProps {
  text: string,
  imageType: string,
  imageName: string
}

export interface PCarouselProp {
  items: Array<PCarouselItemProps>
}
defineProps<PCarouselProp>()
</script>
