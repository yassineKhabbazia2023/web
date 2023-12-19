<template>
  <div>
    <div>
      <p class="subscription-offers__subtitle margin-bottom--7">
        {{ t('subtitle') }}
      </p>
      <div
        data-ut="offer-list"
      >
        <POfferCard
          v-for="{ offerId, logoName, offerName, offerLabel } in subscriptionOffers"
          :key="offerId"
          class="margin-bottom--3"
          data-ut="offer-item"
          :pLogo="logoName"
          :pTitle="offerName"
          :pDescription="offerLabel"
          @select-offer-event="onSelectOffer(offerId)"
        />
      </div>
    </div>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    subtitle: 'Select the offer you whish to activate for this folder'
  fr-FR:
    subtitle: "Sélectionnez l'offre que vous souhaitez activer pour ce dossier"
</i18n>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { POfferCard } from '@kpmg/styleguide'
import type { SubscriptionOffer, SubscriptionOffersProps } from './SubscriptionOffersTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits<{
  'selectOffer': [SubscriptionOffer|undefined]
}>()

const props = defineProps<SubscriptionOffersProps>()

function onSelectOffer(selectedOfferId: string) {
  const subscriptionOffer = props.subscriptionOffers
    .find(({ offerId }) => offerId === selectedOfferId)

  emit('selectOffer', subscriptionOffer)
}
</script>

<style lang="scss" scoped>
.subscription-offers {
  &__subtitle {
    font-size: 1.4rem;
    line-height: 120%;
    font-style: normal;
    color: var(--pulse-color-neutral-gray-900);
  }
}
</style>
