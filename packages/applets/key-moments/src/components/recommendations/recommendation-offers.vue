<template>
  <div :data-testid="`${testIdPrefix}-offers`">
    <p
      class="
        key-moments-recommendation-offers__label
        text-uppercase
        margin--0
      "
    >
      {{ t('keyMoments.recommendations.offers.title', { count: offers.length }) }}
    </p>

    <ul
      v-if="offers.length > 0"
      class="
        list-style-none
        padding--0
        margin--0
      "
    >
      <li
        v-for="offer in offers"
        :key="offer.offerId"
        class="
          key-moments-recommendation-offers__row
          flex
          flex--align-items-flex-start
          flex-gap--3
        "
        :class="{ 'key-moments-recommendation-offers__row--retired': offer.isRetired }"
        :data-testid="`${testIdPrefix}-offer-${offer.offerId}`"
      >
        <div class="flex--grow-1">
          <div
            class="
              flex
              flex--align-items-center
              flex--wrap
              flex-gap--2
            "
          >
            <span class="key-moments-recommendation-offers__title text-color--text-heading">{{ offer.title }}</span>
            <PTag
              v-if="offer.categoryName !== undefined"
              :pContent="offer.categoryName"
              pColor="light-gray"
              pSize="small"
            />
            <!-- Same tags and colours as the offers catalogue -->
            <PTag
              v-for="tag in offer.tags ?? []"
              :key="tag"
              :pContent="tag"
              :pColor="offerTagColor(tag)"
              pSize="small"
            />
            <PTag
              v-if="offer.isRetired"
              :pContent="t('keyMoments.recommendations.offers.retired')"
              pColor="warning"
              pSize="small"
              :pTestId="`${testIdPrefix}-offer-${offer.offerId}-retired`"
            />
          </div>
          <p
            v-if="offer.shortDescription !== undefined"
            class="key-moments-recommendation-offers__description margin--0"
          >
            {{ offer.shortDescription }}
          </p>
          <!-- The catalogue itself: this module carries no detail drawer of its own -->
          <RouterLink
            v-if="offer.isRetired === false"
            :to="{ name: RouteName.OFFERS_CATALOG }"
            target="_blank"
            class="font-small"
            :data-testid="`${testIdPrefix}-offer-${offer.offerId}-more-link`"
          >
            {{ t('keyMoments.recommendations.offers.learnMore') }}
          </RouterLink>
        </div>

        <PButton
          pSize="small"
          pIconOnly
          pType="tertiary"
          :aria-label="t('keyMoments.recommendations.offers.detach')"
          :pTestId="`${testIdPrefix}-offer-${offer.offerId}-detach-button`"
          @click="detach(offer.offerId)"
        >
          <PIcon pName="trash" />
        </PButton>
      </li>
    </ul>

    <PButton
      class="margin-top--2"
      pSize="small"
      pType="tertiary"
      :pTestId="`${testIdPrefix}-attach-button`"
      @click="isPickerOpen = true"
    >
      {{ t('keyMoments.recommendations.offers.attach') }}
    </PButton>

    <RecommendationOffersPicker
      v-model="isPickerOpen"
      :catalog="catalog"
      :title="t('keyMoments.recommendations.offers.pickerTitle')"
      :initialSelection="offerIds"
      @validate="offerIds => emit('update', offerIds)"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { RouteName } from '@pulse/common/enums'
import { PButton, PIcon, PTag } from '@pulse/styleguide/components'
import RecommendationOffersPicker from './recommendation-offers-picker/recommendation-offers-picker.vue'
import { offerTagColor } from '../../utils/offers.utils'
import type { SearchableOffer } from '../../types/key-moments.types'
import type { ResolvedOffer } from '../../types/recommendations.types'

const props = defineProps<{
  offers: ResolvedOffer[]
  catalog: SearchableOffer[]
  testIdPrefix: string
}>()

const emit = defineEmits<{
  /** The whole list of attached offer ids, after a pick or a removal */
  update: [offerIds: number[]]
}>()

const { t } = useI18n()

const isPickerOpen = ref(false)

// Computed: a new array per render would re-render the picker of every card
const offerIds = computed(() => props.offers.map(offer => offer.offerId))

function detach(offerId: number): void {
  emit('update', offerIds.value.filter(candidate => candidate !== offerId))
}
</script>

<style lang="scss" scoped>
@use '../../styles/screen';

.key-moments-recommendation-offers {
  &__label {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    opacity: 0.7;
  }

  &__row {
    padding: 8px 0;
    border-bottom: 1px solid var(--key-moments-line);

    &--retired {
      opacity: 0.6;
    }
  }

  &__title {
    font-size: 13.5px;
    font-weight: 700;
  }

  &__description {
    @include screen.card-text;
  }
}
</style>
