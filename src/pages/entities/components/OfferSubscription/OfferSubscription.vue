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
  </div>
</template>
<i18n lang="yaml">
en-US:
  servicesNotes: 'Enable or disable the services you want to provide for this folder'
fr-FR:
  servicesNotes: 'Activez ou désactivez les services que vous souhaitez donner à ce dossier'
</i18n>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import OfferProviderProducts from './components/offer-provider-products/OfferProviderProducts.vue'
import type { OfferSubscriptionProps } from './OfferSubscriptionTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits<{
  'select-product': [number, string],
  'deselect-product': [number, string]
}>()

function onSelectProduct(offerId: number, productId: string) {
  emit('select-product', offerId, productId)
}

function onDeselectProduct(offerId: number, productId: string) {
  emit('deselect-product', offerId, productId)
}

defineProps<OfferSubscriptionProps>()
</script>
