<template>
  <section
    v-if="rubrics.length > 0 || isPreview"
    :id="RECOMMENDATIONS_ANCHOR_ID"
    class="key-moments__screen key-moments-customer-recommendations"
    data-testid="customer-key-moments-recommendations-section"
  >
    <SectionHead
      :rank="rank"
      :subtitle="t('keyMoments.recommendations.subtitle')"
      :title="t('keyMoments.recommendations.title')"
    />

    <!-- Only the collaborator's preview says so: the client is served no section at all -->
    <PAlert
      v-if="rubrics.length === 0"
      pType="info"
      data-testid="customer-key-moments-recommendations-empty"
    >
      {{ t('keyMoments.recommendations.customer.empty') }}
    </PAlert>

    <div
      v-for="(rubric, index) in rubrics"
      :id="rubricAnchorId(rubric.rubric)"
      :key="rubric.rubric"
      class="key-moments-customer-recommendations__rubric"
      :style="{ '--key-moments-enter-rank': index }"
      :data-testid="`customer-key-moments-recommendations-rubric-${rubric.rubric}`"
    >
      <h3
        class="
          key-moments-customer-recommendations__rubric-title
          flex
          flex--align-items-baseline
          flex-gap--3
          margin--0
        "
      >
        <span>{{ t(`keyMoments.recommendations.rubrics.${rubric.rubric}`) }}</span>
        <span class="key-moments-customer-recommendations__rubric-count">
          {{ t(
            'keyMoments.recommendations.customer.count',
            { count: rubric.recommendations.length },
            rubric.recommendations.length,
          ) }}
        </span>
      </h3>

      <article
        v-for="(recommendation, position) in rubric.recommendations"
        :key="position"
        class="key-moments-customer-recommendations__card"
        :data-testid="`customer-key-moments-recommendations-rubric-${rubric.rubric}-item-${position}`"
      >
        <header
          class="
            flex
            flex--align-items-center
            flex--wrap
            flex-gap--3
          "
        >
          <span class="key-moments-customer-recommendations__theme text-color--text-heading">
            {{ recommendation.theme }}
          </span>
          <PTag
            v-if="recommendation.priority !== undefined"
            :pContent="t(`keyMoments.recommendations.priority.${recommendation.priority}`)"
            :pColor="RECOMMENDATION_PRIORITY_COLORS[recommendation.priority]"
            pSize="small"
          />
        </header>

        <!-- Side by side; a block left empty is omitted and the other takes the row -->
        <div
          v-if="isNotNullNorEmpty(recommendation.observations) || isNotNullNorEmpty(recommendation.risk)"
          class="key-moments-customer-recommendations__pair"
        >
          <div
            v-if="isNotNullNorEmpty(recommendation.observations)"
            class="key-moments-customer-recommendations__block"
          >
            <p class="key-moments-customer-recommendations__label">
              {{ t('keyMoments.recommendations.customer.observations') }}
            </p>
            <p class="key-moments-customer-recommendations__text">
              {{ recommendation.observations }}
            </p>
          </div>
          <div
            v-if="isNotNullNorEmpty(recommendation.risk)"
            class="key-moments-customer-recommendations__block"
          >
            <p class="key-moments-customer-recommendations__label">
              {{ t('keyMoments.recommendations.customer.risk') }}
            </p>
            <p class="key-moments-customer-recommendations__text">
              {{ recommendation.risk }}
            </p>
          </div>
        </div>

        <div
          v-if="isNotNullNorEmpty(recommendation.recommendation)"
          class="key-moments-customer-recommendations__advice"
        >
          <p class="key-moments-customer-recommendations__label">
            {{ t('keyMoments.recommendations.customer.recommendation') }}
          </p>
          <p class="key-moments-customer-recommendations__text">
            {{ recommendation.recommendation }}
          </p>
        </div>

        <ul
          v-if="recommendation.offers.length > 0"
          class="
            key-moments-customer-recommendations__offers
            list-style-none
            padding--0
            margin--0
          "
        >
          <li
            v-for="offer in recommendation.offers"
            :key="offer.offerId"
            class="
              key-moments-customer-recommendations__offer
              flex
              flex--align-items-baseline
              flex--wrap
              flex-gap--2
            "
          >
            <span class="font-semibold">{{ offer.title }}</span>
            <span
              v-if="offer.categoryName !== undefined"
              class="key-moments-customer-recommendations__offer-category"
            >
              {{ offer.categoryName }}
            </span>
            <span
              v-if="offer.shortDescription !== undefined"
              class="key-moments-customer-recommendations__text width--100"
            >
              {{ offer.shortDescription }}
            </span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { PAlert, PTag } from '@pulse/styleguide/components'
import SectionHead from '../section-head/section-head.vue'
import { RECOMMENDATION_PRIORITY_COLORS } from '../../const/key-moments.consts'
import { RECOMMENDATIONS_ANCHOR_ID, rubricAnchorId } from '../../utils/anchor.utils'
import { groupedByRubric } from '../../utils/recommendations.utils'
import type { PublishedRecommendationPayload } from '../../types/recommendations.types'

const props = defineProps<{
  /** Visible recommendations only, in the published order, as the publication freezes them */
  recommendations: PublishedRecommendationPayload[]
  rank: string
  /** The collaborator's preview states an empty section; the client is served none */
  isPreview: boolean
}>()

const { t } = useI18n()

const rubrics = computed(() => groupedByRubric(props.recommendations))
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;
@use '../../styles/screen';

.key-moments-customer-recommendations {
  &__rubric {
    margin-top: 28px;
  }

  &__rubric-title {
    padding-bottom: 8px;
    margin-bottom: 12px;
    font-size: 17px;
    font-weight: 800;
    border-bottom: 2px solid var(--key-moments-line);
  }

  &__rubric-count {
    font-size: 12px;
    font-weight: 400;
    color: var(--p-text-neutral);
  }

  &__card {
    @include screen.block;

    display: flex;
    flex-direction: column;
    gap: 14px;
    border-left: 3px solid var(--p-jungle-400);

    & + & {
      margin-top: 12px;
    }
  }

  &__theme {
    @include screen.card-title;
  }

  &__pair {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;

    // A lone block takes the whole row
    > :only-child {
      grid-column: 1 / -1;
    }

    @include breakpoints.media(xs) {
      grid-template-columns: minmax(0, 1fr);
    }
  }

  &__block {
    padding: 12px 14px;
    background-color: var(--key-moments-emphasis-surface);
  }

  &__advice {
    padding: 12px 14px;
    border: 1px solid var(--p-jungle-400);
  }

  &__label {
    @include screen.overline;

    margin-bottom: 4px;
  }

  &__text {
    @include screen.card-text;
  }

  &__offer {
    padding: 6px 0;
    border-top: 1px solid var(--key-moments-line);
  }

  &__offer-category {
    @include screen.overline;
  }
}
</style>
