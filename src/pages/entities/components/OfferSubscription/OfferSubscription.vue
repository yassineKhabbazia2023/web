<template>
  <div>
    <p class="font-base padding-y--2 margin-bottom--3">
      {{ t('servicesNotes') }}
    </p>
    <OfferProviderProducts
      v-for="(provider, index) in subscriptionOffer.providers"
      :key="index"
      data-ut="provider-card"
      :offerProvider="provider"
      class="margin-bottom--3"
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

defineProps<OfferSubscriptionProps>()
</script>
