<template>
  <Story
    title="Molecules/Carousel"
    icon="teenyicons:outline-circle"
    :layout="{
        type: 'grid',
        width: 500,
      }"
  >
    <Variant title="Custum tooltip">
      <PCarousel
        :items="carouselBasicData"
        arrow="never"
        style="width:500px;height: 600px;">
      </PCarousel>
      <template #controls>
      </template>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PCarousel from '.'
import { ref } from 'vue'
const carouselBasicData = ref([
  {
    text: 'Manage the activation of the various Pulse services and the digitization of your customer relationship.',
    imageName: 'digitalisation',
    imageType: 'paupulse'
  },
  {
    text: 'Create and track your bank mandate requests at a glance!',
    imageType: 'paupulse',
    imageName: 'mandat-bancaire'
  },
  {
    text: 'Follow the documents shared by your customers on a daily basis.',
    imageType: 'paupulse',
    imageName: 'document-partage'
  }
])
</script>

<docs lang="md">
  ## PCarousel
  This component is used for carousel.

  | Name       | Description                                  | Type                               | Default                |
  | ---------- | -------------------------------------------- | ---------------------------------- | ---------------------- |
  | `items` |  PCarouselItem lists  | `Array<PCarouselItem>`| inherit from entities  |

<iframe src="https://www.figma.com/file/hycpUsOrc1fFD7xcYY0ryN/%F0%9F%A6%84-Librairie-de-composants?type=design&node-id=900%3A4684&t=ZWvzVcdigl9JChV4-1"></iframe>

</docs>
