<template>
  <OfferProviderProducts
    v-for="(provider, index) in subscriptionOfferDetails.providers"
    :key="index"
    data-testid="provider-card"
    :offerProvider="provider"
    :offerId="subscriptionOfferDetails.offerId"
    :selectedProducts="selectedProducts"
    class="margin-bottom--3"
    isRecap
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getSubscriptionProducts } from './utils/ServicesDetailsUtils'
import OfferProviderProducts from '@entities/pages/entities/components/OfferSubscription/components/offer-provider-products'
import type { ServicesDetailsProps } from './ServicesDetailsTypes'
import type { SelectedProduct } from '@entities/common/types'

const props = defineProps<ServicesDetailsProps>()

const selectedProducts = ref<SelectedProduct[]>([])

onMounted(() => {
  selectedProducts.value = getSubscriptionProducts(
    props.subscriptionOfferDetails,
  )
})
</script>
