<template>
  <div class="margin-top--8">
    <div class="offer-details">
      <h3 class="offer-details__name">
        {{ subscriptionOffer.offerName }}
      </h3>
      <div
        v-if="subscriptionOffer.intranetLink"
        class="offer-details__intranet margin-left--4"
      >
        <PIcon color="#5546FF" size="16">
          <PILink45deg />
        </PIcon>
        <a
          class="offer-details__intranet-link font-base link margin-left--1"
          :href="subscriptionOffer.intranetLink"
          target="_blank"
        >
          {{ t('intranetLink') }}
        </a>
      </div>
    </div>
    <p class="font-base margin-y--7">
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
  intranetLink: 'Offer Intranet'
  servicesNotes: 'Enable or disable the services you want to provide for this folder'
fr-FR:
  intranetLink: "Intranet de l'offre"
  servicesNotes: 'Activez ou désactivez les services que vous souhaitez donner à ce dossier'
</i18n>
<script setup lang="ts">
import { PIcon, PILink45deg } from '@kpmg/styleguide'
import type { OfferSubscriptionProps } from './OfferSubscriptionTypes'
import OfferProviderProducts from './components/offer-provider-products/OfferProviderProducts.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

defineProps<OfferSubscriptionProps>()
</script>
<style lang="scss" scoped>
.offer-details {
  display: flex;
  align-items: center;
  flex: 0 0 auto;

  &__intranet {
    display: flex;
    align-items: center;
    flex: 0 0 auto;

    &-link {
      color: var(--el-color-persian-500);
      font-weight: 600;
      text-decoration: none;

      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
  }
}
</style>
