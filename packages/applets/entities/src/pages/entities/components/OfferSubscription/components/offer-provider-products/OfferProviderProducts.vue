<template>
  <div v-if="services.length > 0" data-testid="offer-provider-products-wrapper">
    <POfferServicesCard
      data-testid="offer-services"
      :pLogo="offerProvider.logoName"
      :pTitle="title"
      :pServices="services"
      @change-service-status="onChangeServiceStatus"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { POfferServicesCard } from '@kpmg/styleguide'
import type { OfferProviderProductsProps, ExtendedService } from './OfferProviderProductsTypes'
import { getProviderServices, getTitle } from './OfferProviderProductsUtils'
import type { PService } from '@kpmg/styleguide'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'select-product': [number, number]
  'deselect-product': [number, number]
}>()

const labels = {
  included: t('included'),
  additionalPrice: t('additionalPrice'),
}

const props = withDefaults(defineProps<OfferProviderProductsProps>(), {
  isRecap: false,
})

const services = computed(() =>
  getProviderServices(
    props.offerId,
    props.offerProvider.products,
    props.selectedProducts,
    labels.included,
    labels.additionalPrice,
    props.isRecap,
  ),
)

const ProviderCategoryTitles: Record<string, string> = {
  pulse: t('platform'),
  external: t('provider'),
  internal: t('services'),
}

const title = computed(() => {
  const category = props.offerProvider.providerCategory.toLowerCase()
  const providerName = props.offerProvider.providerName

  return getTitle(
    ProviderCategoryTitles,
    category,
    providerName,
  )
})

function onChangeServiceStatus(service: PService) {
  const { productConfigurationId, pStatus } =
    service as ExtendedService // because ExtendedService is given to POfferServicesCard

  if (pStatus) {
    emit('select-product', props.offerId, productConfigurationId)
  } else {
    emit('deselect-product', props.offerId, productConfigurationId)
  }
}
</script>

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
