<template>
  <POfferServicesCard
    data-ut="offer-services"
    :pLogo="offerProvider.logoName"
    :pTitle="getProviderName"
    :pServices="offerProviderProducts"
  />
</template>

<i18n lang="yaml">
en-US:
  included: 'Included'
  additionalPrice: 'Additional price'
  platform: 'Platform services'
  provider: "Partner's services"
  services: 'Services'
fr-FR:
  included: 'Inclus'
  additionalPrice: 'Prix additionnel'
  platform: 'Les services de la plateforme'
  provider: 'Les services du partenaire'
  services: 'Les services'
</i18n>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { POfferServicesCard } from '@kpmg/styleguide'
import type { OfferProviderProductsProps } from './OfferProviderProductsTypes'
import type {
  SubscriptionOfferProduct
} from '@/pages/entities/components/SubscriptionOffers/SubscriptionOffersTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})
const props = defineProps<OfferProviderProductsProps>()
const offerProviderProducts = ref<any>([])

const getProviderName = computed(() => {
  const { providerName, providerCategory } = props.offerProvider
  switch (providerCategory.toLowerCase()) {
    case 'pulse':
      return `${t('platform')} ${providerName}`
    case 'external':
      return `${t('provider')} ${providerName}`
    case 'internal':
      return `${t('services')} ${providerName}`
    default:
      return providerName
  }
})

const getServicePriceTag = (service: any) => {
  const pEffect = 'light'

  if (!service.isOptionnal) {
    return {
      pColor: 'gray-900',
      pEffect,
      pContent: t('included')
    }
  }
  if (service.priceType === 'Exacte') {
    return {
      pColor: 'amethyste',
      pEffect,
      pContent: t('additionalPrice')
    }
  }
}

const getProviderProducts = () => {
  // Format product data to match component props
  props.offerProvider?.products.forEach(
    (offerProduct: SubscriptionOfferProduct) => {
      offerProviderProducts.value.push({
        pStatus:
          !offerProduct.isOptionnal ||
          (offerProduct.isOptionnal && offerProduct.priceType === 'free'),
        pDisabled: !offerProduct.isOptionnal,
        pName: offerProduct.productLabel,
        pTag: getServicePriceTag(offerProduct)
      })
    }
  )
}

onMounted(() => {
  getProviderProducts()
})
</script>
