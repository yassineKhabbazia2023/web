<template>
  <div class="subscription-demand">
    <PDrawer
      v-model="drawerModel"
      :title="t('drawerTitle')"
      :showPreviousStep="false"
      size="50%"
      direction="rtl"
      class="drawer"
    >
      <div class="subscription-demand__header">
        <p class="subscription-demand__description margin-bottom--7">
          {{ t('subTitle') }}
        </p>
      <div
        v-for="offer in OfferList"
        :key="offer.globalOfferId"
      >
        <POfferCard
          class="margin-bottom--3"
          :pLogo="offer.logoName"
          :pTitle="offer.offerName"
          :pDescription="offer.offerLabel"
        />
      </div>
    </div>
    </PDrawer>
  </div>
</template>

<i18n lang="yaml">
    en-US:
      drawerTitle: 'Offers activatable on this folder'
      subTitle: 'Select the offer you want to activate for this folder'
    fr-FR:
      drawerTitle: 'Offres activable sur ce dossier'
      subTitle: 'Sélectionnez l''offre que vous souhaitez activer pour ce dossier'
</i18n>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PDrawer,
  POfferCard
} from '@kpmg/styleguide'
import { OfferSubscription } from './OfferSubscriptionsTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: Boolean
})

const drawerModel = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const OfferList: OfferSubscription[] = [{
  offerName: 'Gestion Smart',
  offerLabel: 'Mon Expert en Gestion (MEG) en version start (inclu dans Pulse)',
  logoName: 'meg',
  globalOfferId: '0909484872764664525626',
  offerPrice: 0,
  providers: [],
  approvalRequired: true
},
{
  offerName: 'Gestion Premium',
  offerLabel: 'Mon expert en gestion en version premium',
  logoName: 'meg',
  globalOfferId: '0909484872764664525626',
  offerPrice: 0,
  providers: [],
  approvalRequired: true
},
{
  offerName: 'Mes Modules de Compta',
  offerLabel: 'Loop collaboratif (myPulse compta)',
  logoName: 'loop-color',
  globalOfferId: '0909484872764664525626',
  offerPrice: 0,
  providers: [],
  approvalRequired: true
},
{
  offerName: 'Externalisation de la paie',
  offerLabel: 'Gestion de la paie par KPMG, pour le clients, sur Silae',
  logoName: 'silae-color',
  globalOfferId: '0909484872764664525626',
  offerPrice: 0,
  providers: [],
  approvalRequired: true
},
{
  offerName: 'Mes modules de paie',
  offerLabel: 'Gestion de la paie par le client , sous supervision kpmg, sur Silae',
  logoName: 'silae-color',
  globalOfferId: '0909484872764664525626',
  offerPrice: 0,
  providers: [],
  approvalRequired: true
},
{
  offerName: 'Ma Banque',
  offerLabel: 'Visualisation des données bancaires',
  logoName: 'iconpulse-color',
  globalOfferId: '0909484872764664525626',
  offerPrice: 0,
  providers: [],
  approvalRequired: true
}]
</script>
  <style lang="scss" scoped>
.subscription-demand {
  &__description {
    font-size: 1.4rem;
    line-height: 120%;
    font-style: normal;
    color: var(--pulse-color-neutral-gray-900);
  }
}
</style>
