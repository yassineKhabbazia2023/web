<template>
  <div class="subscription-filter-options margin-y--6">
    <PDropdown
      v-model="selectedOfferType"
      :pPlaceholder="t('chooseAnOffer')"
      :pCheckAllLabel="t('allOffers')"
      :pOptions="offerTypeDropdown"
      pFilterable
      pMultiple
      data-testid="subscription-filter-offers-dropdown"
    />
  </div>
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

const offerTypeDropdown = [
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
  selectedOfferType.value = offerTypeDropdown.map(
    ({ pValue }: { pValue: string }) => pValue,
  )
})
</script>

