<template>
  <span
    class="padding-x--2 padding-y--1"
    :class="cssClasses"
  >
    {{ tagLabel }}
  </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { CatalogTagProps } from './catalog-tag.types'
import { CATALOG_TAG_TEXT_COLOR, CATALOG_TAG_BACKGROUND_COLOR } from './catalog-tag.const'

const props = defineProps<CatalogTagProps>()
const cssClasses = computed(() => {
  return [
    `text-color--${CATALOG_TAG_TEXT_COLOR[props.tagStyle]}`,
    `bg--${CATALOG_TAG_BACKGROUND_COLOR[props.tagStyle]}`,
  ]
})
</script>
