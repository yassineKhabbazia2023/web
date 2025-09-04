<template>
  <div
    class="
      smart-offer-activation__main-section
      flex
      bg--base-blue-pulse
      margin-bottom--10
    "
  >
    <div class="smart-offer-activation__main-section-text flex flex--direction-column padding-y--8 padding-x--6">
      <div class="text-color--base-white">
        <h2 class="h2">
          {{ t('smartDashboardCTA') }}
        </h2>
        <ul class="margin-y--4 padding-x--6">
          <li>{{ t('features.measurePerformance') }}</li>
          <li>{{ t('features.manageCashFlow') }}</li>
          <li>{{ t('features.anticipateFinancialNeeds') }}</li>
          <li>{{ t('features.analyzeOrganization') }}</li>
        </ul>
        <PButton
          class="margin-top--2"
          pType="secondary"
          pSize="small"
          :pDisabled="user?.isCollab === true"
        >
          {{ t('activateTrial') }}
        </PButton>
      </div>
    </div>
    <PImage
      class="smart-offer-activation__main-section-image"
      pName="two-persons-in-discussion"
      pFit="contain"
    />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { PButton, PImage } from '@pulse/styleguide/components'
import { useUserStore } from '@pulse/common/stores'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'local',
})

// #region manage trial activation
const { user } = useUserStore()
// #endregion
</script>

<style lang="scss" scoped>
.smart-offer-activation__main-section {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 300px;

  li {
    line-height: 18px;
  }

  &-text {
    flex: 1 1 auto;
    z-index: 2;
  }

  &-image {
    z-index: 1;
    width: 100%;
    overflow: hidden;
    position: absolute;
    max-width: 600px;
    right: -20px;
    top: 0;
    bottom: 0;

    @media screen and (max-width: 992px) {
      display: none;
    }
  }

  @media screen and (max-width: 992px) {
    height: auto;
  }
}
</style>

<i18n lang="yaml">
  en-US:
    activateTrial: "Activate the trial offer"
    smartDashboardCTA: "Try the SMART dashboard for free"
    features:
      measurePerformance: "Measure your company's performance"
      manageCashFlow: "Proactively manage your cash flow to secure your business's sustainability"
      anticipateFinancialNeeds: "Anticipate financial needs"
      analyzeOrganization: "Analyze your company's organizational dynamics and HR structure"
  fr-FR:
    activateTrial: "Activez l'offre d'essai"
    smartDashboardCTA: "Testez gratuitement le tableau de bord SMART"
    features:
      measurePerformance: "Mesurez la performance de votre entreprise"
      manageCashFlow: "Pilotez votre trésorerie de manière proactive pour sécuriser la pérennité de votre activité"
      anticipateFinancialNeeds: "Anticipez les besoins financiers"
      analyzeOrganization: "Analysez la dynamique organisationnelle et la structure RH de votre entreprise"
</i18n>
