<template>
  <section
    :id="OFFERS_ANCHOR_ID"
    class="key-moments__screen key-moments-customer-offers"
    data-testid="customer-key-moments-offers-section"
  >
    <SectionHead
      :rank="rank"
      :subtitle="t('keyMoments.offers.subtitle')"
      :title="t('keyMoments.offers.title')"
    />

    <div class="key-moments-customer-offers__grid">
      <!-- No thumbnail nor brochure: their route is closed to a client token -->
      <article
        v-for="offer in offers"
        :key="offer.offerId"
        class="
          key-moments-customer-offers__card
          flex
          flex--direction-column
          flex--align-items-flex-start
        "
        :data-testid="`customer-key-moments-offer-${offer.offerId}`"
      >
        <p
          v-if="offer.categoryName !== undefined"
          class="key-moments-customer-offers__category"
        >
          {{ offer.categoryName }}
        </p>

        <h3 class="key-moments-customer-offers__card-title text-color--text-heading">
          {{ offer.title }}
        </h3>

        <!-- A hidden priority and a missing one must look the same to the client -->
        <PTag
          v-if="offer.priority !== undefined"
          :pContent="t(`keyMoments.offers.priority.${offer.priority}`)"
          :pColor="PRIORITY_COLOR[offer.priority]"
          pSize="small"
          :data-testid="`customer-key-moments-offer-${offer.offerId}-priority`"
        />

        <p
          v-if="offer.shortDescription !== undefined"
          class="key-moments-customer-offers__description"
        >
          {{ offer.shortDescription }}
        </p>

        <div class="key-moments-customer-offers__filler" />

        <CommentBox
          v-if="isNotNullNorEmpty(offer.comment)"
          class="width--100 margin-top--1"
          :testIdPrefix="`customer-key-moments-offer-${offer.offerId}-comment`"
          :title="t('keyMoments.offers.card.commentTitle')"
          :text="offer.comment"
        />

        <CommentBox
          v-if="isNotNullNorEmpty(offer.benefitsComment)"
          class="width--100 margin-top--1"
          :testIdPrefix="`customer-key-moments-offer-${offer.offerId}-benefits-comment`"
          :title="t('keyMoments.offers.card.benefitsCommentTitle')"
          :text="offer.benefitsComment"
        />
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { isNotNullNorEmpty } from '@pulse/toolbox/utils/validator'
import { PTag } from '@pulse/styleguide/components'
import SectionHead from '../section-head/section-head.vue'
import CommentBox from '../comment/comment-box.vue'
import { OfferPriority } from '../../enums/key-moments.enums'
import { OFFERS_ANCHOR_ID } from '../../utils/anchor.utils'
import type { PTagProps } from '@pulse/styleguide/types'
import type { CustomerOfferPayload } from '../../services/customer-key-moments.service.types'

const PRIORITY_COLOR: Record<OfferPriority, PTagProps['pColor']> = {
  [OfferPriority.PRIMARY]: 'warning',
  [OfferPriority.SIGNIFICANT]: 'blue',
  [OfferPriority.INFORMATIVE]: 'tranquil',
}

defineProps<{
  offers: CustomerOfferPayload[]
  rank: string
}>()

const { t } = useI18n()
</script>

<style lang="scss" scoped>
@use '../../styles/screen';

.key-moments-customer-offers {
  &__grid {
    @include screen.offers-grid;
  }

  &__card {
    @include screen.block;

    gap: 10px;
  }

  &__category {
    @include screen.overline;
  }

  &__card-title {
    @include screen.card-title;
  }

  &__description {
    @include screen.card-text;
  }

  &__filler {
    flex: 1;
  }
}
</style>
