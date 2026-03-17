<template>
  <div>
    <div>
      <p class="subscription-offers__subtitle margin-bottom--7">
        {{ t('subtitle') }}
      </p>
      <div
        data-testid="offer-list"
      >
        <POfferCard
          v-for="{ offerId, logoName, offerName, offerLabel, offerCode } in subscriptionOffers"
          :key="offerId"
          class="margin-bottom--3"
          data-testid="offer-item"
          :pLogo="logoName"
          :pTitle="offerName"
          :pDescription="offerLabel"
          :pSelected="activeOffers.includes(offerCode)"
          :disabled="activeOffers.includes(offerCode)"
          @select-offer-event="onSelectOffer(offerId)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { POfferCard } from '@pulse/styleguide/components'
import type { SubscriptionOffersProps } from './SubscriptionOffersTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      subtitle: 'Select the offer you whish to activate for this folder',
    },
    'fr-FR': {
      subtitle: 'Sélectionnez l\'offre que vous souhaitez activer pour ce dossier',
    },
  },
})

const emit = defineEmits<{
  'selectOffer': [number]
}>()

defineProps<SubscriptionOffersProps>()

function onSelectOffer(selectedOfferId: number) {
  emit('selectOffer', selectedOfferId)
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

