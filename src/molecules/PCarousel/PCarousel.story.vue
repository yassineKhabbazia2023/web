<template>
  <Story
    title="3. Molecules/Carousel"
    icon="bxs:carousel"
    :layout="{
      type: 'single',
      iframe: false
    }"
  >
    <Variant title="Carousel">
      <PCarousel
        :pItems="carouselBasicData"
        arrow="never"
        style="width:500px; height: 600px;">
      </PCarousel>
    </Variant>
  </Story>
</template>

<script setup lang="ts">
import PCarousel from '.'
import { ref } from 'vue'
const carouselBasicData = ref([
  {
    pText: 'Manage the activation of the various Pulse services and the digitization of your customer relationship.',
    pImageName: 'digitalisation',
    pImageType: 'paupulse'
  },
  {
    pText: 'Create and track your bank mandate requests at a glance!',
    pImageType: 'paupulse',
    pImageName: 'mandat-bancaire'
  },
  {
    pText: 'Follow the documents shared by your customers on a daily basis.',
    pImageType: 'paupulse',
    pImageName: 'document-partage'
  }
])
</script>

<docs lang="md">
  ## Carousel
  This component is used for carousel.

  | Name       | Description                                  | Type                               | Default                |
  | ---------- | -------------------------------------------- | ---------------------------------- | ---------------------- |
  | `pItems` |  PCarouselItem lists  | `Array<PCarouselItem>`| inherit from entities  |

  <div class="responsive-iframe-container">
    <iframe class="responsive-iframe" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FhycpUsOrc1fFD7xcYY0ryN%2F%25F0%259F%25A6%2584-Librairie-de-composants%3Ftype%3Ddesign%26node-id%3D1065%253A5221%26mode%3Ddev" allowfullscreen></iframe>
  </div>
</docs>
