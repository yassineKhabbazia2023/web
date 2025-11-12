<template>
  <div data-testid="offer-plan-subscription">
    <div
      class="flex flex--align-items-center margin-bottom--4"
      data-testid="offer-plan-subscription-header"
    >
      <p
        class="font-semibold"
        data-testid="offer-plan-subscription-note"
      >
        {{ t('planSelectionNote') }}
      </p>
      <PButton
        pType="tertiary"
        class="text-underline text-color--persian-500"
        data-testid="offer-plan-subscription-view-pricing-button"
        @click="openDialog"
      >
        {{ t('viewPricingTable') }}
      </PButton>
    </div>

    <PRadioGroup
      v-model="selectedPlanId"
      data-testid="offer-plan-subscription-radio-group"
    >
      <PRadioCard
        v-for="{ planId, planName } in plans"
        :key="planId"
        :pLabel="planId"
        :pTitle="planName"
        data-testid="offer-plan-subscription-radio-card"
      />
    </PRadioGroup>

    <PDialog
      v-model="isPricingTableDialogVisible"
      pWidth="60%"
      pAlignCenter
      data-testid="offer-plan-subscription-pricing-dialog"
    >
      <div
        class="flex flex--justify-content-center flex--align-items-center"
        data-testid="offer-plan-subscription-pricing-image-container"
      >
        <img
          :src="sanitizedPricingTableUrl"
          class="offer-plan-subscription__pricing-image"
          data-testid="offer-plan-subscription-pricing-image"
        >
      </div>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@braintree/sanitize-url'
import { PButton, PRadioCard, PRadioGroup, PDialog } from '@pulse/styleguide/components'
import { VITE_PENNYLANE_PRICING_TABLE_URL } from 'env-vars'
import type { OfferPlanSubscriptionProps } from './OfferPlanSubscription.type'
import { OfferPlanManager } from './offer-plan.manager'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<OfferPlanSubscriptionProps>()

const selectedPlanId = defineModel<number>('selectedPlanId')
const isPricingTableDialogVisible = ref(false)

const sanitizedPricingTableUrl = computed(() => sanitizeUrl(VITE_PENNYLANE_PRICING_TABLE_URL))

function openDialog() {
  isPricingTableDialogVisible.value = true
}

function initializeSelectedPlan() {
  // Early return if already selected
  if (selectedPlanId.value != null) {
    return
  }

  // Use manager to get the default plan ID
  selectedPlanId.value = OfferPlanManager.getDefaultSelectedPlan(props.plans)
}

onMounted(() => {
  initializeSelectedPlan()
})
</script>

<style lang="scss" scoped>
.offer-plan-subscription__pricing-image {
  max-width: 100%;
  max-height: 600px;
  object-fit: contain;
}
</style>

<i18n lang="yaml">
en-US:
  planSelectionNote: 'Select the plan to activate for this customer'
  viewPricingTable: 'View pricing table'
fr-FR:
  planSelectionNote: "Sélectionnez le plan à activer pour ce client"
  viewPricingTable: "Voir la grille tarifaire"
</i18n>
