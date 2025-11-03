<template>
  <section
    class="widget-smart-intro flex bg--base-blue-pulse margin-bottom--10"
    data-testid="widget-pennylane-intro"
  >
    <div class="widget-smart-intro__main-section flex flex--direction-column padding-y--8 padding-x--6">
      <div class="widget-smart-intro__main-section-text text-color--base-white">
        <h2 class="h2">
          {{ t('widgets.smartIntro.discoverSmartDashboard.line1') }}<br>
          {{ t('widgets.smartIntro.discoverSmartDashboard.line2') }}<br>
          {{ t('widgets.smartIntro.discoverSmartDashboard.line3') }}
        </h2>

        <ul
          class="margin-y--4 padding-x--6"
          role="list"
        >
          <li>{{ t('widgets.smartIntro.features.measurePerformance') }}</li>
          <li>{{ t('widgets.smartIntro.features.manageCashFlow') }}</li>
          <li>{{ t('widgets.smartIntro.features.anticipateFinancialNeeds') }}</li>
          <li>{{ t('widgets.smartIntro.features.analyzeOrganization') }}</li>
        </ul>

        <PButton
          class="margin-top--2"
          pType="secondary"
          pSize="small"
          :pDisabled="isOfferActivatable === false"
          :aria-disabled="isOfferActivatable === false"
          data-testid="discover-smart-offer-button"
          @click="discoverSmartOffer"
        >
          {{ t('widgets.smartIntro.discover') }}
        </PButton>
      </div>
    </div>

    <PImage
      class="widget-smart-intro__image"
      pName="person-man-with-glasses"
      pFit="contain"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { PButton, PImage } from '@pulse/styleguide/components'
import { AmplitudeService } from '@pulse/common/services/amplitude'
import { useUserStore } from '@pulse/common/stores'
import { RouteName, RouteParam } from '@pulse/common/enums'

const { t } = useI18n({
  inheritLocale: true,
  useScope: 'global',
})

const router = useRouter()
const route = useRoute()
const { user } = useUserStore()

const isOfferActivatable = computed(() => {
  if (user?.isCollab === false) {
    return true
  } else {
    return false
  }
})

const discoverSmartOffer = () => {
  AmplitudeService.track('Power BI Home consulted', {
    powerbi_eligibility_home_type: 'clarity',
  })
  router.push({ name: RouteName.REPORTS, params: { [RouteParam.ENTITY_ID]: route.params.id } })
}
</script>

<style lang="scss" scoped>
.widget-smart-intro {
  overflow: hidden;
  position: relative;
  width: 100%;
  height: 400px;

  li {
    line-height: 18px;
  }

  &__main-section {
    flex: 1 1 auto;
    z-index: 2;

    &-text {
      width: 50%;

      @media screen and (max-width: 992px) {
        width: 100%;
      }
    }
  }

  &__image {
    z-index: 1;
    width: 100%;
    overflow: hidden;
    position: absolute;
    max-width: 430px;
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
