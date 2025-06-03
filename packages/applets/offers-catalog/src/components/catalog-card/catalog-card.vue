<template>
  <ul
    class="
      list-style-none
      padding-bottom--5
    "
  >
    <li
      class="font-large"
    >
      {{ title }}
    </li>
    <li
      class="
        margin-top--4
        margin-bottom--2
      "
    >
      {{ internalSubtitle }}
    </li>
    <li
      class="
        flex
        flex--wrap
        flex-gap--3
      "
    >
      <CatalogTag
        v-for="({ tagLabel, tagStyle }, index) in internalTags"
        :key="index"
        :tagLabel="tagLabel"
        :tagStyle="tagStyle"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { CatalogCardProps } from './catalog-card.types'
import { getCatalogTagStyle } from '../../utils/offers-catalog.utils'
import CatalogTag from '../../components/catalog-tag/catalog-tag.vue'

const MAX_SUBTITLE_LENGTH = 100
const ELLIPSIS = '…'

const props = defineProps<CatalogCardProps>()

const internalTags = computed(() => {
  return props.tags.map((tag) => ({
    tagLabel: tag,
    tagStyle: getCatalogTagStyle(tag),
  }))
})

const internalSubtitle = computed(() => (props.subtitle?.length ?? 0) > MAX_SUBTITLE_LENGTH
  ? `${props.subtitle.slice(0, MAX_SUBTITLE_LENGTH).trim()}${ELLIPSIS}`
  : props.subtitle)
</script>
