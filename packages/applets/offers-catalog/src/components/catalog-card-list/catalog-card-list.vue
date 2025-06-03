<template>
  <div
    class="
      catalog-card-list
      grid
      grid-cols--4
      grid-gap--8
    "
  >
    <CatalogCard
      v-for="({ title , shortDescription, tags }, index) in offers"
      :key="index"
      :title="title"
      :subtitle="shortDescription"
      :tags="tags"
    />
  </div>
</template>

<script lang="ts" setup>
import type { CatalogCardListProps } from './catalog-card-list.types'
import CatalogCard from '../../components/catalog-card/catalog-card.vue'

defineProps<CatalogCardListProps>()
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
