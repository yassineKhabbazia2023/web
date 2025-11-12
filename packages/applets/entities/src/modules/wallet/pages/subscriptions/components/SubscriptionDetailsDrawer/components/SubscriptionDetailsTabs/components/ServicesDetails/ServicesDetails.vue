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

  <OfferPlanSubscription
    v-if="subscriptionOfferDetails.plans !== undefined && subscriptionOfferDetails.plans.length > 0"
    :selected-plan-id="selectedPlanId"
    :plans="subscriptionOfferDetails.plans"
    class="margin-y--6"
    isRecap
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getSubscriptionProducts } from './utils/ServicesDetailsUtils'
import OfferProviderProducts from '@entities/components/OfferSubscription/components/offer-provider-products'
import OfferPlanSubscription from '@entities/components/OfferSubscription/components/OfferPlanSubscription/OfferPlanSubscription.vue'
import { OfferPlanManager } from '@entities/components/OfferSubscription/components/OfferPlanSubscription/offer-plan.manager'
import type { ServicesDetailsProps } from './ServicesDetailsTypes'
import type { SelectedProduct } from '@entities/types'

const props = defineProps<ServicesDetailsProps>()

const selectedProducts = ref<SelectedProduct[]>([])

const selectedPlanId = computed(() => {
  const selectedPlan = OfferPlanManager.getSelectedPlan(props.subscriptionOfferDetails.plans)
  return selectedPlan?.planId
})

onMounted(() => {
  selectedProducts.value = getSubscriptionProducts(
    props.subscriptionOfferDetails,
  )
})
</script>
