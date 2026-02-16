<template>
  <div
    class="
      catalog-card-list
      grid
      grid-cols--4
      grid-gap--8
    "
  >
    <POverlay
      v-if="apiCallStatus === APICallStatus.LOADING"
      class="position--absolute"
    >
      <div
        class="margin-y--12"
      >
        <PLoader
          pType="primary"
          pSize="50"
        />
      </div>
    </POverlay>

    <CatalogCard
      v-for="({ id, title, shortDescription, tags, similarityScore }, index) in offers"
      :key="index"
      :title="title"
      :subtitle="shortDescription"
      :tags="tags"
      :similarityScore="similarityScore"
      class="cursor-pointer"
      @click="onCardClick(id)"
    />
  </div>
</template>

<script lang="ts" setup>
import type { CatalogCardListProps } from './catalog-card-list.types'
import { PLoader, POverlay } from '@pulse/styleguide/components'
import { APICallStatus } from '@pulse/common/enums'

import CatalogCard from '../../components/catalog-card/catalog-card.vue'

defineProps<CatalogCardListProps>()
const emit = defineEmits<{
  'select-offer': [number]
}>()

function onCardClick(id: number) {
  emit('select-offer', id)
}
</script>

<style lang="scss" scoped>
.catalog-card-list {
  grid-template-columns: repeat(1, minmax(0, 1fr));

  @media only screen and (width >= 768px) and (width < 1024px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media only screen and (width >= 1024px) and (width < 1536px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media only screen and (width >= 1536px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
