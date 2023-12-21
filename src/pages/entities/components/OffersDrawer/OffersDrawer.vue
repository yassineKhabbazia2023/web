<template>
  <div>
    <PDrawer
      v-model="internalIsOpened"
      :pTitle="t('drawerTitle')"
      :pShowPreviousStep="false"
      pSize="50%"
      pDirection="rtl"
      class="drawer"
      @close-drawer-button="closeOffersDrawer"
      data-ut="drawer"
    >
      <template v-if="internalIsOpened">
        <OfferSubscription
          v-if="!!currentSubscriptionOffer"
          data-ut="offer"
          :subscriptionOffer="currentSubscriptionOffer"
        />
        <SubscriptionOffers
          v-else
          data-ut="offers"
          :subscriptionOffers="subscriptionOffers"
          @select-offer="onSelectOffer"
        />
      </template>
      <template #footer>
        <NextPreviousButtons
          data-ut="nextPreviousButtons"
          v-if="!!currentSubscriptionOffer"
          :previousLabel="t('previousLabel')"
          :nextLabel="t('nextLabel')"
          @click-previous="onClickPrevious"
        />
      </template>
    </PDrawer>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    drawerTitle: 'Offers available on this folder'
    previousLabel: 'Previous'
    nextLabel: 'Next'
  fr-FR:
    drawerTitle: 'Offres activables sur ce dossier'
    previousLabel: 'Précédent'
    nextLabel: 'Suivant'
</i18n>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { PDrawer } from '@kpmg/styleguide'
import type { OffersDrawerProps } from './OffersDrawerTypes'
import SubscriptionOffers from '../SubscriptionOffers'
import OfferSubscription from '../OfferSubscription'
import NextPreviousButtons from '../NextPreviousButtons'
import type {
  SubscriptionOffer,
  SubscriptionOfferServices
} from '../SubscriptionOffers/SubscriptionOffersTypes'
import { getAllOffers, getOffer } from '@/services/offer'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const props = defineProps<OffersDrawerProps>()

const currentSubscriptionOffer = ref<SubscriptionOfferServices | undefined>()
const subscriptionOffers = ref<SubscriptionOffer[]>([])

const internalIsOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const setSelectedOffer = async (selectedOfferId?: number | undefined) => {
  if (selectedOfferId === undefined) {
    currentSubscriptionOffer.value = undefined
    return
  }
  currentSubscriptionOffer.value = await getOffer(selectedOfferId)
}

function onClickPrevious() {
  setSelectedOffer()
}

function onSelectOffer(offerId: number) {
  setSelectedOffer(offerId)
}

const closeOffersDrawer = () => {
  internalIsOpened.value = false
}

onMounted(async () => {
  subscriptionOffers.value = await getAllOffers()
})
</script>
