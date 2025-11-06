<template>
  <div>
    <p class="font-semibold margin-bottom--4">
      {{ t('planSelectionNote') }}
    </p>
    <PRadioGroup v-model="selectedPlanId">
      <PRadioCard
        v-for="{ planId, planName } in plans"
        :key="planId"
        :pLabel="planId"
        :pTitle="planName"
        data-testid="offer-plan-subscription-radio-card"
      />
    </PRadioGroup>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { PRadioCard, PRadioGroup } from '@pulse/styleguide/components'
import type { OfferPlanSubscriptionProps } from './OfferPlanSubscription.type'
import { OfferPlanManager } from './offer-plan.manager'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

const props = defineProps<OfferPlanSubscriptionProps>()

const selectedPlanId = defineModel<number>('selectedPlanId')

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

<i18n lang="yaml">
en-US:
  planSelectionNote: 'Select the plan to activate for this customer'
fr-FR:
  planSelectionNote: "Sélectionnez le plan à activer pour ce client"
</i18n>
