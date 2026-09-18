<template>
  <article
    class="
      key-moments-offer
      flex
      flex--direction-column
      position--relative
    "
    :class="{
      'key-moments-offer--hidden': offer.isHidden,
      'key-moments-offer--retired': offer.isRetired,
    }"
    :data-testid="`key-moments-offer-card-${offer.offerId}`"
  >
    <span
      v-if="offer.isHidden"
      class="key-moments-offer__badge position--absolute"
      :data-testid="`key-moments-offer-card-${offer.offerId}-hidden-badge`"
    >
      {{ t('keyMoments.offers.card.hiddenBadge') }}
    </span>

    <header
      class="
        flex
        flex--align-items-flex-start
        flex--justify-content-space-between
        flex-gap--3
      "
    >
      <div>
        <h3 class="key-moments-offer__title text-color--text-heading">
          {{ offer.title }}
        </h3>

        <!-- The very tags the picker was browsed by, so an offer is named the same way -->
        <div
          v-if="offer.tags !== undefined && offer.tags.length > 0"
          class="flex flex--wrap flex-gap--1 margin-top--1"
          :data-testid="`key-moments-offer-card-${offer.offerId}-tags`"
        >
          <PTag
            v-for="tag in offer.tags"
            :key="tag"
            :pContent="tag"
            :pColor="offerTagColor(tag)"
            pSize="small"
          />
        </div>
      </div>

      <div class="flex flex-gap--1">
        <PTooltip
          :pContent="offer.isHidden
            ? t('keyMoments.offers.card.show')
            : t('keyMoments.offers.card.hide')"
          pPlacement="top"
        >
          <PButton
            pSize="small"
            pIconOnly
            :pDisabled="disabled"
            :pTestId="`key-moments-offer-card-${offer.offerId}-hide-button`"
            @click="emit('update', { isHidden: offer.isHidden === false })"
          >
            <PIcon :pName="offer.isHidden ? 'eyeSlash' : 'eye'" />
          </PButton>
        </PTooltip>

        <PTooltip
          :pContent="t('keyMoments.offers.card.remove')"
          pPlacement="top"
        >
          <PButton
            pSize="small"
            pIconOnly
            :pDisabled="disabled"
            :pTestId="`key-moments-offer-card-${offer.offerId}-remove-button`"
            @click="emit('remove')"
          >
            <PIcon pName="trash" />
          </PButton>
        </PTooltip>
      </div>
    </header>

    <!-- Stated rather than dropped: taking a retired offer out is the firm's call -->
    <p
      v-if="offer.isRetired"
      class="key-moments-offer__retired font-italic"
      :data-testid="`key-moments-offer-card-${offer.offerId}-retired`"
    >
      {{ t('keyMoments.offers.card.retired') }}
    </p>

    <p
      v-if="offer.shortDescription !== undefined"
      class="key-moments-offer__description"
    >
      {{ offer.shortDescription }}
    </p>

    <div
      class="
        key-moments-offer__priority
        flex
        flex--align-items-center
        flex-gap--3
      "
    >
      <span class="key-moments-offer__label text-uppercase">{{ t('keyMoments.offers.card.priorityLabel') }}</span>

      <PDropdown
        class="key-moments-offer__priority-select"
        :modelValue="offer.priority ?? NO_PRIORITY"
        :pOptions="priorityOptions"
        :pAriaLabel="t('keyMoments.offers.card.priorityLabel')"
        :pDisabled="disabled"
        pSize="small"
        :pTestId="`key-moments-offer-card-${offer.offerId}-priority-select`"
        @update:model-value="onSelectPriority"
      />
    </div>

    <!-- Inert and unticked without a degree: there is nothing to keep back -->
    <PTooltip
      :pContent="t('keyMoments.offers.card.priorityHiddenHint')"
      :disabled="offer.priority !== undefined"
      pPlacement="top"
    >
      <PCheckbox
        :modelValue="isPriorityHidden"
        :pDisabled="offer.priority === undefined || disabled"
        :pTestId="`key-moments-offer-card-${offer.offerId}-priority-hidden-checkbox`"
        @update:model-value="onTogglePriorityHidden"
      >
        {{ t('keyMoments.offers.card.priorityHidden') }}
      </PCheckbox>
    </PTooltip>

    <!-- Takes the free height so that the notes sit at the foot of the card -->
    <div class="key-moments-offer__filler" />

    <CommentBox
      :testIdPrefix="`key-moments-offer-card-${offer.offerId}-comment`"
      :title="t('keyMoments.offers.card.commentTitle')"
      :text="offer.comment"
      :placeholder="t('keyMoments.offers.card.commentPlaceholder')"
      :emptyLabel="t('keyMoments.offers.card.commentEmpty')"
      :rows="3"
      :maxLength="OFFER_COMMENT_MAX_LENGTH"
      isEditable
      @save="(comment, settle) => emit('update', { comment }, settle)"
    />

    <CommentBox
      :testIdPrefix="`key-moments-offer-card-${offer.offerId}-benefits-comment`"
      :title="t('keyMoments.offers.card.benefitsCommentTitle')"
      :text="offer.benefitsComment"
      :placeholder="t('keyMoments.offers.card.benefitsCommentPlaceholder')"
      :emptyLabel="t('keyMoments.offers.card.benefitsCommentEmpty')"
      :rows="3"
      :maxLength="OFFER_COMMENT_MAX_LENGTH"
      isEditable
      @save="(benefitsComment, settle) => emit('update', { benefitsComment }, settle)"
    />
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PButton, PCheckbox, PDropdown, PIcon, PTag, PTooltip } from '@pulse/styleguide/components'
import CommentBox from '../comment/comment-box.vue'
import { OfferPriority } from '../../enums/key-moments.enums'
import { OFFER_COMMENT_MAX_LENGTH, offerTagColor } from '../../utils/offers.utils'
import type { LinkedOffer, SaveSettlement } from '../../types/key-moments.types'
import type { LinkedOfferPayload } from '../../services/offers.service.types'

// A dropdown cannot hold `undefined`, so the absence of degree travels as a sentinel
const NO_PRIORITY = 'none'

const props = defineProps<{
  offer: LinkedOffer
  disabled: boolean
}>()

const emit = defineEmits<{
  /** Only a note carries a settlement: a switch waits for nothing */
  update: [patch: Partial<LinkedOfferPayload>, settle?: SaveSettlement]
  remove: []
}>()

const { t } = useI18n()

const priorityOptions = computed(() => [
  ...Object.values(OfferPriority).map(priority => ({
    pValue: priority as string,
    pLabel: t(`keyMoments.offers.priority.${priority}`),
  })),
  { pValue: NO_PRIORITY, pLabel: t('keyMoments.offers.card.priorityNone') },
])

const isPriorityHidden = computed(() => props.offer.priority !== undefined
  && props.offer.isPriorityVisible === false)

function onTogglePriorityHidden(isHidden: boolean) {
  emit('update', { isPriorityVisible: isHidden === false })
}

function onSelectPriority(value: unknown) {
  emit('update', {
    priority: value === NO_PRIORITY ? undefined : value as OfferPriority,
  })
}

</script>

<style lang="scss" scoped>
@use '../../styles/screen';

.key-moments-offer {
  @include screen.block;

  gap: 0.75rem;

  // The entrance animation fills forwards, so the opacity must be the value it ends on
  &--hidden,
  &--retired {
    --key-moments-enter-opacity: 0.5;

    opacity: var(--key-moments-enter-opacity);
  }

  &__badge {
    @include screen.badge;

    top: 0;
    right: 0;
    border-left: 1px solid var(--key-moments-line);
    border-bottom: 1px solid var(--key-moments-line);
  }

  &__title {
    @include screen.card-title;
  }

  &__description,
  &__retired {
    @include screen.card-text;
  }

  &__label {
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.08em;
    opacity: 0.7;
  }

  &__priority-select {
    flex: 1;
    min-width: 0;
  }

  &__filler {
    flex: 1;
  }

}
</style>
