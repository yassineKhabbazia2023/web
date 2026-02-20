<template>
  <ul
    class="
      catalog-card
      list-style-none
      padding-bottom--5
      position--relative
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
    <li v-if="isSmartSearchEnabled" class="margin-top--2">
      <div class="flex flex--align-items-center flex-gap--2">
        {{ t('rateResultSentence') }}
        <PButton
          :pType="thumbsDownProperties.type"
          pSize="small"
          :pDisabled="isOfferRated !== null"
          @click.stop="negativeEvaluation"
        >
          <PIcon pName="thumbsDown" :pColor="thumbsDownProperties.color" />
        </PButton>
        <PButton
          :pType="thumbsUpProperties.type"
          pSize="small"
          :pDisabled="isOfferRated !== null"
          @click.stop="positiveEvaluation"
        >
          <PIcon pName="thumbsUp" :pColor="thumbsUpProperties.color" />
        </PButton>
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CatalogCardProps } from './catalog-card.types'
import { getCatalogTagProps } from '../../utils/offers-catalog.utils'
import { PTag, PTooltip, PButton, PIcon } from '@pulse/styleguide/components'
import { rateOfferRecommendation } from '../../services/offers-catalog.service'
import { logger } from '@pulse/toolbox'
import { AppColors } from '@pulse/styleguide'
import { PButtonProps } from '@pulse/styleguide/types'
import { AmplitudeService } from '@pulse/common/services/amplitude'

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

const isOfferRated = ref<boolean | null>(null)

async function handleResultValidation(satisfaction: boolean) {
  if (isOfferRated.value !== null) {
    return
  }

  const request = {
    offer_id: props.offerId,
    type: 'offer',
    satisfaction: satisfaction,
    id_offer_response: props.offerRecommendationsId,
  }

  try {
    await rateOfferRecommendation(request)
    isOfferRated.value = satisfaction

    AmplitudeService.track('Offer IA Evaluation', {
      offer_IA_result: satisfaction ? 'good' : 'bad',
      offer_IA_localisation: 'research',
    })
  } catch (e) {
    logger.error('Error while rating offer result from AI search', e)
  }
}

function positiveEvaluation() {
  handleResultValidation(true)
}

function negativeEvaluation() {
  handleResultValidation(false)
}

const thumbsDownProperties = computed(() => {
  const isActive = isOfferRated.value === false

  return {
    color: isActive ? AppColors.RED_500 : AppColors.WHITE,
    type: isActive ? 'default' : 'primary' as PButtonProps['pType'],
  }
})

const thumbsUpProperties = computed(() => {
  const isActive = isOfferRated.value === true

  return {
    color: isActive ? AppColors.JUNGLE_400 : AppColors.WHITE,
    type: isActive ? 'default' : 'primary' as PButtonProps['pType'],
  }
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
    rateResultSentence: 'Rate this result :'
  fr-FR:
    similarityTooltip: '{score} de compatibilité avec votre recherche'
    rateResultSentence: 'Noter ce résultat :'
</i18n>
