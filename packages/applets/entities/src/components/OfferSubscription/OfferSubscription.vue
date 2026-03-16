<template>
  <div>
    <p class="font-base padding-y--2 margin-bottom--3">
      {{ t('servicesNotes') }}
    </p>
    <OfferProviderProducts
      v-for="(provider, index) in subscriptionOffer.providers"
      :key="index"
      data-testid="provider-card"
      :offerProvider="provider"
      :offerId="subscriptionOffer.offerId"
      :selectedProducts="selectedProducts"
      class="margin-bottom--3"
      @select-product="onSelectProduct"
      @deselect-product="onDeselectProduct"
    />
    <OfferPlanSubscription
      v-if="subscriptionOffer.plans !== undefined && subscriptionOffer.plans.length > 0"
      v-model:selected-plan-id="selectedPlanId"
      v-model:selected-pricing-id="selectedPricingId"
      :plans="subscriptionOffer.plans"
      class="margin-bottom--6"
    />
  </div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import OfferProviderProducts from './components/offer-provider-products/OfferProviderProducts.vue'
import OfferPlanSubscription from './components/OfferPlanSubscription/OfferPlanSubscription.vue'
import type { OfferSubscriptionProps } from './OfferSubscriptionTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

defineProps<OfferSubscriptionProps>()

const selectedPlanId = defineModel<number>('selectedPlanId')
const selectedPricingId = defineModel<number>('selectedPricingId')

const emit = defineEmits<{
  'select-product': [number, number]
  'deselect-product': [number, number]
}>()

function onSelectProduct(offerId: number, productId: number) {
  emit('select-product', offerId, productId)
}

function onDeselectProduct(offerId: number, productId: number) {
  emit('deselect-product', offerId, productId)
}

</script>
<i18n lang="yaml">
en-US:
  servicesNotes: 'Enable or disable the services you want to provide for this folder'
fr-FR:
  servicesNotes: 'Activez ou désactivez les services que vous souhaitez donner à ce dossier'
</i18n>
