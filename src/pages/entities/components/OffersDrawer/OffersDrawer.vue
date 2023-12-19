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
    >
      <SubscriptionOffers
        v-if="internalIsOpened"
        data-ut="offers"
        :subscriptionOffers="subscriptionOffers"
      />
    </PDrawer>
  </div>
</template>

<i18n lang="yaml">
  en-US:
    drawerTitle: 'Offers available on this folder'
  fr-FR:
    drawerTitle: 'Offres activables sur ce dossier'
</i18n>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  PDrawer
} from '@kpmg/styleguide'
import type { OffersDrawerProps } from './OffersDrawerTypes'
import SubscriptionOffers from '../SubscriptionOffers'
import type { SubscriptionOffer } from '../SubscriptionOffers/SubscriptionOffersTypes'
import { getAllOffers } from '@/services/offer'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const emit = defineEmits<{
  'update:modelValue': [boolean]
}>()

const props = defineProps<OffersDrawerProps>()
const subscriptionOffers = ref<SubscriptionOffer[]>([])

const internalIsOpened = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const closeOffersDrawer = () => {
  internalIsOpened.value = false
}

onMounted(async () => {
  subscriptionOffers.value = await getAllOffers()
})
</script>
