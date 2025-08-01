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
      <PTag
        v-for="({ tagLabel, tagProps }, index) in internalTags"
        :key="index"
        :pContent="tagLabel"
        v-bind="tagProps"
      />
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { CatalogCardProps } from './catalog-card.types'
import { getCatalogTagProps } from '../../utils/offers-catalog.utils'
import { PTag } from '@pulse/styleguide/components'

const MAX_SUBTITLE_LENGTH = 100
const ELLIPSIS = '…'

const props = defineProps<CatalogCardProps>()

const internalTags = computed(() => {
  return props.tags.map((tag) => ({
    tagLabel: tag,
    tagProps: getCatalogTagProps(tag),
  }))
})

const internalSubtitle = computed(() => props.subtitle.length > MAX_SUBTITLE_LENGTH
  ? `${props.subtitle.slice(0, MAX_SUBTITLE_LENGTH).trim()}${ELLIPSIS}`
  : props.subtitle)
</script>
