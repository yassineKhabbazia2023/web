<template>
  <ul
    class="
      catalog-card
      list-style-none
      padding-bottom--5
      position--relative
    "
  >
    <li>
      <span class="catalog-card__title font-large">
        {{ title }}
      </span>
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
    <ThumbsRating
      v-if="isSmartSearchEvaluationVisible"
      v-model="isOfferRated"
      :label="t('rateResultSentence')"
      class="margin-top--2"
      @rate="handleResultValidation"
    />
  </ul>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { logger } from '@pulse/toolbox'
import type { CatalogCardProps } from './catalog-card.types'
import { getCatalogTagProps } from '../../utils/offers-catalog.utils'
import { PTag } from '@pulse/styleguide/components'
import { rateOfferRecommendation } from '../../services/offers-catalog.service'
import { OfferEvaluationType } from '../../services/offers-catalog.service.enum'
import { OffersCatalogTrackingManager } from '../../managers/offers-catalog-tracking/offers-catalog-tracking.manager'
import ThumbsRating from '../thumbs-rating/thumbs-rating.vue'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      similarityTooltip: '{score} match with your search',
      rateResultSentence: 'Rate this result :',
    },
    'fr-FR': {
      similarityTooltip: '{score} de compatibilité avec votre recherche',
      rateResultSentence: 'Noter ce résultat :',
    },
  },
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

const isSmartSearchEvaluationVisible = computed(() =>
  props.isSmartSearchEnabled && props.offerRecommendationsId !== '',
)
const isOfferRated = ref<boolean | null>(null)

async function handleResultValidation(satisfaction: boolean) {
  if (isOfferRated.value !== null) {
    return
  }

  const request = {
    offer_id: props.offerId,
    type: OfferEvaluationType.OFFER,
    satisfaction: satisfaction,
    id_offer_response: props.offerRecommendationsId,
  }

  try {
    await rateOfferRecommendation(request)
    isOfferRated.value = satisfaction
    OffersCatalogTrackingManager.trackEvaluation(satisfaction === true ? 'good' : 'bad', 'research')
  } catch (e) {
    logger.error('Error while rating offer result from AI search', e)
  }
}
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

