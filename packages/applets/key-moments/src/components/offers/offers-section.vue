<template>
  <section
    :id="OFFERS_ANCHOR_ID"
    class="key-moments__screen key-moments-offers"
    data-testid="key-moments-offers-section"
  >
    <SectionHead
      :rank="rank"
      :subtitle="t('keyMoments.offers.subtitle')"
      :title="t('keyMoments.offers.title')"
    />

    <div class="key-moments-offers__grid">
      <OfferCard
        v-for="offer in offers"
        :key="offer.offerId"
        :offer="offer"
        :disabled="isSaving"
        @update="(patch, settle) => emit('update', offer.offerId, patch, settle)"
        @remove="emit('remove', offer.offerId)"
      />

      <!-- After the cards, where the next one will appear -->
      <PTooltip
        :pContent="t('keyMoments.offers.capReached', { count: OFFERS_CAP })"
        :disabled="isAtCap === false"
        pPlacement="top"
      >
        <button
          type="button"
          class="
            key-moments-offers__add
            flex
            flex--direction-column
            flex--align-items-center
            flex--justify-content-center
            flex-gap--3
            width--100
            font-size--13
            font-bold
            cursor-pointer
          "
          :disabled="isAtCap || isSaving"
          :aria-label="t('keyMoments.offers.add')"
          data-testid="key-moments-offers-add-button"
          @click="isPickerOpen = true"
        >
          <span
            class="
              key-moments-offers__add-icon
              flex
              flex--align-items-center
              flex--justify-content-center
            "
          >
            <PIcon pName="plusLg" pSize="22" />
          </span>
          <span>{{ t('keyMoments.offers.add') }}</span>
        </button>
      </PTooltip>
    </div>

    <OffersPicker
      v-model="isPickerOpen"
      :catalog="catalog"
      :attachedIds="attachedIds"
      :isAtCap="isAtCap"
      :isSaving="isSaving"
      :exerciceYear="exerciceYear"
      @choose="offer => emit('attach', offer)"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { PIcon, PTooltip } from '@pulse/styleguide/components'
import SectionHead from '../section-head/section-head.vue'
import OfferCard from './offer-card.vue'
import OffersPicker from './offers-picker.vue'
import { OFFERS_CAP } from '../../const/key-moments.consts'
import { OFFERS_ANCHOR_ID } from '../../utils/anchor.utils'
import type { LinkedOffer, SaveSettlement, SearchableOffer } from '../../types/key-moments.types'
import type {
  CatalogOfferPayload,
  LinkedOfferPayload,
} from '../../services/offers.service.types'

defineProps<{
  offers: LinkedOffer[]
  catalog: SearchableOffer[]
  attachedIds: Set<number>
  isAtCap: boolean
  /** Each gesture builds on the list last saved, so none is offered while a write is in flight */
  isSaving: boolean
  rank: string
  exerciceYear: string
}>()

const emit = defineEmits<{
  attach: [offer: CatalogOfferPayload]
  update: [offerId: number, patch: Partial<LinkedOfferPayload>, settle?: SaveSettlement]
  remove: [offerId: number]
}>()

const { t } = useI18n()

const isPickerOpen = ref(false)
</script>

<style lang="scss" scoped>
@use '../../styles/screen';

.key-moments-offers {
  &__grid {
    @include screen.offers-grid;
  }

  &__add {
    min-height: 180px;
    padding: 22px 24px;
    border: 2px dashed var(--key-moments-line);
    background: transparent;
    color: var(--p-text-heading);
    transition: border-color 0.2s, background-color 0.2s;

    &:hover:not(:disabled) {
      border-color: var(--p-jungle-400);
      background: var(--key-moments-stripe-surface);
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  &__add-icon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    color: var(--p-jungle-400);
    background-color: var(--p-humming-bird-100);
  }
}
</style>
