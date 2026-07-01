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
        {{ headerText }}
      </p>
      <PButton
        v-if="isRecap === false"
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
      class="
        grid
        grid-cols--3
        grid-gap--4
        offer-plan-subscription__radio-grid
      "
      data-testid="offer-plan-subscription-radio-group"
    >
      <PRadioCard
        v-for="plan in plans"
        :key="plan.planId"
        :pLabel="plan.planId"
        :pTitle="plan.planName"
        :pDescription="plan.planDescription"
        :pDisabled="isRecap && plan.isSelected !== true"
        data-testid="offer-plan-subscription-radio-card"
      />
    </PRadioGroup>

    <!-- Pricing Selection Section -->
    <div
      v-if="shouldDisplayPricingSelection"
      class="margin-top--6"
      data-testid="offer-plan-subscription-pricing-section"
    >
      <p
        class="font-semibold margin-bottom--4"
        data-testid="offer-plan-subscription-pricing-note"
      >
        {{ pricingHeaderText }}
      </p>

      <PRadioGroup
        v-model="selectedPricingId"
        :class="[
          'grid',
          'grid-gap--4',
          'offer-plan-subscription__pricing-grid',
          pricingGridClass,
        ]"
        data-testid="offer-plan-subscription-pricing-radio-group"
      >
        <PRadioCard
          v-for="pricing in selectedPlanPricings"
          :key="pricing.planPricingId"
          :pLabel="pricing.planPricingId"
          :pDisabled="isRecap && pricing.isSelected !== true"
          pTitle=""
          data-testid="offer-plan-subscription-pricing-radio-card"
        >
          <template #default>
            <div>
              <!-- Free pricing: display only "Gratuit" -->
              <template v-if="pricing.price === 0">
                <span class="font-size--24 font-semibold">
                  {{ t('free') }}
                </span>
              </template>
              <!-- Paid pricing: display price, type and label -->
              <template v-else>
                <span class="font-size--24 font-semibold">
                  {{ pricing.price }}€
                </span>
                <span class="font-size--14 font-semibold text-color--gray-400">
                  /{{ pricing.priceType }}
                </span>
                <p class="font-size--14 margin-top--1">
                  {{ pricing.label }}
                </p>
              </template>
            </div>
          </template>
        </PRadioCard>
      </PRadioGroup>

      <PAlert
        v-if="isPremiumInternalise && isRecap === false"
        pType="info"
        pShowIcon
        :pClosable="false"
        class="margin-y--6"
        data-testid="offer-plan-subscription-premium-internalise-alert"
      >
        {{ t('premiumInternaliseInfoStart') }}
        <span class="font-semibold">{{ t('premiumInternaliseInfoBold') }}</span>
      </PAlert>
    </div>

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
          class="max-width-full offer-plan-subscription__pricing-image"
          data-testid="offer-plan-subscription-pricing-image"
        >
      </div>
    </PDialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { sanitizeUrl } from '@pulse/toolbox/utils/url'
import { PAlert, PButton, PRadioCard, PRadioGroup, PDialog } from '@pulse/styleguide/components'
import { VITE_PENNYLANE_PRICING_TABLE_URL } from 'env-vars'
import type { OfferPlanSubscriptionProps } from './OfferPlanSubscription.type'
import { useOfferPlanSubscription } from './use-offer-plan-subscription.composable'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
  messages: {
    'en-US': {
      planSelectionNote: '1. Select the subscription to activate for this customer',
      viewPricingTable: 'View pricing table',
      planSelectionRecap: '1. Activated subscription',
      pricingSelectionNote: '2. Choose the associated plan',
      pricingSelectionRecap: '2. Associated plan',
      free: 'Free',
      premiumInternaliseInfoStart: 'By default, the subscription will be activated as Premium,',
      premiumInternaliseInfoBold: 'please contact your Super User to switch the subscription to Premium Internalized.',
    },
    'fr-FR': {
      planSelectionNote: '1. Sélectionnez l\'abonnement à activer pour ce client',
      viewPricingTable: 'Voir la grille tarifaire',
      planSelectionRecap: '1. Abonnement activé',
      pricingSelectionNote: '2. Choisissez le forfait associé',
      pricingSelectionRecap: '2. Forfait associé',
      free: 'Gratuit',
      premiumInternaliseInfoStart: 'Par défaut l\'abonnement sera activé en Premium,',
      premiumInternaliseInfoBold: 'veuillez contacter votre Super User pour passer l\'abonnement en Premium Internalisé.',
    },
  },
})

const props = withDefaults(defineProps<OfferPlanSubscriptionProps>(), {
  isRecap: false,
})

const selectedPlanId = defineModel<number>('selectedPlanId')
const selectedPricingId = defineModel<number>('selectedPricingId')
const isPricingTableDialogVisible = ref(false)

const shouldDisplayPricingSelection = computed(() => {
  return selectedPlanPricings.value.length > 0
})

const sanitizedPricingTableUrl = computed(() => sanitizeUrl(VITE_PENNYLANE_PRICING_TABLE_URL))

const {
  selectedPlanPricings,
  pricingGridClass,
  isPremiumInternalise,
} = useOfferPlanSubscription({
  plans: toRef(props, 'plans'),
  isRecap: toRef(props, 'isRecap'),
  selectedPlanId,
  selectedPricingId,
})

const headerText = computed(() =>
  props.isRecap === true ? t('planSelectionRecap') : t('planSelectionNote'),
)

const pricingHeaderText = computed(() =>
  props.isRecap === true ? t('pricingSelectionRecap') : t('pricingSelectionNote'),
)

function openDialog() {
  isPricingTableDialogVisible.value = true
}
</script>

<style lang="scss" scoped>
@use '@pulse/styleguide/scss/breakpoints' as breakpoints;

.offer-plan-subscription__radio-grid {
  grid-auto-rows: 1fr;

  @include breakpoints.media(md) {
    grid-template-columns: repeat(2, 1fr);
  }

  // PRadioCard has default margin-bottom, remove it for grid layout
  :deep(.p-radio-card) {
    margin-bottom: 0;
    height: 100%;
  }

  // Increase padding for better visual spacing inside cards
  :deep(.p-radio-card__content) {
    padding: 24px !important;
    height: 100%;
  }
}

.offer-plan-subscription__pricing-image {
  max-height: 600px;
  object-fit: contain;
}

.offer-plan-subscription__pricing-grid {
  grid-auto-rows: 1fr;

  &.grid-cols--2 {
    @include breakpoints.media(sm) {
      grid-template-columns: 1fr;
    }
  }

  &.grid-cols--3 {
    @include breakpoints.media(md) {
      grid-template-columns: repeat(2, 1fr);
    }

    @include breakpoints.media(sm) {
      grid-template-columns: 1fr;
    }
  }

  // PRadioCard has default margin-bottom, remove it for grid layout
  :deep(.p-radio-card) {
    margin-bottom: 0;
    height: 100%;
  }

  // Align pricing content to the left instead of default center
  :deep(.p-radio-card .el-radio__label > div) {
    justify-content: flex-start;
  }

  // Increase padding for better visual spacing inside cards
  :deep(.p-radio-card__content) {
    padding: 24px !important;
  }
}
</style>

