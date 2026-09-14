<template>
  <PDropdown
    v-model="selectedOfferType"
    class="subscriptions-filter__dropdown"
    :pPlaceholder="t('chooseAnOffer')"
    :pCheckAllLabel="t('allOffers')"
    :pOptions="offerTypeDropdown"
    pFilterable
    pMultiple
    pCollapseTags
    data-testid="subscription-filter-offers-dropdown"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { watch, onMounted, computed } from 'vue'
import { PDropdown } from '@pulse/styleguide/components'
import type { SubscriptionsFilterProps } from './SubscriptionsFilterTypes'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      allOffers: 'All offers',
      chooseAnOffer: 'Choose an offer',
    },
    'fr-FR': {
      allOffers: 'Toutes les offres',
      chooseAnOffer: 'Choisir une offre',
    },
  },
})

const props = defineProps<SubscriptionsFilterProps>()
const emit = defineEmits<{
  'apply-offer-filter': [void],
  'update:offerTypeSelection': [string[]]
}>()

const offerTypeDropdown = computed(() => {
  const baseOptions = [
    {
      pValue: 'MEG Smart',
      pLabel: 'MEG Smart',
    },
    {
      pValue: 'MEG Premium',
      pLabel: 'MEG Premium',
    },
    {
      pValue: 'Loop collaboratif',
      pLabel: 'Loop collaboratif',
    },
    {
      pValue: 'Forms',
      pLabel: 'Forms',
    },
    {
      pValue: 'Pennylane',
      pLabel: 'Pennylane',
    },
  ]

  return baseOptions
})

const selectedOfferType = computed({
  get() {
    return props.offerTypeSelection
  },
  set(value: string[]) {
    emit('update:offerTypeSelection', value)
  },
})

watch(selectedOfferType, () => {
  emit('apply-offer-filter')
})

onMounted(() => {
  selectedOfferType.value = offerTypeDropdown.value.map(
    ({ pValue }: { pValue: string }) => pValue,
  )
})
</script>

<style scoped>
.subscriptions-filter__dropdown {
  width: 240px;
}
</style>
