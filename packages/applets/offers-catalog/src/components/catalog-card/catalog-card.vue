<template>
  <ul
    class="
      catalog-card
      list-style-none
      padding-bottom--5
    "
  >
    <li class="flex flex--align-items-center flex--justify-content-space-between flex-gap--2">
      <span class="catalog-card__title font-large">
        {{ title }}
      </span>
      <PTooltip
        v-if="similarityScore !== undefined"
        :pContent="tooltipContent"
      >
        <PTag
          :pContent="formattedSimilarityScore"
          pIconLeftName="stars"
          pColor="purple"
          pSize="small"
        />
      </PTooltip>
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
import { useI18n } from 'vue-i18n'
import type { CatalogCardProps } from './catalog-card.types'
import { getCatalogTagProps } from '../../utils/offers-catalog.utils'
import { PTag, PTooltip } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

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

const formattedSimilarityScore = computed(() => {
  return `${props.similarityScore}%`
})

const tooltipContent = computed(() => {
  return t('similarityTooltip', { score: formattedSimilarityScore.value })
})
</script>

<style lang="scss" scoped>
.catalog-card {
  &__title {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    similarityTooltip: '{score} match with your search'
  fr-FR:
    similarityTooltip: '{score} de compatibilité avec votre recherche'
</i18n>
