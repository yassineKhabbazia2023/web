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
import PCarouselItem from '@/atoms/PCarouselItem'

interface PCarouselItemProps {
  text: string,
  imageType: string,
  imageName: string
}

interface PCarouselProp {
  items: Array<PCarouselItemProps>
}
defineProps<PCarouselProp>()
</script>
