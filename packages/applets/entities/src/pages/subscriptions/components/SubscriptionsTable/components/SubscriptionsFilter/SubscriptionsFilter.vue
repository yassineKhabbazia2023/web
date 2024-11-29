<template>
  <div class="subscription-filter-options margin-y--6">
    <PDropdown
      v-model="offerTypeSelection"
      :pPlaceholder="t('chooseAnOffer')"
      :pCheckAllLabel="t('allOffers')"
      :pOptions="offerTypeDropdown"
      pFilterable
      pMultiple
      data-testid="subscription-filter-offers-dropdown"
      @change="handleOfferTypeFilter"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { ref, watch, onMounted } from 'vue'
import { PDropdown } from '@pulse/styleguide/components'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const emit = defineEmits<{
  'apply-offer-filter': [string[]]
}>()

const offerTypeSelection = ref<string[]>([])
const selectAllOfferTypes = ref(true)
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

const handleSelectAllOfferTypes = (isChecked: boolean) => {
  if (isChecked) {
    offerTypeSelection.value = offerTypeDropdown.map(
      ({ pValue }: { pValue: string }) => pValue,
    )
  } else {
    offerTypeSelection.value = []
  }
  handleOfferTypeFilter()
}
const handleOfferTypeFilter = () => {
  emit('apply-offer-filter', offerTypeSelection.value)
}

watch(offerTypeSelection, (val) => {
  selectAllOfferTypes.value = val.length === offerTypeDropdown.length
})

onMounted(() => {
  handleSelectAllOfferTypes(true)
})
</script>

<i18n lang="yaml">
en-US:
  allOffers: 'All offers'
  chooseAnOffer: 'Choose an offer'
fr-FR:
  allOffers: 'Toutes les offres'
  chooseAnOffer: 'Choisir une offre'
</i18n>
